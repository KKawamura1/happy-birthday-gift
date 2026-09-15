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
  '食いしん坊・お菓子派': ['甘いもの', 'なくなる', 'おうちでゆっくり', 'ひとりでのんびり',
                          '見はじめると止まらない', 'テレビや映画', '自分で選びたい', '得意ではない',
                          '車が多い', 'とくに元気', 'とくにない', '食べもの', '置き場所', '説明書',
                          '日本茶', 'あまり聴かない', '今のままでじゅうぶん', '見ているほうが好き',
                          'どちらもいません', '毎日のことなので', '家にいることが多い',
                          '長いです', '手紙やはがき'],

  'アクティブ体験派':     ['どこかへ出かけ', '温泉', '思い出', 'とくに元気', 'よく歩きます',
                          '誰かと一緒', 'よく出かけます', 'あります。やってみたい', 'コーヒー',
                          '好き。よく聴きます', 'わりと動きまわって', '電話やビデオ通話',
                          '植物なら', '好き', 'とくにない', 'もらえたら嬉しい', '楽しみ・趣味',
                          'どちらでも', '便利なら', '飾りたい', '見はじめると'],

  '実用家電派':           ['家のことがラク', '掃除・洗濯', '便利なら', '料理やお菓子',
                          'ずっと残るもの', 'ずっと使えるもの', 'おうちでゆっくり', 'ぐっすり',
                          '台所まわり', '好き。作るのが楽しい', '家にいることが多い', '白湯',
                          '自分で選びたい', '置き場所', '車が多い', 'ひとりでのんびり',
                          'あまり聴かない', 'そんなに見ない', '今のままでじゅうぶん',
                          'どちらもいません', '長いです', '電話やビデオ通話'],

  '家族つながり派':       ['家族と話したり', '飾りたい', '誰かと一緒', '思い出', 'ぐっすり',
                          '電話やビデオ通話', 'ペットがいます', '便利なら', 'テレビや映画',
                          '果物やお茶', '日本茶', 'どちらでも', 'パジャマ', 'とくにない',
                          '好き', '車が多い', '家にいることが多い', '長いです',
                          '今のままでじゅうぶん', '見ているほうが好き']
};

const failures = [];
const fail = (message) => failures.push(message);

/* 自動送信のテスト用。config.js を差し替え、届いた分を受け取る */
const collected = [];
let configOverride = null;

