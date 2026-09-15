/*
 * app.js — 質問を選ぶエンジンと画面の制御
 *
 * エンジンのしくみ:
 *   1. 回答するたびに「タグごとの点数」を足していく
 *   2. プレゼント候補の点数 = そのプレゼントが持つタグの点数の合計
 *   3. 次の質問は、いまの上位候補の点差がいちばん開く質問を選ぶ
 *      （＝答えを聞いて「いちばん情報が増える」質問。アキネーターと同じ考え方）
 */

const MIN_QUESTIONS = 9;
const MAX_QUESTIONS = 13;
const DECIDED_MARGIN = 0.22;   // 1位と2位がこれだけ離れたら打ち切ってよい
const STORAGE_KEY = 'gift-quiz-progress-v1';

const state = {
  sessionId: '',      // 今回の回答を見分けるための番号
  startedAt: '',      // 始めた時刻
  answers: [],        // [{ qid, ci }]
  finalPick: null,    // 選ばれたプレゼントの id
  refineStack: [],    // 深掘りで通ってきた質問（もどる用）
  refinePath: [],     // 深掘りの答え [{ question, answer }]
  finalItem: null,    // 深掘りで決まった具体的な品 { name, note }
  shownTop: [],       // 結果画面に出した候補の id
  offset: 0,          // 「ほかの候補も見る」で何件ずらしたか
  message: ''
};

function newSessionId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ---------- 小さな道具 ---------- */

const $ = (sel) => document.querySelector(sel);
const questionById = (id) => QUESTIONS.find((q) => q.id === id);
const giftById = (id) => GIFTS.find((g) => g.id === id);

function showScreen(name) {
  document.querySelectorAll('.screen').forEach((el) => {
    el.hidden = el.dataset.screen !== name;
  });
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

/* ---------- 採点 ---------- */

/*
 * 各タグが「最大でどれだけ点を集めうるか」。
 *
 * 「おうち時間」のように多くの質問から加点されるタグは、放っておくと
 * 「甘いもの好き」のように一問しか出ないタグを押しつぶしてしまう。
 * そこで、集まった点をこの最大値で割り、どのタグも同じ重みで効くようにする。
 */
const TAG_REACH = (() => {
  const reach = {};
  for (const question of QUESTIONS) {
    /* 1つの質問からは1択ぶんしか入らないので、その質問での最大値だけを足す */
    const strongest = {};
    for (const choice of question.choices) {
      for (const [tag, value] of Object.entries(choice.tags)) {
        strongest[tag] = Math.max(strongest[tag] || 0, Math.abs(value));
      }
    }
    for (const [tag, value] of Object.entries(strongest)) {
      reach[tag] = (reach[tag] || 0) + value;
    }
  }
  return reach;
})();

/* そのタグに、いまどれだけ寄っているか（-1 〜 1 くらいに収まる） */
function tagWeight(scores, tag) {
  return (scores[tag] || 0) / (TAG_REACH[tag] || 1);
}

function tagScores(answers = state.answers) {
  const scores = {};
  for (const ans of answers) {
    const choice = questionById(ans.qid).choices[ans.ci];
    for (const [tag, value] of Object.entries(choice.tags)) {
      scores[tag] = (scores[tag] || 0) + value;
    }
  }
  return scores;
}

/*
 * タグをたくさん持つプレゼントほど点が貯まりやすいので、
 * タグ数の平方根で割って平等にする。
 */
function giftScore(gift, scores) {
  const sum = gift.tags.reduce((total, tag) => total + tagWeight(scores, tag), 0);
  return sum / Math.sqrt(gift.tags.length);
}

function rankedGifts(scores = tagScores()) {
  return GIFTS
    .map((gift) => ({ gift, score: giftScore(gift, scores) }))
    .sort((a, b) => b.score - a.score);
}

/* この質問を聞くと、上位候補の順位がどれだけ動くか */
function informativeness(question, ranking) {
  let total = 0;
  ranking.slice(0, 10).forEach((item, index) => {
    const weight = 1 / (1 + index * 0.3);   // 上位の候補ほど重視する
    const deltas = question.choices.map((choice) =>
      item.gift.tags.reduce(
        (sum, tag) => sum + (choice.tags[tag] || 0) / (TAG_REACH[tag] || 1), 0
      ) / Math.sqrt(item.gift.tags.length)
    );
    total += weight * (Math.max(...deltas) - Math.min(...deltas));
  });
  return total;
}

function nextQuestion() {
  const asked = new Set(state.answers.map((a) => a.qid));
  if (asked.size === 0) return questionById('q_style');   // 1問目は固定

  const remaining = QUESTIONS.filter((q) => !asked.has(q.id));
  if (remaining.length === 0) return null;

  const ranking = rankedGifts();
  if (asked.size >= MIN_QUESTIONS) {
    if (asked.size >= MAX_QUESTIONS) return null;
    const margin = ranking[0].score - ranking[1].score;
    if (margin >= DECIDED_MARGIN) return null;            // もう答えは出ている
  }

  let best = null;
  let bestValue = -Infinity;
  for (const question of remaining) {
    // 同じ人が2回遊んでも少しだけ順番が変わるように、ごく小さなゆらぎを足す
    const value = informativeness(question, ranking) + Math.random() * 0.15;
    if (value > bestValue) {
      bestValue = value;
      best = question;
    }
  }
  return best;
}

/* ---------- 保存 ---------- */

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      sessionId: state.sessionId,
      startedAt: state.startedAt,
      answers: state.answers
    }));
  } catch (e) { /* プライベートブラウズなどでは黙って諦める */ }
}

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!saved || !Array.isArray(saved.answers)) return null;
    saved.answers = saved.answers.filter(
      (a) => questionById(a.qid) && questionById(a.qid).choices[a.ci]
    );
    return saved;
  } catch (e) {
    return null;
  }
}

