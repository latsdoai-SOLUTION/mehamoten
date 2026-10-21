/* מהמותן · קול המנחה המוקלט (ElevenLabs: עמית, ואיתי לדמות "המשוגע")
   ההקלטות מאוחדות לקבצים קטנים (audio/*.mp3, עד כ-22 שניות כל אחד), והמפה ב-voice_map.js
   אומרת באיזה קובץ כל משפט נמצא, איפה הוא מתחיל וכמה זמן הוא נמשך.
   מנגן דרך Web Audio (אותו AudioContext של האפקטים), כך שאחרי נגיעה ראשונה הקול עובד גם בתוך טיימרים.
   זיכרון: משפטי הליבה נשמרים תמיד. כל השאר נשמר עד תקציב קבוע, והישן ביותר יוצא ראשון.
   אופליין: ה-Service Worker שומר את קבצי השמע במטמון. */
const MMV = (() => {
  const M = typeof MM_VOICE === "object" ? MM_VOICE : null;
  const VER = typeof APP_VERSION === "string" ? APP_VERSION : "";
  const PIN = new Set((M && M.pinned) || ["amit-core", "itai-core"]);
  const BUDGET_SEC = 160;
  const RETRY_MS = 30000;
  const clips = new Map();     /* id -> AudioBuffer (סדר = מהישן לחדש) */
  const loading = new Map();   /* group -> Promise */
  const failedAt = new Map();  /* group -> זמן כישלון הורדה אחרון */
  let cachedSec = 0, playing = [], token = 0, broken = false;

  const norm = (s) => String(s == null ? "" : s).normalize("NFC").trim();
  function ctx() { try { return typeof ac === "function" ? ac() : null; } catch (e) { return null; } }
  function wake(c) {
    if (!c || c.state === "running") return;
    try { const r = c.resume(); if (r && r.catch) r.catch(() => {}); } catch (e) {}
  }

  /* משפט או שם קובץ -> מזהה הקלטה. למשוגע: קודם הקול של איתי */
  function resolve(item, persona) {
    if (!M || item == null || item === "") return null;
    let f = String(item);
    if (!/^[a-z]+-[a-z0-9-]+$/.test(f)) { f = M.text[norm(item)]; if (!f) return null; }
    if (persona === "manic" && M.clips["itai/" + f]) return "itai/" + f;
    if (M.clips["amit/" + f]) return "amit/" + f;
    if (M.clips["itai/" + f]) return "itai/" + f;
    return null;
  }

  function slice(c, buf, start, dur) {
    const sr = buf.sampleRate, a = Math.max(0, Math.floor(start * sr)), n = Math.min(buf.length - a, Math.ceil(dur * sr));
    if (n <= 0) return null;
    const out = c.createBuffer(1, n, sr), src = buf.getChannelData(0).subarray(a, a + n);
    if (out.copyToChannel) out.copyToChannel(src, 0); else out.getChannelData(0).set(src);
    return out;
  }

  function evict(keep) {
    for (const [id, b] of clips) {
      if (cachedSec <= BUDGET_SEC) break;
      if (PIN.has(M.clips[id][0]) || keep.has(id)) continue;
      clips.delete(id); cachedSec -= b.duration;
    }
  }

  /* הורדה ופענוח של קובץ אחד, וגזירת כל המשפטים שבו. טעינה אחת לכל קובץ בכל רגע */
  function loadGroup(g, keep) {
    if (loading.has(g)) return loading.get(g);
    const c = ctx(); if (!c) { broken = true; return Promise.reject(new Error("no audio")); }
    const p = fetch("audio/" + g + ".mp3?v=" + VER)
      .then((r) => { if (!r.ok) throw new Error("http " + r.status); return r.arrayBuffer(); })
      .catch((e) => { failedAt.set(g, Date.now()); throw e; })
      .then((ab) => new Promise((res, rej) => {
        const bad = (err) => { broken = true; rej(err || new Error("decode")); };
        const q = c.decodeAudioData(ab, res, bad);
        if (q && q.then) q.then(res, bad);
      }))
      .then((buf) => {
        failedAt.delete(g);
        for (const [id, [gg, s, d]] of Object.entries(M.clips)) {
          if (gg !== g || clips.has(id)) continue;
          const b = slice(c, buf, s, d); if (!b) continue;
          clips.set(id, b); if (!PIN.has(g)) cachedSec += b.duration;
        }
        evict(keep);
      })
      .finally(() => loading.delete(g));
    loading.set(g, p);
    return p;
  }

  function ensure(ids) {
    const keep = new Set(ids), groups = new Set();
    for (const id of ids) {
      if (clips.has(id)) { const b = clips.get(id); clips.delete(id); clips.set(id, b); continue; } /* לסוף התור */
      const g = M.clips[id][0];
      if (failedAt.has(g) && Date.now() - failedAt.get(g) < RETRY_MS) continue;
      groups.add(g);
    }
    /* גם אם קובץ אחד נכשל, מה שנטען ינוגן */
    return Promise.all([...groups].map((g) => loadGroup(g, keep).catch(() => {})));
  }

  function stop() {
    token++;
    for (const s of playing) { try { s.onended = null; s.stop(); } catch (e) {} }
    playing = [];
  }

  /* מנגן רצף. כל פריט חייב להיות מוקלט: אם חסר אחד (שם, קלף שהוספתם בעצמכם), לא מנגן כלום
     ומחזיר false, כדי שלא יישמע חצי משפט כמו "הסוד היה:" ואחריו שקט. */
  function say(seq, persona) {
    if (!M || broken) return false;
    const arr = (Array.isArray(seq) ? seq : [seq]).filter((x) => x != null && x !== "");
    if (!arr.length) return false;
    const ids = arr.map((x) => resolve(x, persona));
    if (ids.some((x) => !x)) return false;
    stop(); const my = token;
    wake(ctx());
    ensure(ids).then(() => {
      if (my !== token) return;
      if (!ids.every((id) => clips.has(id))) return; /* קובץ לא נטען: עדיף שקט מחצי משפט */
      const c = ctx(); if (!c) return;
      wake(c);
      let t = c.currentTime + 0.03;
      for (const id of ids) {
        const b = clips.get(id); if (!b) continue;
        const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination);
        s.onended = () => { playing = playing.filter((x) => x !== s); };
        s.start(t); playing.push(s); t += b.duration + 0.12;
      }
    }).catch(() => {});
    return true;
  }

  /* טעינה מראש של משפטים שיגיעו בקרוב (למשל התפקיד, כבר במסך הקלפים) */
  function prefetch(seq, persona) {
    if (!M || broken || !ctx()) return;
    const ids = (Array.isArray(seq) ? seq : [seq]).map((x) => resolve(x, persona)).filter(Boolean);
    if (ids.length) ensure(ids).catch(() => {});
  }
  function warm() { if (M && !broken && ctx()) ensure(Object.keys(M.clips).filter((id) => PIN.has(M.clips[id][0]))).catch(() => {}); }
  function available() { return !!M && !broken && !!(window.AudioContext || window.webkitAudioContext) && typeof fetch === "function"; }
  function has(item, persona) { return !!resolve(item, persona); }

  /* iOS/Safari: פותחים את השמע בנגיעה הראשונה, ומעירים אותו אחרי שיחה או חזרה לאפליקציה */
  let warmed = false;
  const unlock = () => {
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (e) {} /* iPhone במצב שקט */
    const c = ctx(); wake(c);
    if (!warmed && c) { warmed = true; setTimeout(warm, 50); }
  };
  ["pointerdown", "keydown", "touchend"].forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
  document.addEventListener("visibilitychange", () => {
    let has = false; try { has = typeof AC !== "undefined" && !!AC; } catch (e) {}
    if (document.visibilityState === "visible" && has) wake(ctx());
  });

  return { say, stop, warm, prefetch, available, has, _clips: clips, _playing: () => playing.length };
})();
