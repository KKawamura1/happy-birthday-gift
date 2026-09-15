/*
 * 通しテスト。4通りの「お母さん像」で最後まで答えてみて、
 * まともな候補が出るか／結果リンクが正しく復元できるかを確かめる。
 *
 *   npm install -D playwright   （初回のみ）
 *   node test/e2e.mjs
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

/* 回答のしかた。上から順に、選択肢のラベルに含まれていれば選ぶ */
const PERSONAS = {
  '食いしん坊・お菓子派': ['甘いもの', 'お菓子', 'なくなる', 'おうちでゆっくり', 'ひとりでのんびり',
                          'テレビ', '自分で選びたい', '得意ではない', '車が多い', 'とくに元気',
                          'とくにない', '食べもの', '置き場所', '説明書'],
  'アクティブ体験派':     ['どこかへ出かけ', '温泉', '思い出', 'とくに元気', 'よく歩きます', '長く使えるもの',
                          '誰かと一緒', '好き', 'とくにない', 'もらえたら嬉しい', '楽しみ・趣味',
                          'どちらでも', '便利なら', '飾りたい'],
  '実用家電派':           ['家のことがラク', '掃除・洗濯', '便利なら', '料理やお菓子', 'ずっと残るもの',
                          '少しいいもの', 'おうちでゆっくり', 'ずっと使えるもの', 'ぐっすり',
                          '自分で選びたい', '置き場所', '車が多い', '得意ではない', 'ひとりでのんびり'],
  '家族つながり派':       ['家族と話したり', '飾りたい', '誰かと一緒', '思い出', 'お菓子くらい', 'ぐっすり',
                          '便利なら', 'テレビ', '果物やお茶', 'どちらでも', 'パジャマ', 'とくにない',
                          '好き', '車が多い'],
};

const failures = [];
const fail = (message) => failures.push(message);

function serve() {
  const server = http.createServer(async (req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    try {
      const body = await fs.readFile(file);
      res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

let fallbacks = 0;
function choose(labels, prefs) {
  for (const pref of prefs) {
    const index = labels.findIndex((label) => label.includes(pref));
    if (index >= 0) return index;
  }
  console.log(`    (該当なし → 順番に選択: ${labels.join(' / ')})`);
  return (fallbacks++) % labels.length;
}

const { server, port } = await serve();
const base = `http://127.0.0.1:${port}/`;
const browser = await chromium.launch();

for (const [name, prefs] of Object.entries(PERSONAS)) {
  fallbacks = 0;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => fail(`[${name}] JSエラー: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') fail(`[${name}] console: ${m.text()}`); });

  await page.goto(base);
  await page.click('#start-button');

  let asked = 0;
  while (await page.locator('[data-screen="quiz"]').isVisible()) {
    const labels = await page.locator('#choices .choice-label').allTextContents();
    if (!labels.length) break;
    await page.locator('#choices .choice').nth(choose(labels, prefs)).click();
    if (++asked > 20) { fail(`[${name}] 質問が終わらない`); break; }
  }

  if (!(await page.locator('[data-screen="result"]').isVisible())) fail(`[${name}] 結果画面が出ない`);
  if (asked < 8 || asked > 11) fail(`[${name}] 質問数が想定外: ${asked}問`);

  const margin = await page.evaluate(() => {
    const ranking = rankedGifts();
    return +(ranking[0].score - ranking[1].score).toFixed(2);
  });
  const names = await page.locator('#result-list .gift-name').allTextContents();
  const reasons = await page.locator('#result-list .gift-reason').allTextContents();
  if (names.length !== 3) fail(`[${name}] 候補が3件出ていない: ${names.length}件`);
  console.log(`\n=== ${name}（${asked}問 / 1位と2位の差 ${margin}） ===`);
  names.forEach((n, i) => console.log(`  ${i + 1}. ${n}  ${reasons[i] || ''}`));

  /* 1位を選び、ひとことを書いて、送信用リンクを作る */
  await page.locator('#result-list .gift-card').first().click();
  await page.fill('#message-input', 'ありがとう。これがいいな。');
  const lineHref = await page.getAttribute('#share-line', 'href');
  if (!lineHref.startsWith('https://line.me/R/share?text=')) fail(`[${name}] LINEリンクが不正`);
  const mailHref = await page.getAttribute('#share-mail', 'href');
  if (!mailHref.startsWith('mailto:')) fail(`[${name}] メールリンクが不正`);

  /* そのリンクを開くと、息子側の画面が同じ内容で復元されるか */
  const url = await page.evaluate(() => buildResultUrl());
  const received = await context.newPage();
  received.on('pageerror', (e) => fail(`[${name}] 受け取り画面のJSエラー: ${e.message}`));
  await received.goto(url);
  if (!(await received.locator('[data-screen="received"]').isVisible())) fail(`[${name}] 受け取り画面が出ない`);
  const got = await received.locator('#received-name').textContent();
  const answerCount = await received.locator('#received-answers li').count();
  const message = await received.locator('#received-message-text').textContent();
  console.log(`  → 息子に届く内容: ${got} / 回答${answerCount}件 / ひとこと「${message}」`);
  if (got !== names[0]) fail(`[${name}] 届いた品名がずれている: ${got} ≠ ${names[0]}`);
  if (answerCount !== asked) fail(`[${name}] 回答件数がずれている: ${answerCount} ≠ ${asked}`);
  if (message !== 'ありがとう。これがいいな。') fail(`[${name}] ひとことが届いていない`);

  await context.close();
}

/* 「ひとつ前にもどる」と、壊れたリンクを開いたとき */
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => fail(`[その他] JSエラー: ${e.message}`));

  await page.goto(base);
  await page.click('#start-button');
  const first = await page.textContent('#question-text');
  await page.locator('#choices .choice').first().click();
  await page.click('#back-button');
  if ((await page.textContent('#question-text')) !== first) fail('もどるボタンが効いていない');

  await page.goto(`${base}#r=こわれたデータ`);
  await page.reload();
  if (!(await page.locator('[data-screen="intro"]').isVisible())) fail('壊れたリンクで最初の画面に戻らない');

  await context.close();
}

await browser.close();
server.close();

console.log('\n' + (failures.length ? `❌ 問題:\n${failures.join('\n')}` : '✅ すべて通りました'));
process.exit(failures.length ? 1 : 0);