function clearSaved() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
}

/* ---------- 自動送信 ---------- */

/*
 * いま分かっていることを、まるごと1通にまとめる。
 * 押すたびにこれを送るので、途中でやめられても最後の状態が残る。
 */
function snapshot() {
  const scores = tagScores();
  const ranking = rankedGifts(scores);
  const picked = state.finalPick ? giftById(state.finalPick) : null;

  return {
    sessionId: state.sessionId,
    startedAt: state.startedAt,
    updatedAt: new Date().toISOString(),
    answeredCount: state.answers.length,
    finished: Boolean(picked),
    answers: state.answers
      .map((ans) => {
        const question = questionById(ans.qid);
        return { question: question.text, answer: question.choices[ans.ci].label };
      })
      .concat(state.refinePath),
    keywords: Object.keys(scores)
      .filter((tag) => scores[tag] > 0 && TAG_LABELS[tag])
      .sort((a, b) => tagWeight(scores, b) - tagWeight(scores, a))
      .slice(0, 8)
      .map((tag) => TAG_LABELS[tag]),
    ranking: ranking.slice(0, 5).map((item, index) => ({
      rank: index + 1,
      name: item.gift.name
    })),
    shown: state.shownTop.map((id) => giftById(id).name),
    picked: picked
      ? {
          /* 「果物 → シャインマスカット」のように、大分類と具体名を1つにまとめる */
          name: state.finalItem ? `${picked.name} → ${state.finalItem.name}` : picked.name,
          note: state.finalItem ? state.finalItem.note : picked.note
        }
      : null,
    refinements: state.refinePath,
    message: state.message.trim()
  };
}

function report() {
  Transport.send(snapshot());
}

/* ひとことは一文字ごとに送らず、手が止まってからまとめて送る */
let messageTimer = null;
function reportMessageSoon() {
  clearTimeout(messageTimer);
  messageTimer = setTimeout(report, 1200);
}

