/*
 * index.html と assets/* を1枚のHTMLにまとめて artifact/index.html を作る。
 *
 * Claude の Artifact は <html>/<head>/<body> を自前で用意するので、
 * こちらは <title> から中身だけを書き出す。外部ファイルも読めないので全部埋めこむ。
 *
 *   node tools/build-artifact.mjs
 *
 * 注意: 送信先の設定は、手元の assets/config.js ではなく必ず
 * assets/config.example.js（空の値）を埋めこむ。artifact/index.html は
 * リポジトリに入るので、実際のURLを混ぜるとそこから漏れる。
 * Artifact 上では db を使うので、URLは要らない。
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => fs.readFile(path.join(ROOT, rel), 'utf8');

const html = await read('index.html');

const title = html.match(/<title>([\s\S]*?)<\/title>/)[1];
const fontLinks = html.match(/<link rel="preconnect"[\s\S]*?display=swap">/)[0];
const body = html.match(/<body>([\s\S]*?)<script/)[1].trim();

const css = await read('assets/style.css');
const scripts = [];
for (const file of ['assets/config.example.js', 'assets/data.js', 'assets/transport.js', 'assets/app.js']) {
  scripts.push(`<script>\n/* ${file} */\n${await read(file)}\n</script>`);
}

const out = `<title>${title}</title>
${fontLinks}
<style>
${css}</style>

${body}

${scripts.join('\n')}
`;

await fs.mkdir(path.join(ROOT, 'artifact'), { recursive: true });
await fs.writeFile(path.join(ROOT, 'artifact/index.html'), out);
console.log(`artifact/index.html を書き出しました（${(out.length / 1024).toFixed(0)} KB）`);
