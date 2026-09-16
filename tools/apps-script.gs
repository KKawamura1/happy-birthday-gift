/**
 * ほしいものクイズの受け口（Google Apps Script）
 *
 * スプレッドシートに紐づけたスクリプトとして貼り付け、「ウェブアプリ」として
 * デプロイすると、母が選択肢を押すたびに doPost が呼ばれて行が書き換わります。
 *
 * ■ 前提
 *   このURLは秘密にできません。ページのソースを見れば誰でも読めます。
 *   なので「知られない」ことではなく、「知られても大したことができない」ことで守ります。
 *   ここで効かせているのは次のとおりです。
 *
 *     - 合言葉が合わないPOSTは捨てる（通りすがりの機械よけ。認証ではありません）
 *     - 本文のサイズ・項目の長さ・配列の個数を、すべて上限で切る
 *     - 1セッションあたり、および全体あたりの書き込み回数を制限する
 *     - 新しく作れる行数に上限を設ける（際限なく増やされないように）
 *     - 数式として解釈される先頭文字を無害化する（シート上で実行されるのを防ぐ）
 *     - メールは1日の上限を決め、本文も切り詰める
 *     - 何を弾いたかは返さない（探りに情報を与えない）
 *
 * ■ 列の構成が変わったとき
 *   古いシートは answers_old_日時 という名前に変えて残し、新しいシートを
 *   自動で作り直します。手で直す必要はありません。
 *
 * ■ 万一おかしなデータが入ったら
 *   デプロイを削除すればURLは即座に死にます。作り直して、GitHub の
 *   Secrets（REPORT_ENDPOINT / REPORT_TOKEN）を差し替えてください。
 */

/*
 * 版。コードを直したらここも上げる。
 * デプロイのURLをブラウザで開くと、いま動いている版と列の構成が見られます。
 * 直したのに古い版が表示されるときは、デプロイが更新されていません（README参照）。
 */
const VERSION = '2026-09-16 迷った跡';

/* ===== 設定 ===== */

/** 書き込むシートの名前。無ければ自動で作ります */
const SHEET_NAME = 'answers';

/** config 側の REPORT_TOKEN と同じ文字列。空にするとこの確認を飛ばします */
const SHARED_TOKEN = '';

/** 通知先のメールアドレス。空にするとメールは送りません */
const NOTIFY_EMAIL = '';

/** true なら、母が最後に1つ選んだときだけメールする（毎回は送らない） */
const NOTIFY_ONLY_WHEN_FINISHED = true;

/* ===== 上限 ===== */

const MAX_BODY_CHARS = 16000;         // 受け取る本文の長さ（文字数）
const MAX_JOURNAL = 80;               // 迷った跡として受け取るできごとの数
const MAX_SESSIONS = 300;             // 作れる行数（これを超えたら新規は断る）
const MAX_WRITES_PER_SESSION = 60;    // 同じ回答者からの書き込み（15分あたり）
const MAX_WRITES_PER_HOUR = 600;      // 全体の書き込み（1時間あたり）
const MAX_EMAILS_PER_DAY = 20;        // メールの本数

const NEWLINE = String.fromCharCode(10);

/* 金額の列は置かない。値段を見せると遠慮が入ってしまうため */
const HEADERS = [
  '更新日時', 'セッション', '回答数', '選び終わった',
  '選んだもの', 'ひとこと', 'キーワード',
  '1位', '2位', '3位', '回答の全部', '迷った跡', '通知済み'
];

/* ===== 受け口 ===== */

function doPost(e) {
  try {
    const data = accept(e);
    if (!data) return reply();

    const lock = LockService.getScriptLock();
    if (!lock.tryLock(20000)) return reply();
    try {
      write(data);
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
  }
  /* 通っても弾いても同じ返事にする */
  return reply();
}

/**
 * ブラウザでURLをそのまま開いたときに出るもの。
 * いま動いている版と列の構成が分かるので、デプロイの確認に使えます。
 */
function doGet() {
  return ContentService.createTextOutput(
    'ほしいものクイズの受け口は動いています' + NEWLINE +
    NEWLINE +
    '版: ' + VERSION + NEWLINE +
    '列: ' + HEADERS.join(' / ') + NEWLINE +
    NEWLINE +
    'ここに「迷った跡」が出ていなければ、デプロイが更新されていません。' + NEWLINE +
    'デプロイ → デプロイを管理 → 鉛筆マーク → バージョン「新バージョン」→ デプロイ'
  );
}

function reply() {
  return ContentService.createTextOutput('ok');
}

/* ===== 受け取ってよいか確かめる ===== */

function accept(e) {
  if (!e || !e.postData || !e.postData.contents) return null;

  const raw = e.postData.contents;
  if (raw.length > MAX_BODY_CHARS) return null;

  let body;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    return null;
  }
  if (!body || typeof body !== 'object') return null;

  if (SHARED_TOKEN && body.token !== SHARED_TOKEN) return null;

  const sessionId = body.sessionId;
  if (typeof sessionId !== 'string' || !/^[A-Za-z0-9_.:@+-]{8,64}$/.test(sessionId)) return null;

  if (rateLimited(sessionId)) return null;

  return clean(body);
}

function rateLimited(sessionId) {
  const cache = CacheService.getScriptCache();

  const perSession = Number(cache.get('rl:' + sessionId) || 0) + 1;
  cache.put('rl:' + sessionId, String(perSession), 900);
  if (perSession > MAX_WRITES_PER_SESSION) return true;

  const hourKey = 'rl:all:' + Math.floor(Date.now() / 3600000);
  const perHour = Number(cache.get(hourKey) || 0) + 1;
  cache.put(hourKey, String(perHour), 3600);
  return perHour > MAX_WRITES_PER_HOUR;
}

