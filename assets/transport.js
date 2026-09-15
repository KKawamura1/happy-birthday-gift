/*
 * transport.js — 回答を自動で送る部分
 *
 * 送り先は、使える順に自動で決まります:
 *   1. Artifact の db（Claude 上で開いたとき。動作確認用）
 *   2. config.js の REPORT_ENDPOINT（Google Apps Script。本番はこちら）
 *   3. どちらも無ければ何もしない（最後に本人がLINEで送る方式に戻る）
 *
 * 送信の考え方:
 *   - 毎回「その時点の回答ぜんぶ」を送る。途中でやめられても残るし、
 *     順番が入れ替わって届いても最後の1通が正しければよい
 *   - 押すたびに送るので、送信は1本ずつ順番に。押し急がれても詰まらないよう、
 *     待っているあいだに来た分は最新のものだけ残してまとめる
 */

const Transport = (() => {
  let backend = null;        // 決まった送り先
  let ready = false;         // 送り先の判定が終わったか
  let pending = null;        // まだ送れていない最新のデータ
  let sending = false;       // いま送信中か
  const listeners = [];      // 状態が変わったときに呼ぶ関数
  let status = 'connecting'; // connecting / sending / sent / offline / none

  function setStatus(next) {
    if (status === next) return;
    status = next;
    listeners.forEach((fn) => fn(status));
  }

  /* --- 送り先その1: Artifact の db --- */
  function dbBackend(db) {
    return async (snapshot) => {
      await db.doc(`answers/${snapshot.sessionId}`).set(snapshot);
    };
  }

  /* --- 送り先その2: Google Apps Script などの URL --- */
  function httpBackend(url) {
    const token = typeof REPORT_TOKEN === 'string' ? REPORT_TOKEN : '';
    return async (snapshot) => {
      const body = JSON.stringify(token ? { ...snapshot, token } : snapshot);
      /*
       * Apps Script は CORS のプリフライトを返さないので、
       * text/plain で投げて「単純リクエスト」にする。
       * sendBeacon が使えるときは、画面を閉じられても届く可能性が上がる。
       */
      const mode = typeof REPORT_MODE === 'string' ? REPORT_MODE : 'beacon';
      if (mode === 'beacon' && navigator.sendBeacon) {
        const ok = navigator.sendBeacon(url, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
        if (ok) return;
      }
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        keepalive: true,
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body
      });
    };
  }

  async function resolveBackend() {
    try {
      if (window.claude && typeof window.claude.use === 'function') {
        const db = await window.claude.use('db');
        if (db) return dbBackend(db);
      }
    } catch (e) { /* 使えなければ次へ */ }
    if (typeof REPORT_ENDPOINT === 'string' && REPORT_ENDPOINT.trim()) {
      return httpBackend(REPORT_ENDPOINT.trim());
    }
    return null;
  }

  async function flush() {
    if (sending || !ready || !backend || pending === null) return;
    sending = true;
    const snapshot = pending;
    pending = null;
    setStatus('sending');
    try {
      await backend(snapshot);
      setStatus(pending === null ? 'sent' : 'sending');
    } catch (e) {
      // 送れなかったぶんは捨てずに戻して、次の操作のときに再挑戦する
      if (pending === null) pending = snapshot;
      setStatus('offline');
    } finally {
      sending = false;
      if (pending !== null) setTimeout(flush, 1200);
    }
  }

  return {
    /* 送り先を決める。ページの表示はこれを待たない */
    async init() {
      backend = await resolveBackend();
      ready = true;
      setStatus(backend ? (pending === null ? 'sent' : 'sending') : 'none');
      flush();
      return Boolean(backend);
    },
    /* その時点の回答ぜんぶを送る */
    send(snapshot) {
      pending = snapshot;
      if (!ready) return;              // 判定が終わったら flush から送られる
      if (!backend) { setStatus('none'); return; }
      flush();
    },
    /* 自動送信が使えるかどうか（使えないときだけLINEボタンを出す） */
    isAuto() { return ready && Boolean(backend); },
    isReady() { return ready; },
    status() { return status; },
    onStatus(fn) { listeners.push(fn); fn(status); }
  };
})();
