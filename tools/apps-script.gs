/**
 * ほしいものクイズの受け口（Google Apps Script）
 *
 * これをスプレッドシートに紐づけたスクリプトとして貼り付け、
 * 「ウェブアプリ」としてデプロイすると、母が選択肢を押すたびに
 * この doPost が呼ばれて、シートの行が書き換わります。
 *
 * 手順は README の「自動送信の設定」を見てください。
 */

/** 書き込むシートの名前。無ければ自動で作ります */
const SHEET_NAME = 'answers';

/** 通知先のメールアドレス。空にするとメールは送りません */
const NOTIFY_EMAIL = '';

/** true なら、母が最後に1つ選んだときだけメールする（毎回は送らない） */
const NOTIFY_ONLY_WHEN_FINISHED = true;

const HEADERS = [
  '更新日時', 'セッション', '回答数', '選び終わった',
  '選んだもの', '目安', 'ひとこと', 'キーワード',
  '1位', '2位', '3位', '回答の全部', '通知済み'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheet();
    const row = buildRow(data);
    const rowIndex = findRow(sheet, data.sessionId);

    let alreadyNotified = false;
    if (rowIndex > 0) {
      alreadyNotified = sheet.getRange(rowIndex, HEADERS.length).getValue() === 'はい';
      sheet.getRange(rowIndex, 1, 1, HEADERS.length - 1).setValues([row]);
    } else {
      sheet.appendRow(row.concat(['']));
    }

    if (shouldNotify(data, alreadyNotified)) {
      notify(data);
      const index = rowIndex > 0 ? rowIndex : sheet.getLastRow();
      sheet.getRange(index, HEADERS.length).setValue('はい');
    }
    return ContentService.createTextOutput('ok');
  } catch (err) {
    console.error(err);
    return ContentService.createTextOutput('error');
  } finally {
    lock.releaseLock();
  }
}

/** ブラウザでURLを開いたときの動作確認用 */
function doGet() {
  return ContentService.createTextOutput('ほしいものクイズの受け口は動いています');
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
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
  const ranking = data.ranking || [];
  const answers = (data.answers || [])
    .map(function (a, i) { return (i + 1) + '. ' + a.question + ' → ' + a.answer; })
    .join('\n');
  return [
    new Date(data.updatedAt || Date.now()),
    data.sessionId || '',
    data.answeredCount || 0,
    data.finished ? 'はい' : '',
    data.picked ? data.picked.name : '',
    data.picked ? data.picked.budget : '',
    data.message || '',
    (data.keywords || []).join('、'),
    ranking[0] ? ranking[0].name : '',
    ranking[1] ? ranking[1].name : '',
    ranking[2] ? ranking[2].name : '',
    answers
  ];
}

function shouldNotify(data, alreadyNotified) {
  if (!NOTIFY_EMAIL) return false;
  if (alreadyNotified) return false;
  return NOTIFY_ONLY_WHEN_FINISHED ? Boolean(data.finished) : true;
}

function notify(data) {
  const lines = ['ほしいものクイズに回答がありました。', ''];
  if (data.picked) {
    lines.push('えらんだもの: ' + data.picked.name + '（' + data.picked.budget + '）');
  }
  if (data.message) lines.push('ひとこと: ' + data.message);
  lines.push('', 'キーワード: ' + (data.keywords || []).join('、'), '', '--- 回答 ---');
  (data.answers || []).forEach(function (a, i) {
    lines.push((i + 1) + '. ' + a.question);
    lines.push('   → ' + a.answer);
  });
  MailApp.sendEmail(NOTIFY_EMAIL, 'ほしいものクイズの回答が届きました', lines.join('\n'));
}