/* ===== 文字列の無害化 ===== */

/**
 * 長さを切り、制御文字を落とし、数式として解釈される先頭文字を無害にする。
 * ここを抜かすと = で始まる文字列がシート上で計算式になってしまう。
 */
function str(value, max) {
  if (typeof value !== 'string') return '';
  let text = value.replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  if (text.length > max) text = text.slice(0, max) + '…';
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function list(value, max, fn) {
  if (!Array.isArray(value)) return [];
  return value.slice(0, max).map(fn);
}

function clean(body) {
  return {
    sessionId: body.sessionId,
    answeredCount: Math.max(0, Math.min(99, Number(body.answeredCount) || 0)),
    finished: body.finished === true,
    message: str(body.message, 400),
    keywords: list(body.keywords, 10, function (k) { return str(k, 40); }),
    answers: list(body.answers, 20, function (a) {
      return {
        question: str(a && a.question, 120),
        answer: str(a && a.answer, 120)
      };
    }),
    journal: list(body.journal, MAX_JOURNAL, function (line) { return str(line, 120); }),
    ranking: list(body.ranking, 5, function (r) {
      return { name: str(r && r.name, 80) };
    }),
    picked: body.picked && typeof body.picked === 'object'
      ? { name: str(body.picked.name, 80) }
      : null
  };
}

/* ===== シートに書く ===== */

function write(data) {
  const sheet = getSheet();
  const rowIndex = findRow(sheet, data.sessionId);

  /* 知らない相手が際限なく行を増やせないようにする */
  if (rowIndex < 0 && sheet.getLastRow() - 1 >= MAX_SESSIONS) return;

  const row = buildRow(data);
  let alreadyNotified = false;

  if (rowIndex > 0) {
    alreadyNotified = sheet.getRange(rowIndex, HEADERS.length).getValue() === 'はい';
    sheet.getRange(rowIndex, 1, 1, HEADERS.length - 1).setValues([row]);
  } else {
    sheet.appendRow(row.concat(['']));
  }

  if (shouldNotify(data, alreadyNotified) && notify(data)) {
    const index = rowIndex > 0 ? rowIndex : sheet.getLastRow();
    sheet.getRange(index, HEADERS.length).setValue('はい');
  }
}

/*
 * 列の構成が変わったときは、古いシートを名前を変えて残したうえで作り直す。
 * 手で直さなくて済むようにするため。古いデータは消さない。
 */
function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);

  if (sheet && !headerMatches(sheet)) {
    const stamp = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyyMMdd-HHmmss');
    sheet.setName(SHEET_NAME + '_old_' + stamp);
    sheet = null;
  }

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function headerMatches(sheet) {
  if (sheet.getLastRow() < 1) return false;
  const header = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  for (let i = 0; i < HEADERS.length; i++) {
    if (header[i] !== HEADERS[i]) return false;
  }
  return sheet.getLastColumn() === HEADERS.length;
}

function findRow(sheet, sessionId) {
  const last = sheet.getLastRow();
  if (last < 2) return -1;
  const ids = sheet.getRange(2, 2, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (ids[i][0] === sessionId) return i + 2;
  }
  return -1;
}

function buildRow(data) {
  const ranking = data.ranking;
  const answers = data.answers
    .map(function (a, i) { return (i + 1) + '. ' + a.question + ' / ' + a.answer; })
    .join(NEWLINE);
  return [
    new Date(),
    data.sessionId,
    data.answeredCount,
    data.finished ? 'はい' : '',
    data.picked ? data.picked.name : '',
    data.message,
    data.keywords.join('、'),
    ranking[0] ? ranking[0].name : '',
    ranking[1] ? ranking[1].name : '',
    ranking[2] ? ranking[2].name : '',
    answers,
    data.journal.join(NEWLINE)
  ];
}

/* ===== 知らせる ===== */

function shouldNotify(data, alreadyNotified) {
  if (!NOTIFY_EMAIL) return false;
  if (alreadyNotified) return false;
  return NOTIFY_ONLY_WHEN_FINISHED ? data.finished : true;
}

/** 送れたら true。1日の上限に達していたら送らない */
function notify(data) {
  const props = PropertiesService.getScriptProperties();
  const today = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy-MM-dd');
  const key = 'mail:' + today;
  const sent = Number(props.getProperty(key) || 0);
  if (sent >= MAX_EMAILS_PER_DAY) return false;

  const lines = ['ほしいものクイズに回答がありました。', ''];
  if (data.picked) lines.push('えらんだもの: ' + data.picked.name);
  if (data.message) lines.push('ひとこと: ' + data.message);
  lines.push('', 'キーワード: ' + data.keywords.join('、'), '', '--- 回答 ---');
  data.answers.forEach(function (a, i) {
    lines.push((i + 1) + '. ' + a.question);
    lines.push('   / ' + a.answer);
  });
  if (data.journal.length) {
    lines.push('', '--- 迷った跡 ---');
    data.journal.forEach(function (line) { lines.push(line); });
  }
  lines.push('', '※ 本文はウェブから送られてきた内容です。リンクは開かないでください。');

  MailApp.sendEmail(NOTIFY_EMAIL, 'ほしいものクイズの回答が届きました',
    lines.join(NEWLINE).slice(0, 8000));
  props.setProperty(key, String(sent + 1));
  return true;
}