function serve() {
  const server = http.createServer(async (req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';

    if (req.method === 'POST' && rel === 'collect') {
      let body = '';
      for await (const chunk of req) body += chunk;
      try { collected.push(JSON.parse(body)); } catch { collected.push({ broken: body }); }
      res.writeHead(200).end('ok');
      return;
    }
    if (rel === 'assets/config.js') {
      /* config.js は git に入らないので、無ければひな型で代用する */
      const body = configOverride
        ?? await fs.readFile(path.join(ROOT, 'assets/config.js'), 'utf8')
             .catch(() => fs.readFile(path.join(ROOT, 'assets/config.example.js'), 'utf8'));
      res.writeHead(200, { 'content-type': 'text/javascript' });
      res.end(body);
      return;
    }

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

/* 深掘りの質問に答えきる。答えた質問と選んだ内容を返す */
async function answerRefinements(page, pick = 0) {
  const steps = [];
  while (await page.locator('[data-screen="refine"]').isVisible()) {
    const question = await page.textContent('#refine-question');
    const labels = await page.locator('#refine-choices .choice-label').allTextContents();
    const index = Math.min(pick, labels.length - 1);
    steps.push({ question, answer: labels[index] });
    await page.locator('#refine-choices .choice').nth(index).click();
    if (steps.length > 5) throw new Error('深掘りが終わらない');
  }
  return steps;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function until(check, timeout = 5000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (await check()) return true;
    await wait(100);
  }
  return false;
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
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    /* 外部フォントなど、自分のドメイン外の読み込み失敗は環境依存なので見逃す */
    const from = (m.location() && m.location().url) || '';
    if (m.text().includes('Failed to load resource') && !from.includes('127.0.0.1')) return;
    fail(`[${name}] console: ${m.text()}`);
  });

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
  const [minQ, maxQ] = await page.evaluate(() => [MIN_QUESTIONS, MAX_QUESTIONS]);
  if (asked < minQ || asked > maxQ) fail(`[${name}] 質問数が想定外: ${asked}問（${minQ}〜${maxQ}のはず）`);

  const margin = await page.evaluate(() => {
    const ranking = rankedGifts();
    return +(ranking[0].score - ranking[1].score).toFixed(2);
  });
  const names = await page.locator('#result-list .gift-name').allTextContents();
  const reasons = await page.locator('#result-list .gift-reason').allTextContents();
  if (names.length !== 3) fail(`[${name}] 候補が3件出ていない: ${names.length}件`);
  console.log(`\n=== ${name}（${asked}問 / 1位と2位の差 ${margin}） ===`);
  names.forEach((n, i) => console.log(`  ${i + 1}. ${n}  ${reasons[i] || ''}`));

  /* 1位を選び、深掘りに答え、ひとことを書いて、送信用リンクを作る */
  await page.locator('#result-list .gift-card').first().click();
  const steps = await answerRefinements(page);
  if (steps.length === 0) fail(`[${name}] 深掘りの質問が出ない`);
  const item = await page.textContent('#picked-name');
  const category = await page.textContent('#picked-category');
  if (category !== names[0]) fail(`[${name}] 大分類の表示がずれている: ${category} ≠ ${names[0]}`);
  if (item === names[0]) fail(`[${name}] 具体的な品まで絞れていない`);
  console.log(`  深掘り${steps.length}問: ${steps.map((t) => t.answer).join(' → ')}  ⇒ 「${item}」`);

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
  const gotCategory = await received.locator('#received-category').textContent();
  const answerCount = await received.locator('#received-answers li').count();
  const message = await received.locator('#received-message-text').textContent();
  console.log(`  → 息子に届く内容: ${gotCategory} / ${got} / 回答${answerCount}件 / ひとこと「${message}」`);
  if (got !== item) fail(`[${name}] 届いた品名がずれている: ${got} ≠ ${item}`);
  if (gotCategory !== names[0]) fail(`[${name}] 届いた大分類がずれている: ${gotCategory} ≠ ${names[0]}`);
  if (answerCount !== asked + steps.length) {
    fail(`[${name}] 回答件数がずれている: ${answerCount} ≠ ${asked + steps.length}`);
  }
  const rows = await received.locator('#received-answers .qa-a').allTextContents();
  for (const step of steps) {
    if (!rows.some((row) => row.includes(step.answer))) {
      fail(`[${name}] 深掘りの答え「${step.answer}」が息子に届いていない`);
    }
  }
  if (message !== 'ありがとう。これがいいな。') fail(`[${name}] ひとことが届いていない`);

  await context.close();
}

/* 押すたびに自動で送られるか */
{
  configOverride =
    `const REPORT_ENDPOINT = '${base}collect';\nconst REPORT_MODE = 'fetch';\n`;
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => fail(`[自動送信] JSエラー: ${e.message}`));

  await page.goto(base);
  await page.click('#start-button');

  /* 3問だけ答えて、押すたびに届いているか */
  for (let i = 0; i < 3; i++) {
    await page.locator('#choices .choice').first().click();
    if (!(await until(() => collected.some((c) => c.answeredCount === i + 1)))) {
      fail(`[自動送信] ${i + 1}問目の答えが届かない`);
    }
  }
  const partial = collected.filter((c) => c.answeredCount === 3).pop();
  if (!partial) fail('[自動送信] 途中経過が届いていない');
  else {
    if (partial.finished) fail('[自動送信] まだ終わっていないのに finished になっている');
    if (partial.answers.length !== 3) fail('[自動送信] 回答の中身が合わない');
    if (!partial.answers[0].question || !partial.answers[0].answer) fail('[自動送信] 質問文か答えが空');
    if (!partial.ranking.length) fail('[自動送信] 途中の順位が入っていない');
    console.log(`\n=== 自動送信 ===\n  3問目の時点で届いた内容: ${partial.answeredCount}問 / 暫定1位「${partial.ranking[0].name}」`);
  }

  /* 最後まで答えて、選んで、ひとことを書く */
  while (await page.locator('[data-screen="quiz"]').isVisible()) {
    await page.locator('#choices .choice').first().click();
  }
  const chosen = await page.locator('#result-list .gift-name').first().textContent();
  await page.locator('#result-list .gift-card').first().click();
  const refineSteps = await answerRefinements(page);

  if (!(await until(() => collected.some((c) => c.finished && c.picked)))) {
    fail('[自動送信] 選んだ結果が届かない');
  } else {
    const done = collected.filter((c) => c.finished).pop();
    if (!done.picked.name.startsWith(chosen)) {
      fail(`[自動送信] 選んだ品がずれている: ${done.picked.name} は ${chosen} で始まらない`);
    }
    if (refineSteps.length && !done.picked.name.includes(' → ')) {
      fail('[自動送信] 具体的な品が届いていない');
    }
    if (done.refinements.length !== refineSteps.length) {
      fail(`[自動送信] 深掘りの答えの数が合わない: ${done.refinements.length} ≠ ${refineSteps.length}`);
    }
    if (done.answers.length !== done.answeredCount + refineSteps.length) {
      fail('[自動送信] 回答一覧に深掘りぶんが入っていない');
    }
    console.log(`  えらんだあとに届いた内容: 「${done.picked.name}」`);
  }

  /* 深掘りの途中経過も、その場で届いているか */
  if (refineSteps.length && !collected.some((c) => c.refinements && c.refinements.length === 1)) {
    fail('[自動送信] 深掘りの1問目が、その場で届いていない');
  }

  /* 手で送るボタンは出ていないはず */
  if (await page.locator('#manual-send').isVisible()) fail('[自動送信] 自動で送れているのに手動ボタンが出ている');
  if (!(await page.locator('#auto-done').isVisible())) fail('[自動送信] 「届きました」の案内が出ていない');

  await page.fill('#message-input', 'ありがとう。紺色がいいな。');
  if (!(await until(() => collected.some((c) => c.message === 'ありがとう。紺色がいいな。'), 6000))) {
    fail('[自動送信] ひとことが届かない');
  } else {
    console.log('  ひとことも自動で届きました');
  }

  await context.close();
  configOverride = null;
}

/* 送信先が未設定なら、手で送るボタンに戻るか */
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('pageerror', (e) => fail(`[手動送信] JSエラー: ${e.message}`));
  await page.goto(base);
  await page.click('#start-button');
  while (await page.locator('[data-screen="quiz"]').isVisible()) {
    await page.locator('#choices .choice').first().click();
  }
  await page.locator('#result-list .gift-card').first().click();
  await answerRefinements(page);
  if (!(await page.locator('#manual-send').isVisible())) fail('[手動送信] 手で送るボタンが出ていない');
  if (await page.locator('#auto-done').isVisible()) fail('[手動送信] 届いた案内が出てしまっている');
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