function renderStatus(status) {
  const text = {
    connecting: '送信の準備をしています…',
    sending: '送っています…',
    sent: '✓ ここまでの答えは息子に届いています',
    offline: '電波が届いたら、まとめて送ります',
    none: ''
  }[status] || '';
  document.querySelectorAll('.send-status').forEach((el) => {
    el.textContent = text;
    el.hidden = !text;
  });
  $('#manual-send').hidden = !(Transport.isReady() && !Transport.isAuto());
  $('#auto-done').hidden = !(Transport.isReady() && Transport.isAuto());
}

/* ---------- 質問画面 ---------- */

function renderQuestion() {
  const question = nextQuestion();
  if (!question) return renderResult();

  const asked = state.answers.length;
  const percent = Math.round((asked / MAX_QUESTIONS) * 100);

  $('#progress-bar').style.width = `${Math.max(6, percent)}%`;
  $('#progress-text').textContent =
    `${asked + 1}問目（ぜんぶで${MIN_QUESTIONS}〜${MAX_QUESTIONS}問くらい）`;
  $('#question-text').textContent = question.text;
  $('#question-sub').textContent = question.sub || '';
  $('#question-sub').hidden = !question.sub;

  const list = $('#choices');
  list.innerHTML = '';
  question.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.innerHTML = `<span class="choice-emoji">${choice.emoji}</span><span class="choice-label"></span>`;
    button.querySelector('.choice-label').textContent = choice.label;
    button.addEventListener('click', () => {
      state.answers.push({ qid: question.id, ci: index });
      save();
      report();
      renderQuestion();
    });
    list.appendChild(button);
  });

  $('#back-button').hidden = state.answers.length === 0;
  showScreen('quiz');
}

function goBack() {
  state.answers.pop();
  save();
  report();
  renderQuestion();
}

/* ---------- 結果画面 ---------- */

/* そのプレゼントが選ばれた理由になっているタグを、強い順に拾う */
function reasonsFor(gift, scores) {
  return gift.tags
    .filter((tag) => (scores[tag] || 0) > 0 && TAG_LABELS[tag])
    .sort((a, b) => tagWeight(scores, b) - tagWeight(scores, a))
    .slice(0, 3)
    .map((tag) => TAG_LABELS[tag]);
}

function renderResult() {
  const scores = tagScores();
  const ranking = rankedGifts(scores);
  const top = ranking.slice(state.offset, state.offset + 3);
  state.shownTop = top.map((item) => item.gift.id);

  const list = $('#result-list');
  list.innerHTML = '';
  top.forEach((item, index) => {
    const rank = state.offset + index + 1;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'gift-card' + (rank === 1 ? ' gift-card--first' : '');
    card.innerHTML = `
      <div class="gift-rank">${rank === 1 ? '★ いちばん近そう' : `${rank}位`}</div>
      <div class="gift-emoji">${item.gift.emoji}</div>
      <div class="gift-body">
        <h3 class="gift-name"></h3>
        <p class="gift-note"></p>
        <p class="gift-reason"></p>
      </div>
      <div class="gift-pick">これにする →</div>`;
    card.querySelector('.gift-name').textContent = item.gift.name;
    card.querySelector('.gift-note').textContent = item.gift.note;
    const reasons = reasonsFor(item.gift, scores);
    card.querySelector('.gift-reason').textContent =
      reasons.length ? `→ ${reasons.join('・')} だから` : '';
    card.addEventListener('click', () => {
      state.finalPick = item.gift.id;
      state.refineStack = [];
      state.refinePath = [];
      state.finalItem = null;
      startRefine();
    });
    list.appendChild(card);
  });

  $('#more-button').hidden = state.offset + 3 >= ranking.length;
  report();
  showScreen('result');
}

function showMore() {
  state.offset += 3;
  renderResult();
}

/* ---------- 深掘り（第2段階） ---------- */

/*
 * 「果物」まで決まったら、次は「桃」まで聞く。
 * 深掘りの質問が用意されていない品は、ここを素通りして送信画面へ。
 */
function startRefine() {
  const tree = REFINEMENTS[state.finalPick];
  if (!tree) {
    report();
    renderSend();
    return;
  }
  state.refineStack = [tree];
  renderRefine();
}

