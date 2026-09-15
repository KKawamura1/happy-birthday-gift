/*
 * config.example.js — 送信先の設定のひな型
 *
 * このファイルは git に入りますが、URL を書いてはいけません。
 * 実際の値が入る assets/config.js は .gitignore で除外してあります。
 *
 * ■ 手元で動かすとき
 *     cp assets/config.example.js assets/config.js
 *   としてから、コピーしたほうの config.js に値を書いてください。
 *
 * ■ GitHub Pages に出すとき
 *   リポジトリの Settings → Secrets and variables → Actions に
 *   REPORT_ENDPOINT と REPORT_TOKEN を登録してください。
 *   公開時に .github/workflows/pages.yml が config.js を組み立てます。
 *
 * ※ どちらの値も、公開されたページのソースを見れば読めます。秘密にはできません。
 *   git に載せないのは、履歴に残さないため・すぐ差し替えられるようにするためです。
 *   本当の防御は受け口（tools/apps-script.gs）側にあります。
 */

/* Apps Script のウェブアプリURL。空なら「LINEで送る」方式に切り替わります */
const REPORT_ENDPOINT = '';

/* 受け口と揃える合言葉。通りすがりの機械が叩くのを弾くためのもの */
const REPORT_TOKEN = '';

/* 送信のしかた。'beacon' は画面を閉じられても届きやすい */
const REPORT_MODE = 'beacon';
