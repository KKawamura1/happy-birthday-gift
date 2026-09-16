/*
 * assets/data.js の中身が矛盾していないか確かめる。
 *
 * 質問やプレゼントを足したときに壊れやすいところ（点が入らないタグ、
 * 深掘りの結論が大分類と同じ、説明文の書き忘れなど）を見張る。
 *
 *   node test/data.test.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const context = {};
vm.createContext(context);
vm.runInContext(
  fs.readFileSync(path.join(ROOT, 'assets/data.js'), 'utf8') +
    ';globalThis.__data = { QUESTIONS, GIFTS, TAG_LABELS, REFINEMENTS };',
  context
);
const { QUESTIONS, GIFTS, TAG_LABELS, REFINEMENTS } = context.__data;

const failures = [];
const check = (label, ok, detail) => {
  if (!ok) failures.push(label + (detail ? `（${detail}）` : ''));
  console.log(`  ${ok ? '✓' : '✗'} ${label}${!ok && detail ? ` → ${detail}` : ''}`);
};
const dupes = (values) => [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];

console.log('\n=== 質問とプレゼント ===');

check('プレゼントの id に重複がない', dupes(GIFTS.map((g) => g.id)).length === 0,
  dupes(GIFTS.map((g) => g.id)).join(', '));
check('質問の id に重複がない', dupes(QUESTIONS.map((q) => q.id)).length === 0,
  dupes(QUESTIONS.map((q) => q.id)).join(', '));
check('プレゼント名に重複がない', dupes(GIFTS.map((g) => g.name)).length === 0,
  dupes(GIFTS.map((g) => g.name)).join(', '));

check('すべてのプレゼントに名前・説明・タグがある',
  GIFTS.every((g) => g.emoji && g.name && g.note && g.tags.length > 0),
  GIFTS.filter((g) => !(g.emoji && g.name && g.note && g.tags.length)).map((g) => g.id).join(', '));

check('すべての質問に2つ以上の選択肢がある',
  QUESTIONS.every((q) => q.text && q.choices.length >= 2),
  QUESTIONS.filter((q) => !(q.text && q.choices.length >= 2)).map((q) => q.id).join(', '));

/*
 * どれも選べない質問を作らないための決まり。
 *   - 2択のときは、互いに補集合になっている（「好き」と「そうでもない」など）
 *   - 3択以上のときは、どれにも当てはまらない人が押せる選択肢を必ず1つ置き、
 *     escape: true と書いて、いちばん下に並べる
 */
const needEscape = QUESTIONS.filter((q) => q.choices.length >= 3);
const noEscape = needEscape.filter((q) => q.choices.filter((c) => c.escape).length !== 1);
check(`3択以上の${needEscape.length}問すべてに、どれも選べない人向けの選択肢がある`,
  noEscape.length === 0, noEscape.map((q) => q.id).join(', '));

const escapeNotLast = needEscape.filter((q) => {
  const at = q.choices.findIndex((c) => c.escape);
  /* 「そのほか」は下、「とくにない」があるならその手前 */
  return at < q.choices.length - 2;
});
check('その選択肢は下のほうに置かれている', escapeNotLast.length === 0,
  escapeNotLast.map((q) => q.id).join(', '));

const oddBinary = QUESTIONS.filter((q) => q.choices.length === 2 && q.choices.some((c) => c.escape));
check('2択の質問には逃げ道を置かない（補集合で足りる）', oddBinary.length === 0,
  oddBinary.map((q) => q.id).join(', '));

/* 金額に触れていないか。ここが崩れると遠慮が入ってしまう */
const PRICE = /円|予算|値段|いくら|価格|budget/;
check('プレゼントに金額の情報がない', GIFTS.every((g) => !('budget' in g)));
check('どこにも金額や予算の話が出てこない',
  !QUESTIONS.some((q) => PRICE.test(q.text) || (q.sub && PRICE.test(q.sub)) ||
    q.choices.some((c) => PRICE.test(c.label))) &&
  !GIFTS.some((g) => PRICE.test(g.name) || PRICE.test(g.note)));

console.log('\n=== タグ ===');

const giftTags = new Set(GIFTS.flatMap((g) => g.tags));
const questionTags = new Set(
  QUESTIONS.flatMap((q) => q.choices.flatMap((c) => Object.keys(c.tags)))
);

const dead = [...giftTags].filter((t) => !questionTags.has(t));
check('どの質問からも点が入らないタグがない', dead.length === 0, dead.join(', '));

const phantom = [...questionTags].filter((t) => !giftTags.has(t));
check('どのプレゼントも持っていないタグがない', phantom.length === 0, phantom.join(', '));

const unlabeled = [...giftTags].filter((t) => !TAG_LABELS[t]);
check('すべてのタグに日本語ラベルがある', unlabeled.length === 0, unlabeled.join(', '));

const unusedLabel = Object.keys(TAG_LABELS).filter((t) => !giftTags.has(t));
check('使われていないラベルがない', unusedLabel.length === 0, unusedLabel.join(', '));

console.log('\n=== 深掘り ===');

const giftById = Object.fromEntries(GIFTS.map((g) => [g.id, g]));

const orphans = Object.keys(REFINEMENTS).filter((id) => !giftById[id]);
check('存在しないプレゼントへの深掘りがない', orphans.length === 0, orphans.join(', '));

const missing = GIFTS.filter((g) => !REFINEMENTS[g.id]).map((g) => g.id);
check('すべてのプレゼントに深掘りがある', missing.length === 0, missing.join(', '));

const problems = { noText: [], sameName: [], deep: [] };
const leafNames = [];
let leaves = 0;
let maxDepth = 0;

function walk(giftId, node, depth) {
  maxDepth = Math.max(maxDepth, depth);
  if (depth > 3) problems.deep.push(giftId);
  if (!node.question || !Array.isArray(node.choices) || node.choices.length < 2) {
    problems.noText.push(giftId);
    return;
  }
  for (const choice of node.choices) {
    if (choice.next) {
      walk(giftId, choice.next, depth + 1);
      continue;
    }
    leaves++;
    leafNames.push(choice.name);
    if (!choice.emoji || !choice.label || !choice.name || !choice.note) {
      problems.noText.push(`${giftId}/${choice.label || '?'}`);
    }
    /* 結論が大分類と同じ名前だと、深掘りした意味がなくなる */
    if (choice.name === giftById[giftId].name) problems.sameName.push(`${giftId}: ${choice.name}`);
  }
}
for (const id of Object.keys(REFINEMENTS)) {
  if (giftById[id]) walk(id, REFINEMENTS[id], 1);
}

check('深掘りの質問と選択肢がそろっている', problems.noText.length === 0, problems.noText.join(', '));
check('結論が大分類と同じ名前になっていない', problems.sameName.length === 0, problems.sameName.join(', '));
check('深掘りは3問以内でおさまる', problems.deep.length === 0, problems.deep.join(', '));
check('最終的な品の名前に重複がない', dupes(leafNames).length === 0, dupes(leafNames).join(', '));

console.log(`\n  質問 ${QUESTIONS.length}問 / プレゼント ${GIFTS.length}件 / ` +
  `最終的な品 ${leaves}件（深掘りは最大${maxDepth}問）`);

console.log('\n' + (failures.length
  ? `❌ 通らなかった項目:\n${failures.map((f) => '  - ' + f).join('\n')}`
  : '✅ すべて通りました'));
process.exit(failures.length ? 1 : 0);