function renderRefine() {
  const node = state.refineStack[state.refineStack.length - 1];
  const gift = giftById(state.finalPick);

  $('#refine-eyebrow').textContent = `${gift.emoji} ${gift.name}`;
  $('#refine-question').textContent = node.question;

  const list = $('#refine-choices');
  list.innerHTML = '';
  node.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'choice';
    button.innerHTML = '<span class="choice-emoji"></span><span class="choice-label"></span>';
    button.querySelector('.choice-emoji').textContent = choice.emoji;
    button.querySelector('.choice-label').textContent = choice.label;
    button.addEventListener('click', () => {
      state.refinePath.push({ question: node.question, answer: choice.label });
      if (choice.next) {
        state.refineStack.push(choice.next);
        renderRefine();
        report();
        return;
      }
      state.finalItem = { name: choice.name, note: choice.note };
      report();
      renderSend();
    });
    list.appendChild(button);
  });

  $('#refine-back').hidden = false;
  renderStatus(Transport.status());
  showScreen('refine');
}

function refineBack() {
  state.refinePath.pop();
  state.refineStack.pop();
  if (state.refineStack.length === 0) {
    renderResult();
    return;
  }
  renderRefine();
}

/* ---------- 送信画面 ---------- */

function encodePayload(object) {
  const bytes = new TextEncoder().encode(JSON.stringify(object));
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodePayload(text) {
  const normalized = text.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function buildResultUrl() {
  const payload = {
    v: 1,
    a: state.answers.map((ans) => [ans.qid, ans.ci]),
    p: state.finalPick,
    t: state.shownTop,
    d: state.finalItem,
    rf: state.refinePath.map((step) => [step.question, step.answer]),
    m: state.message.slice(0, 400)
  };
  const base = location.origin + location.pathname;
  return `${base}#r=${encodePayload(payload)}`;
}

function buildResultText() {
  const gift = giftById(state.finalPick);
  const lines = [
    '🎂 お母さんの「ほしいものクイズ」の結果です',
    '',
    `▼ えらんだのは：${gift.emoji} ${state.finalItem ? state.finalItem.name : gift.name}`
  ];
  if (state.finalItem) lines.push(`　 （${gift.name}）`);
  if (state.message.trim()) {
    lines.push('', `▼ ひとこと：${state.message.trim()}`);
  }
  lines.push('', '▼ くわしい答えはこちら', buildResultUrl());
  return lines.join('\n');
}

function refreshShareLinks() {
  const text = buildResultText();
  $('#share-line').href = 'https://line.me/R/share?text=' + encodeURIComponent(text);
  $('#share-mail').href =
    'mailto:?subject=' + encodeURIComponent('ほしいものクイズの結果') +
    '&body=' + encodeURIComponent(text);
}

function renderSend() {
  const gift = giftById(state.finalPick);
  $('#picked-emoji').textContent = gift.emoji;
  $('#picked-name').textContent = state.finalItem ? state.finalItem.name : gift.name;
  $('#picked-category').textContent = state.finalItem ? gift.name : '';
  $('#picked-category').hidden = !state.finalItem;
  $('#copy-status').textContent = '';
  refreshShareLinks();
  renderStatus(Transport.status());
  showScreen('send');
}

async function copyResult() {
  const text = buildResultText();
  try {
    await navigator.clipboard.writeText(text);
    $('#copy-status').textContent = 'コピーしました！ LINEなどに貼りつけて送ってください。';
  } catch (e) {
    const area = $('#fallback-text');
    area.hidden = false;
    area.value = text;
    area.select();
    $('#copy-status').textContent = '下の文章を長押しして、コピーしてください。';
  }
}

/* ---------- 息子が結果を見る画面 ---------- */

function renderReceived(payload) {
  const answers = (payload.a || [])
    .map(([qid, ci]) => ({ qid, ci }))
    .filter((a) => questionById(a.qid) && questionById(a.qid).choices[a.ci]);

  const gift = giftById(payload.p);
  const scores = tagScores(answers);

  const detail = payload.d && typeof payload.d === 'object' ? payload.d : null;
  $('#received-emoji').textContent = gift ? gift.emoji : '🎁';
  $('#received-name').textContent = detail ? detail.name : (gift ? gift.name : '（選択なし）');
  $('#received-category').textContent = detail && gift ? gift.name : '';
  $('#received-category').hidden = !(detail && gift);
  $('#received-note').textContent = detail ? detail.note : (gift ? gift.note : '');

  const messageBox = $('#received-message');
  messageBox.hidden = !payload.m;
  $('#received-message-text').textContent = payload.m || '';

  const others = (payload.t || []).filter((id) => id !== payload.p).map(giftById).filter(Boolean);
  $('#received-others-wrap').hidden = others.length === 0;
  $('#received-others').innerHTML = '';
  others.forEach((other) => {
    const li = document.createElement('li');
    li.textContent = `${other.emoji} ${other.name}`;
    $('#received-others').appendChild(li);
  });

  const answerList = $('#received-answers');
  answerList.innerHTML = '';
  const addRow = (question, answer) => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="qa-q"></span><span class="qa-a"></span>';
    li.querySelector('.qa-q').textContent = question;
    li.querySelector('.qa-a').textContent = answer;
    answerList.appendChild(li);
  };
  answers.forEach((ans) => {
    const question = questionById(ans.qid);
    const choice = question.choices[ans.ci];
    addRow(question.text, `${choice.emoji} ${choice.label}`);
  });
  (payload.rf || []).forEach(([question, answer]) => {
    if (typeof question === 'string' && typeof answer === 'string') addRow(question, answer);
  });

  const topTags = Object.keys(scores)
    .filter((tag) => scores[tag] > 0 && TAG_LABELS[tag])
    .sort((a, b) => tagWeight(scores, b) - tagWeight(scores, a))
    .slice(0, 6);
  $('#received-tags').innerHTML = '';
  topTags.forEach((tag) => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = TAG_LABELS[tag];
    $('#received-tags').appendChild(span);
  });

  showScreen('received');
}

