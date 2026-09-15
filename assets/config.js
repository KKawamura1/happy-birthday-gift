/*
 * config.js — 送信先の設定
 *
 * ここに Google Apps Script の URL を貼ると、母が選択肢を押すたびに、
 * その時点の回答一式が自動で送られます（母が「送信」を押す必要はありません）。
 *
 * URL の取り方は README の「自動送信の設定」を見てください。
 * 空のままでも動きますが、その場合は最後に本人が「LINEで送る」を押す必要があります。
 */
const REPORT_ENDPOINT = '';

/* 送信先が Apps Script かどうかの目印。ふつうは触らなくて大丈夫です */
const REPORT_MODE = 'beacon';   // 'beacon' か 'fetch'