/* ---------- 起動 ---------- */

function start(fresh) {
  if (fresh) {
    state.answers = [];
    state.sessionId = newSessionId();
    state.startedAt = new Date().toISOString();
    clearSaved();
    save();
  }
  state.finalPick = null;
  state.refineStack = [];
  state.refinePath = [];
  state.finalItem = null;
  state.offset = 0;
  state.message = '';
  $('#message-input').value = '';
  renderQuestion();
}

function init() {
  $('#start-button').addEventListener('click', () => start(true));
  $('#resume-button').addEventListener('click', () => start(false));
  $('#back-button').addEventListener('click', goBack);
  $('#more-button').addEventListener('click', showMore);
  $('#retry-button').addEventListener('click', () => start(true));
  $('#send-back-button').addEventListener('click', () => {
    if (REFINEMENTS[state.finalPick]) {
      state.refinePath = [];
      startRefine();
    } else {
      renderResult();
    }
  });
  $('#refine-back').addEventListener('click', refineBack);
  $('#copy-button').addEventListener('click', copyResult);
  $('#message-input').addEventListener('input', (event) => {
    state.message = event.target.value;
    refreshShareLinks();
    reportMessageSoon();
  });

  const match = location.hash.match(/^#r=(.+)$/);
  if (match) {
    try {
      renderReceived(decodePayload(match[1]));
      return;
    } catch (e) {
      // 壊れたリンクなら、ふつうにトップから始めてもらう
    }
  }

  const saved = loadSaved();
  state.sessionId = (saved && saved.sessionId) || newSessionId();
  state.startedAt = (saved && saved.startedAt) || new Date().toISOString();
  state.answers = saved ? saved.answers : [];
  $('#resume-button').hidden = state.answers.length === 0;

  Transport.onStatus(renderStatus);
  Transport.init();

  showScreen('intro');
}

document.addEventListener('DOMContentLoaded', init);
