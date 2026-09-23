/* ============================================================
   מהמותן — לוגיקת האפליקציה (v2.0.0)
   PWA עצמאית, עברית RTL, עובדת אופליין.
   מבנה: מצב (S) → מסכים (show) → זרימת משחק → סיכום.
   כל הכפתורים עובדים דרך data-act (האצלת אירועים אחת).
   ============================================================ */
"use strict";

const APP_VERSION = "2.2.0";
const WIN_TOKENS = 15;
const MAX_PLAYERS = 8;
const STORE_KEY = "mehamoten3";
const LEGACY_KEY = "mehamoten2";
const STATS_KEY = "mehamoten_stats";
const CUSTOM_KEY = "mehamoten_custom";
const SEEN_KEY = "mehamoten_seen";
const LIC_KEY = "mehamoten_license";
const LOGO_KEY = "mehamoten_logo";
const WA_NUMBER = "972506325398";
const SITE_URL = "https://mehamoten.onrender.com";

/* ---------- עזרים ---------- */
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
const rand = (a) => a[Math.floor(Math.random() * a.length)];
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const validCat = (c) => typeof c === "string" && Object.prototype.hasOwnProperty.call(MM_CAT, c) && c !== "guess" && c !== "ear";
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
function lsGet(k, d) { try { const r = localStorage.getItem(k); return r === null ? d : JSON.parse(r); } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

/* ---------- רישוי: קוד ארגוני חתום, נבדק במכשיר (בלי שרת) ----------
   פורמט: MM-<ארגון>-<MMYY תפוגה>-<משתתפים>-<חתימה 6 תווים>
   החתימה = SHA-256(סוד|ארגון|MMYY|משתתפים), 6 בתים ראשונים → אלפבית של 32 תווים.
   הפקת קודים: tools/license_tool.html (לא עולה לאתר). */
const LIC_SECRET = "mehamoten|stage|2026|qX7vN2pL9wRz4tHm";
const LIC_ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function sha256Bytes(str) {
  const K = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const bytes = Array.from(new TextEncoder().encode(str)); const bitLen = bytes.length * 8;
  bytes.push(0x80); while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push(i >= 4 ? 0 : (bitLen >>> (i * 8)) & 0xff);
  let H = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  for (let o = 0; o < bytes.length; o += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i++) w[i] = (bytes[o+i*4]<<24)|(bytes[o+i*4+1]<<16)|(bytes[o+i*4+2]<<8)|bytes[o+i*4+3];
    for (let i = 16; i < 64; i++) { const s0 = rotr(w[i-15],7)^rotr(w[i-15],18)^(w[i-15]>>>3); const s1 = rotr(w[i-2],17)^rotr(w[i-2],19)^(w[i-2]>>>10); w[i] = (w[i-16]+s0+w[i-7]+s1)|0; }
    let [a,b,c,d,e,f,g,h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e,6)^rotr(e,11)^rotr(e,25), ch = (e&f)^(~e&g), t1 = (h+S1+ch+K[i]+w[i])|0;
      const S0 = rotr(a,2)^rotr(a,13)^rotr(a,22), mj = (a&b)^(a&c)^(b&c), t2 = (S0+mj)|0;
      h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
    }
    H = H.map((v, i) => (v + [a,b,c,d,e,f,g,h][i]) | 0);
  }
  const out = []; H.forEach((v) => out.push((v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255)); return out;
}
function licSig(org, mmyy, seats) { const b = sha256Bytes(LIC_SECRET + "|" + org + "|" + mmyy + "|" + seats); return b.slice(0, 6).map((x) => LIC_ALPHA[x % 32]).join(""); }
function parseLicense(code) {
  const c = String(code || "").trim().toUpperCase().replace(/\s+/g, "");
  const m = c.match(/^MM-([A-Z0-9]{2,12})-(\d{4})-(\d{1,4})-([A-Z2-9]{6})$/);
  if (!m) return { ok: false, reason: "format" };
  const [, org, mmyy, seats, sig] = m;
  if (licSig(org, mmyy, seats) !== sig) return { ok: false, reason: "sig" };
  const mm = +mmyy.slice(0, 2), yy = 2000 + +mmyy.slice(2);
  if (mm < 1 || mm > 12) return { ok: false, reason: "format" };
  const exp = new Date(yy, mm, 0, 23, 59, 59).getTime(); // סוף החודש
  return { ok: true, code: c, org, seats: +seats, exp, mmyy };
}
let LIC = null;
function loadLicense() { const r = lsGet(LIC_KEY, null); if (r && r.code) { const p = parseLicense(r.code); LIC = p.ok ? p : null; } }
function licActive() { return !!(LIC && LIC.exp > Date.now()); }
function licDaysLeft() { return LIC ? Math.ceil((LIC.exp - Date.now()) / 864e5) : 0; }
function licLabel() {
  if (!LIC) return "";
  const d = new Date(LIC.exp); const when = d.toLocaleDateString("he-IL", { month: "long", year: "numeric" });
  return `<b>${esc(LIC.org)}</b> · בתוקף עד ${when}` + (LIC.seats ? ` · עד ${LIC.seats} משתתפים` : "");
}
function renderLicBoxes() {
  const BTN = `<br><button class="ghost goldb" data-act="enterCode" style="min-height:40px;padding:8px 16px;font-size:14px">🔑 יש לי קוד</button>`;
  const html = licActive()
    ? `✅ קוד ארגוני פעיל: ${licLabel()}` + (licDaysLeft() <= 14 ? `<br>⏳ נותרו ${licDaysLeft()} ימים. <a href="${waLink("renew")}" target="_blank" rel="noopener" style="color:var(--spot)">לחידוש בוואטסאפ</a>` : "")
    : LIC ? `⛔ הקוד של <b>${esc(LIC.org)}</b> פג תוקף. <a href="${waLink("renew")}" target="_blank" rel="noopener" style="color:var(--spot)">לחידוש בוואטסאפ</a>` + BTN
    : `${S.teamTrialUsed ? "🔒 סיבוב הניסיון במצב צוות נוצל. להמשך צריך קוד ארגוני (מ-590 ₪)." : "🔓 ניסיון חינם: סיבוב אחד במצב צוות. להמשך, צריך קוד ארגוני (מ-590 ₪)."}` + BTN;
  $$("#licBox, #licBox2").forEach((el) => { el.innerHTML = el.id === "licBox2" ? html.replace(BTN, "") : html; el.classList.toggle("ok", licActive()); el.classList.toggle("warn", !!LIC && !licActive()); });
  const rb = $("#licRemoveBtn"); if (rb) rb.hidden = !LIC;
  renderLogo();
  $$('[data-role="mgrcta"]').forEach((el) => el.hidden = licActive());
  $$('[data-role="mgrwa"]').forEach((a) => a.href = waLink("manager"));
  const ow = $("#offerWa"); if (ow) ow.href = waLink("offer");
}
function waLink(kind) {
  const org = (S.company || (LIC && LIC.org) || "").trim();
  const msgs = {
    manager: `היי, שיחקנו במהמותן${org ? " (" + org + ")" : ""} ואשמח לשמוע על קוד ארגוני לצוות`,
    offer: `היי, סיימנו סיבוב ניסיון במצב צוות${org ? " (" + org + ")" : ""} ואשמח לקבל קוד ארגוני`,
    renew: `היי, אשמח לחדש את הקוד הארגוני${org ? " של " + org : ""}`
  };
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msgs[kind] || msgs.manager)}`;
}
async function enterCode() {
  const v = await dialog({ title: "🔑 קוד ארגוני", text: "הדביקו את הקוד שקיבלתם (למשל MM-ACME-1026-50-K7Q2MX):", input: "MM-....", okText: "הפעל" });
  if (v === null) return; const p = parseLicense(v);
  if (!p.ok) { await notify("הקוד לא זוהה", p.reason === "sig" ? "הקוד לא תקין. בדקו שהעתקתם את כולו, או פנו אלינו בוואטסאפ." : "הפורמט לא נכון. קוד נראה כך: MM-ACME-1026-50-K7Q2MX"); return; }
  if (p.exp <= Date.now()) { await notify("הקוד פג תוקף", "פנו אלינו בוואטסאפ לחידוש."); return; }
  LIC = p; lsSet(LIC_KEY, { code: p.code }); S.teamTrialUsed = false; S.trialRound = false;
  const onOffer = $("#offer").classList.contains("active");
  if (!S.inGame || onOffer) S.team = true;
  save(); renderLicBoxes(); syncSetupUI(); sfx.bell(); toastMsg(`הקוד הופעל! מצב צוות פתוח ל-${p.org}`);
  if (onOffer) { if (S.scored) showBoard(`סיבוב ${S.round} הסתיים`); else roundEnd2(); }
}
async function removeCode() {
  const ok = await dialog({ title: "להסיר את הקוד הארגוני?", text: "אפשר להזין אותו שוב בכל עת.", okText: "הסר", danger: true }); if (!ok) return;
  LIC = null; try { localStorage.removeItem(LIC_KEY); } catch (e) {} renderLicBoxes(); syncSetupUI();
}
function teamAllowed() { return licActive() || !S.teamTrialUsed; }

/* ---------- מצב ---------- */
const DEFAULT_SETTINGS = { persona: "compere", tts: true, sfx: true, hints: true, motion: true, voiceURI: "" };
const S = {
  players: ["", "", ""], mode: "auto", scored: false, level: "easy", kids: false, team: false, company: "", industry: "",
  packs: ["style", "lang", "body"], sceneLen: 90, big: false,
  scores: {}, honors: {}, directorIdx: 0, round: 0, dirCounts: {}, curDir: "", curPerf: [], starter: "",
  guessIdx: 0, inGame: false, startedAt: 0, teamTrialUsed: false, trialRound: false,
  set: null, con: null, conCat: null, rings: 0, topics: 0,
  log: [], debriefPicked: [],
  settings: { ...DEFAULT_SETTINGS }
};
function save() { lsSet(STORE_KEY, S); }
function load() {
  let r = lsGet(STORE_KEY, null);
  if (!r) { const legacy = lsGet(LEGACY_KEY, null); if (legacy) r = legacy; }
  if (r && typeof r === "object") Object.assign(S, r);
  // ניקוי/תיקון ערכים
  if (!Array.isArray(S.players) || S.players.length < 2) S.players = ["", "", ""];
  S.players = S.players.slice(0, MAX_PLAYERS).map((p) => String(p || "").slice(0, 24));
  S.settings = { ...DEFAULT_SETTINGS, ...(S.settings || {}) };
  if (!Array.isArray(S.packs) || !S.packs.length) S.packs = ["style", "lang", "body"];
  S.packs = S.packs.filter((p) => p === "guess" || p === "ear" || MINI[p] || MM_DATA[p]);
  if (!S.packs.length) S.packs = ["style", "lang", "body"];
  if (![60, 90, 120].includes(+S.sceneLen)) S.sceneLen = 90; else S.sceneLen = +S.sceneLen;
  if (!["auto", "manual"].includes(S.mode)) S.mode = "auto";
  if (!["easy", "reg"].includes(S.level)) S.level = "easy";
  if (S.industry && !MM_INDUSTRY[S.industry]) S.industry = "";
  if (!Array.isArray(S.log)) S.log = [];
  if (!Array.isArray(S.debriefPicked)) S.debriefPicked = [];
  ["scores", "dirCounts", "honors"].forEach((k) => { if (!S[k] || typeof S[k] !== "object" || Array.isArray(S[k])) S[k] = {}; });
  if (!Array.isArray(S.curPerf)) S.curPerf = [];
  if (typeof S.round !== "number" || S.round < 0) S.round = 0;
  if (typeof S.directorIdx !== "number") S.directorIdx = 0;
  if (!Array.isArray(S.set) || S.set.length < 3) S.set = null;
  if (!Array.isArray(S.con) || S.con.length < 3) S.con = null;
  if (S.set && !MM_CAT[S.conCat]) { S.conCat = null; S.con = null; }
  if (typeof S.guessIdx !== "number") S.guessIdx = 0;
  S.kids = !!S.kids; S.team = !!S.team; S.big = !!S.big; S.scored = !!S.scored;
}

/* סטטיסטיקה מקומית בלבד (בלי שרת) */
const STATS = Object.assign({ games: 0, rounds: 0, swaps: 0 }, lsGet(STATS_KEY, {}));
function bumpStat(k, n = 1) { STATS[k] = (STATS[k] || 0) + n; lsSet(STATS_KEY, STATS); }

/* קלפים מותאמים אישית */
let CUSTOM = [];
function loadCustom() { const c = lsGet(CUSTOM_KEY, []); CUSTOM = Array.isArray(c) ? c.filter((x) => x && typeof x.t === "string" && validCat(x.cat)) : []; }
function saveCustom() { lsSet(CUSTOM_KEY, CUSTOM); clearDecks(); }

/* ---------- חפיסות מעורבבות (בלי חזרות) ---------- */
const decks = {}, lastDrawn = {};
function shuffleCopy(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
function clearDecks() { for (const k in decks) delete decks[k]; }
function kp(arr) { return S.kids ? arr.filter((x) => !MM_KIDS_SKIP_NEW.has(Array.isArray(x) ? x[0] : x)) : arr; }
function drawDeck(key, arr) {
  if (!arr || !arr.length) return undefined;
  const dk = key + "#" + arr.length;
  if (!decks[dk] || !decks[dk].length) {
    decks[dk] = shuffleCopy(arr);
    if (decks[dk].length > 1 && decks[dk][decks[dk].length - 1] === lastDrawn[key]) decks[dk].unshift(decks[dk].pop());
  }
  const v = decks[dk].pop(); lastDrawn[key] = v; return v;
}
function pool(cat) {
  const ext = CUSTOM.filter((c) => c.cat === cat).map((c) => [c.t, c.d, "קלף שלכם — לכו על זה בביטחון מלא!"]);
  let all = (MM_DATA[cat] || []).concat(ext);
  if (cat === "set" && S.team && S.industry && MM_INDUSTRY[S.industry]) all = all.concat(MM_INDUSTRY[S.industry].cards);
  if (S.kids) all = all.filter((c) => !MM_KIDS_BLOCK.has(c[0]));
  return all;
}

/* ---------- מסכים ---------- */
let currentScreen = "home";
function show(id) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const el = $("#" + id); if (!el) return;
  el.classList.add("active"); el.scrollTop = 0; currentScreen = id;
  document.body.classList.toggle("ingame", !["home", "setup", "summary"].includes(id));
  const focusEl = el.querySelector("h1,h2,.who,.eyebrow,.guide"); if (focusEl) { focusEl.setAttribute("tabindex", "-1"); focusEl.focus({ preventScroll: true }); }
}
function activeP() { return S.players.map((p) => p.trim()).filter(Boolean); }

/* ---------- אודיו ---------- */
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return AC; }
function tone(freq, dur, type = "sine", vol = .4, slideTo = null) {
  if (!S.settings.sfx) return; const c = ac(); if (!c) return;
  if (c.state === "suspended") c.resume().catch(() => {});
  const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = freq;
  if (slideTo) o.frequency.linearRampToValueAtTime(slideTo, c.currentTime + dur);
  g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur);
}
const sfx = {
  bell() { tone(880, .12, "triangle", .5); setTimeout(() => tone(1320, .5, "triangle", .4), 60); },
  swap() { tone(180, .18, "sawtooth", .5, 520); setTimeout(() => tone(660, .3, "square", .4), 120); },
  start() { tone(523, .12, "triangle", .4); setTimeout(() => tone(784, .25, "triangle", .4), 120); },
  end() { tone(784, .15, "triangle", .4); setTimeout(() => tone(523, .15, "triangle", .4), 140); setTimeout(() => tone(392, .4, "triangle", .4), 300); },
  tick() { tone(1000, .04, "square", .18); },
  hint() { tone(1180, .09, "sine", .3); setTimeout(() => tone(1560, .12, "sine", .25), 70); },
  topic() { tone(420, .1, "triangle", .4, 720); setTimeout(() => tone(900, .18, "triangle", .35), 100); },
  count() { tone(700, .12, "square", .4); },
  freeze() { tone(440, .1, "square", .4); setTimeout(() => tone(330, .3, "square", .4), 120); }
};

/* ---------- קול (TTS) ---------- */
let VOICES = [];
function loadVoices() {
  if (!("speechSynthesis" in window)) return;
  VOICES = speechSynthesis.getVoices();
  const sel = $("#voiceSel"); if (!sel) return;
  const he = VOICES.filter((v) => /^(he|iw)/i.test(v.lang)); const list = he.length ? he : VOICES;
  sel.innerHTML = list.map((v) => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join("") || `<option value="">אין קולות זמינים</option>`;
  if (S.settings.voiceURI && list.some((v) => v.voiceURI === S.settings.voiceURI)) sel.value = S.settings.voiceURI;
  else if (he[0]) { sel.value = he[0].voiceURI; S.settings.voiceURI = he[0].voiceURI; }
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { if (!$("#settings").classList.contains("open")) loadVoices(); };
function speak(text) {
  if (!S.settings.tts || !text || !("speechSynthesis" in window)) return;
  try {
    if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = "he-IL";
    const v = VOICES.find((x) => x.voiceURI === S.settings.voiceURI); if (v) u.voice = v;
    u.rate = { compere: 1.05, cynic: .95, manic: 1.25 }[S.settings.persona] || 1;
    u.pitch = { compere: 1.1, cynic: .9, manic: 1.3 }[S.settings.persona] || 1;
    u.volume = 1; setTimeout(() => speechSynthesis.speak(u), 0);
  } catch (e) {}
}
function persona() { return MM_PERSONA[S.settings.persona] || MM_PERSONA.compere; }

/* ---------- חלוניות (במקום alert/confirm/prompt) ---------- */
function dialog({ title, text, input, value = "", okText = "אישור", cancelText = "ביטול", danger = false }) {
  return new Promise((resolve) => {
    let m = $("#dlg");
    if (!m) { m = document.createElement("div"); m.id = "dlg"; m.className = "modal"; m.style.zIndex = "90"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); document.body.appendChild(m); }
    m.innerHTML = `<div class="panel" style="width:min(560px,94vw);text-align:right">
      <h2 style="font-size:clamp(22px,3.4vmin,32px)">${esc(title || "")}</h2>
      ${text ? `<p class="sub" style="font-size:16px;color:#e9e3d4">${esc(text)}</p>` : ""}
      ${input ? `<textarea id="dlgIn" class="tinput" rows="4" style="resize:vertical;font-size:14px" placeholder="${esc(input)}"></textarea>` : ""}
      <div class="row" style="margin-top:18px;justify-content:flex-start">
        <button class="${danger ? "ghost" : "big sm"}" data-dlg="ok">${esc(okText)}</button>
        ${cancelText ? `<button class="${danger ? "big sm" : "ghost"}" data-dlg="cancel">${esc(cancelText)}</button>` : ""}
      </div></div>`;
    m.classList.add("open");
    const done = (ok) => { m.classList.remove("open"); const v = input ? ($("#dlgIn")?.value || "") : true; resolve(ok ? v : null); };
    m.onclick = (e) => { const b = e.target.closest("[data-dlg]"); if (!b) return; done(b.dataset.dlg === "ok"); };
    m.onkeydown = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
    const ta = $("#dlgIn"); if (ta && value) { ta.value = value; ta.focus(); ta.select(); }
    const first = m.querySelector(input ? "#dlgIn" : "[data-dlg=ok]"); if (first && !(ta && value)) first.focus();
  });
}
const notify = (title, text) => dialog({ title, text, okText: "סגור", cancelText: "" });

/* ---------- אונבורדינג ---------- */
let obIdx = 0; const OB_LAST = 4;
function renderObDots() { $("#obDots").innerHTML = [0, 1, 2, 3, 4].map((i) => `<i class="${i === obIdx ? "on" : ""}"></i>`).join(""); }
function openOnboard(force) {
  if (!force && lsGet(SEEN_KEY, false)) return false;
  obIdx = 0; showOb(); $("#onboard").classList.add("open"); return true;
}
function showOb() {
  $$("#onboard .ob").forEach((o) => o.classList.toggle("on", +o.dataset.i === obIdx));
  renderObDots(); $("#obNext").textContent = obIdx >= OB_LAST ? "מתחילים!" : "הבא";
}
function nextOnboard() { if (obIdx < OB_LAST) { obIdx++; showOb(); } else skipOnboard(); }
function skipOnboard() { lsSet(SEEN_KEY, true); $("#onboard").classList.remove("open"); ac(); }

/* ---------- רמזים ונושאים ---------- */
let hintT = null, topicT = null;
function applyHintsVis() {
  const on = S.settings.hints;
  const e = $("#drawHintBtn"); if (e) e.hidden = !on;
  $$("#manualCtrl .hintb, #manualCtrl .stuckb, #autoCtrl .hintb, #autoCtrl .stuckb").forEach((b) => b.hidden = !on);
}
function toastMsg(text) {
  $("#hintKind").textContent = "שימו לב"; $("#hintTxt").textContent = text;
  $("#hint").classList.add("show"); sfx.hint(); if (hintT) clearTimeout(hintT); hintT = setTimeout(hideHint, 4000);
}
function showHint(kind, text) {
  if (!S.settings.hints) return;
  $("#hintKind").textContent = kind; $("#hintTxt").textContent = text; $("#hint").classList.add("show");
  sfx.hint(); speak(text); if (hintT) clearTimeout(hintT); hintT = setTimeout(hideHint, 7000);
}
function hideHint() { $("#hint").classList.remove("show"); }
function openerHint() { if (S.set) showHint("רמז לפתיחה", S.set[2]); }
let tipIdx = 0;
function sceneHint() {
  if (S.con && Math.random() < .55) showHint("איך לנצח את האילוץ", S.con[2]);
  else { showHint("טיפ אלתור", MM_TIPS[tipIdx % MM_TIPS.length]); tipIdx++; }
}
function stuck() { showHint("תקוע? תגיד את זה", '"' + drawDeck("openers", MM_OPENERS) + '"'); }
function showTopicToast(text) { $("#topicTxt").textContent = text; $("#topic").classList.add("show"); if (topicT) clearTimeout(topicT); topicT = setTimeout(hideTopic, 6000); }
function hideTopic() { $("#topic").classList.remove("show"); }
function throwTopic() {
  if (!sceneRunning || paused) return; S.topics++;
  let tp = MM_TOPICS; if (S.kids) tp = tp.filter((x) => !MM_KIDS_TOPIC_BLOCK.some((b) => x.includes(b)));
  const t = drawDeck("topics", tp); showTopicToast(t); sfx.topic(); speak(persona().topic(t));
}

/* ---------- הגדרת משחק ---------- */
function goSetup() { renderPlayers(); syncSetupUI(); show("setup"); ac(); }
function renderPlayers() {
  $("#players").innerHTML = S.players.map((p, i) => `
    <div class="prow"><div class="idx">${i + 1}</div>
      <input type="text" value="${esc(p)}" maxlength="24" placeholder="שחקן ${i + 1}" data-pi="${i}" aria-label="שם שחקן ${i + 1}" autocomplete="off" enterkeyhint="next">
      ${S.players.length > 2 ? `<button class="del" data-act="delPlayer" data-i="${i}" aria-label="הסר שחקן ${i + 1}">✕</button>` : ""}</div>`).join("");
}
function addPlayer() {
  if (S.players.length >= MAX_PLAYERS) { toastMsg(`עד ${MAX_PLAYERS} שחקנים`); return; }
  S.players.push(""); renderPlayers(); const last = $$("#players input").pop(); if (last) last.focus();
}
function delPlayer(i) { if (S.players.length <= 2) return; S.players.splice(i, 1); renderPlayers(); }
function buildIndustrySeg() {
  const seg = $("#industrySeg");
  seg.innerHTML = `<button data-v="">🎲 כללי</button>` + Object.entries(MM_INDUSTRY).map(([k, v]) => `<button data-v="${k}">${v.ic} ${esc(v.label)}</button>`).join("");
}
function setOn(segId, val) { $$(`#${segId} button`).forEach((b) => { const on = b.dataset.v === val; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); }
function syncSetupUI() {
  setOn("modeSeg", S.mode); setOn("scoredSeg", S.scored ? "scored" : "party"); setOn("levelSeg", S.level);
  setOn("kidsSeg", S.kids ? "on" : "off"); setOn("teamSeg", S.team ? "on" : "off"); setOn("bigSeg", S.big ? "on" : "off");
  setOn("timeSeg", String(S.sceneLen)); setOn("industrySeg", S.industry || "");
  $("#teamExtra").hidden = !S.team; $("#companyInput").value = S.company || ""; renderLicBoxes();
  $$("#packSeg button").forEach((b) => { const on = S.packs.includes(b.dataset.pack); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
  $$("#scoredSeg button").forEach((b) => b.disabled = S.kids);
  const gb = $('#packSeg button[data-pack="guess"]'); if (gb) gb.disabled = S.kids;
}
function onSetupSeg(seg, btn) {
  const key = seg.dataset.key, v = btn.dataset.v;
  if (key === "mode") S.mode = v;
  else if (key === "scored") S.scored = v === "scored";
  else if (key === "level") S.level = v;
  else if (key === "kids") {
    S.kids = v === "on";
    if (S.kids) { S.scored = false; S.packs = S.packs.filter((p) => p !== "guess"); if (!S.packs.length) S.packs = ["style", "lang", "body"]; if (S.sceneLen < 120) S.sceneLen = 120; }
    clearDecks();
  }
  else if (key === "team") S.team = v === "on";
  else if (key === "industry") { S.industry = v; clearDecks(); }
  else if (key === "sceneLen") S.sceneLen = +v;
  else if (key === "big") {
    S.big = v === "on"; document.body.classList.toggle("bigscreen", S.big);
    try { if (S.big && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {}); else if (!S.big && document.fullscreenElement) document.exitFullscreen(); } catch (e) {}
  }
  syncSetupUI(); save();
}
function togglePack(p) {
  const i = S.packs.indexOf(p);
  if (i >= 0) { if (S.packs.length > 1) S.packs.splice(i, 1); else toastMsg("צריך לפחות חבילה אחת"); }
  else S.packs.push(p);
  syncSetupUI(); save();
}

/* ---------- עורך קלפים ---------- */
let edCat = "set";
function openEditor() { renderCustom(); $("#editor").classList.add("open"); $("#edTitle").focus(); }
function closeEditor() { $("#editor").classList.remove("open"); }
function addCustomCard() {
  const t = $("#edTitle").value.trim(), d = $("#edDesc").value.trim();
  if (!t) { $("#edTitle").focus(); return; }
  if (CUSTOM.some((c) => c.cat === edCat && c.t === t)) { toastMsg("כבר יש קלף כזה"); return; }
  CUSTOM.push({ cat: edCat, t: t.slice(0, 40), d: d.slice(0, 90) }); saveCustom();
  $("#edTitle").value = ""; $("#edDesc").value = ""; $("#edTitle").focus(); renderCustom(); sfx.hint();
}
function delCustomCard(i) { CUSTOM.splice(i, 1); saveCustom(); renderCustom(); }
async function exportCustom() {
  if (!CUSTOM.length) { await notify("אין קלפים לייצוא", "הוסיפו קודם קלף אחד לפחות."); return; }
  const txt = "מהמותן-קלפים:" + JSON.stringify(CUSTOM);
  let ok = false;
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(txt); ok = true; } } catch (e) {}
  if (ok) await notify("הועתק!", "שלחו את הטקסט לחברים — הם ידביקו אותו ב'ייבוא'.");
  else await dialog({ title: "העתיקו את הטקסט", text: "סמנו הכול והעתיקו:", input: " ", value: txt, okText: "סגור", cancelText: "" });
}
async function importCustom() {
  const txt = await dialog({ title: "ייבוא קלפים", text: "הדביקו כאן את הטקסט שקיבלתם:", input: "מהמותן-קלפים:[...]", okText: "ייבא" });
  if (!txt) return;
  try {
    const raw = txt.trim().replace(/^[‎‏﻿]*מהמותן-קלפים:/, "").trim();
    const arr = JSON.parse(raw); if (!Array.isArray(arr)) throw 0;
    let added = 0;
    arr.forEach((c) => { if (c && c.t && validCat(c.cat) && !CUSTOM.some((x) => x.cat === c.cat && x.t === c.t)) { CUSTOM.push({ cat: c.cat, t: String(c.t).slice(0, 40), d: String(c.d || "").slice(0, 90) }); added++; } });
    saveCustom(); renderCustom();
    await notify(added ? `נוספו ${added} קלפים! 🎉` : "לא נמצאו קלפים חדשים", added ? "" : "ייתכן שכולם כבר קיימים אצלכם.");
  } catch (e) { await notify("הטקסט לא זוהה", "ודאו שהעתקתם את כולו, כולל ההתחלה 'מהמותן-קלפים:'."); }
}
function renderCustom() {
  $("#edCount").textContent = CUSTOM.length;
  const cols = { set: "var(--set)", style: "var(--style)", lang: "var(--lang)", body: "var(--body)" };
  $("#customList").innerHTML = CUSTOM.length ? CUSTOM.map((c, i) =>
    `<div class="crow"><div class="cc" style="background:${cols[c.cat] || "var(--set)"}"></div>
     <div class="ct"><b>${esc(c.t)}</b><span>${MM_CAT[c.cat] ? MM_CAT[c.cat].label : ""}${c.d ? " · " + esc(c.d) : ""}</span></div>
     <button class="del" data-act="delCustomCard" data-i="${i}" aria-label="מחק">✕</button></div>`).join("")
    : `<div class="emptyc">עדיין אין קלפים משלכם — הוסיפו את הראשון!</div>`;
}

/* ---------- זרימת משחק ---------- */
let guessRound = false, guessWin = false, hinterPick = null, gameActive = false;
let earRound = false, earRevealed = false, earNextAt = 0; const earCaught = new Set();
let miniRound = false, miniCueIdx = 0, miniExtra = 0, miniTopicShown = false;
async function startGame() {
  S.company = ($("#companyInput").value || "").trim().slice(0, 40);
  const ps = activeP();
  if (S.kids) { S.scored = false; S.packs = S.packs.filter((p) => p !== "guess"); if (!S.packs.length) S.packs = ["style", "lang", "body"]; }
  if (S.mode === "auto" && ps.length < 2) { await notify("חסרים שחקנים", "במצב אוטומטי צריך לפחות 2 שחקנים עם שמות."); return; }
  if (S.mode === "manual" && ps.length < 3) { await notify("חסרים שחקנים", "במצב ידני צריך לפחות 3 שחקנים (במאי + 2 מאלתרים)."); return; }
  const norm = ps.map((p) => p.replace(/\s+/g, " ").toLowerCase());
  if (new Set(norm).size !== norm.length) { toastMsg("יש שני שחקנים עם אותו שם — שנו אחד מהם"); return; }
  S.scores = {}; S.dirCounts = {}; S.honors = {}; ps.forEach((p) => { S.scores[p] = 0; S.dirCounts[p] = 0; S.honors[p] = 0; });
  S.round = 0; S.directorIdx = 0; S.guessIdx = 0; S.earIdx = 0; S.miniIdx = 0; S.log = []; S.debriefPicked = []; S.startedAt = Date.now();
  S.trialRound = false;
  if (S.team && !licActive()) {
    if (S.teamTrialUsed) { S.team = false; S.industry = ""; toastMsg("סיבוב הניסיון במצב צוות נוצל. ממשיכים במצב רגיל."); }
    else S.trialRound = true;
  }
  guessRound = false; guessWin = false; earRound = false; miniRound = false; gameActive = true; S.inGame = true; clearDecks();
  bumpStat("games"); keepAwake(true); save(); nextRound();
}
function rolesForRound() {
  const ps = activeP(), n = ps.length;
  if (S.mode === "auto") return { dir: "", perf: [ps[S.directorIdx % n], ps[(S.directorIdx + 1) % n]] };
  const dir = ps[S.directorIdx % n], perf = []; let k = 1;
  while (perf.length < 2 && k <= n) { const c = ps[(S.directorIdx + k) % n]; if (c !== dir && !perf.includes(c)) perf.push(c); k++; }
  return { dir, perf };
}
function nextRound() {
  gameActive = true; S.inGame = true; keepAwake(true);
  if (S.team && !licActive() && S.teamTrialUsed && !S.trialRound) { S.team = false; S.industry = ""; save(); }
  S.round++; const { dir, perf } = rolesForRound();
  S.curDir = dir; S.curPerf = perf; S.starter = rand(perf);
  $("#introRnum").textContent = "סיבוב " + S.round + (S.company ? " · " + S.company : ""); renderLogo();
  $("#introPerf").textContent = perf.join("  •  ");
  if (S.mode === "manual") { $("#introDirLine").hidden = false; $("#introDir").textContent = dir; $("#introWho").textContent = dir + ", את/ה הבמאי/ת"; }
  else { $("#introDirLine").hidden = true; $("#introWho").textContent = "המנחה מוכן"; }
  show("intro"); speak(persona().intro(perf.join(" ו"))); save();
}
function buildCard(cat, card) {
  return `<div class="gcard ${cat} b-${cat}">
    <div class="band"><span class="cdot"></span><span class="lbl">${MM_CAT[cat].label}</span><span class="ic">${MM_CAT[cat].ic}</span></div>
    <div class="body"><h3 class="t">${esc(card[0])}</h3><div class="rule"></div><p class="d">${esc(card[1])}</p>
    <div class="wm" aria-hidden="true">${MM_CAT[cat].ltr}</div><div class="foot">מהמותן</div></div></div>`;
}
function drawCards() {
  const packs = S.kids ? S.packs.filter((p) => p !== "guess") : S.packs;
  const cat = rand(packs.length ? packs : ["style", "lang", "body"]);
  earRound = false; miniRound = false;
  if (cat === "guess") { setupGuessRound(); return; }
  if (cat === "ear") { setupEarRound(); return; }
  if (MINI[cat]) { setupMiniRound(cat); return; }
  guessRound = false; guessWin = false;
  { const r = rolesForRound(); S.curDir = r.dir; S.curPerf = r.perf; if (!S.curPerf.includes(S.starter)) S.starter = rand(S.curPerf); }
  S.set = drawDeck("set", pool("set")); S.conCat = cat; S.con = drawDeck(cat, pool(cat));
  $("#drawRnum").textContent = "סיבוב " + S.round + " · הבמה והאילוץ שלכם";
  $("#drawCards").innerHTML = buildCard("set", S.set) + buildCard(cat, S.con);
  applyHintsVis(); show("draw"); sfx.start(); speak(persona().draw(S.set[0], S.con[0]));
}
function goCast() {
  $("#castPlace").textContent = S.set[0]; $("#castRel").textContent = S.set[1]; $("#castStarter").textContent = S.starter;
  $("#castCon").textContent = "האילוץ: " + S.con[0] + " — " + S.con[1];
  const seed = $("#castSeed");
  if (S.level === "easy") { seed.hidden = false; $("#castSeedTxt").textContent = '"' + rand(MM_OPENERS) + '"'; } else seed.hidden = true;
  show("cast"); speak(persona().frame(S.set[0], S.set[1], S.starter));
}

/* ---------- סיבוב האוזניה ----------
   אחד עם הגב למסך (המאזין/ה), אחד מול המסך (הסוכן/ת) + הקהל.
   כל ~30 שניות משימה סודית חדשה. בסוף המאזין/ה מנחש/ת מה היו המשימות.
   חשוב: לא מקריאים משימות בקול (TTS) — זה היה חושף אותן. */
function earCount() { return Math.max(2, Math.round(S.sceneLen / 30)); }
function earEvery() { return Math.round(S.sceneLen / earCount()); }
function setupEarRound() {
  const ps = activeP(), n = ps.length, i = (S.earIdx || 0) % n;
  S.earListener = ps[i]; S.earAgent = ps[(i + 1) % n];
  S.curDir = ""; S.curPerf = [S.earListener, S.earAgent]; S.starter = S.earAgent;
  S.set = drawDeck("set", pool("set")); S.ear = { missions: [] };
  earRound = true; guessRound = false; guessWin = false; save();
  $("#earRnum").textContent = "סיבוב " + S.round + " · האוזניה";
  $("#earListenerName").textContent = S.earListener; $("#earAgentName").textContent = S.earAgent;
  $("#earEvery").textContent = earEvery(); renderEarSet();
  show("earIntro"); sfx.start();
  speak(`סיבוב האוזניה! ${S.earListener}, להסתובב עם הגב למסך. ${S.earAgent}, את או אתה הסוכן.`);
}
function renderEarSet() {
  $("#earSetCard").innerHTML = `<div class="scard set"><div class="k">📍 הסצנה</div><div class="v">${esc(S.set[0])}</div><div class="vd">${esc(S.set[1])}</div></div>`;
}
function earRedrawSet() { S.set = drawDeck("set", pool("set")); save(); renderEarSet(); }
function renderEarMission(anim) {
  const m = S.ear.missions[S.ear.missions.length - 1]; if (!m) return;
  $("#earNum").textContent = S.ear.missions.length; $("#earTitle").textContent = m[0]; $("#earDesc").textContent = m[1];
  const card = $("#earMission"); if (!card) return;
  if (anim) { card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop"); }
}
function earNext(auto) {
  if (!earRound || !sceneRunning || paused) return;
  if (S.ear.missions.length >= earCount() + 3) { toastMsg("מספיק משימות לסבב אחד 🙂"); return; }
  const m = drawDeck("ear", kp(MM_EAR)); S.ear.missions.push([m[0], m[1], elapsed]);
  earNextAt = elapsed + earEvery(); save();
  renderEarMission(true); sfx.hint();
  try { if (navigator.vibrate) navigator.vibrate(90); } catch (e) {}
}
const EAR_MIN_SECS = 8;
function earValid() {
  const ms = S.ear.missions, end = Math.min(elapsed, S.sceneLen);
  return ms.filter((m, i) => ((i + 1 < ms.length ? ms[i + 1][2] : end) - (m[2] || 0)) >= EAR_MIN_SECS);
}
function finishEar() {
  earRevealed = false; earCaught.clear();
  S.ear.valid = earValid(); save();
  const ms = S.ear.valid, skipped = S.ear.missions.length - ms.length;
  $("#earRevealTitle").textContent = `${S.earListener}, להסתובב! 🔄`;
  $("#earRevealSub").textContent = `היו ${ms.length} משימות סודיות. נחשו מה הן, ורק אז חושפים.` + (skipped ? ` (${skipped} דולגו מהר מדי ולא נספרות)` : "");
  $("#earList").innerHTML = ms.map((m, i) => `<button class="earitem blurred" data-ec="${i}" aria-pressed="false">
    <span class="n">${i + 1}</span><span class="tx"><b>${esc(m[0])}</b><small>${esc(m[1])}</small></span><span class="st">🎯 נתפס</span></button>`).join("");
  $("#earRevealBtn").hidden = false; $("#earTapHint").hidden = true; $("#earContinueBtn").hidden = true;
  sfx.end(); speak(`נגמר הזמן! ${S.earListener}, להסתובב. מה היו המשימות?`);
  show("earReveal");
}
function earReveal() {
  earRevealed = true; $$("#earList .earitem").forEach((b) => b.classList.remove("blurred"));
  $("#earRevealBtn").hidden = true; $("#earTapHint").hidden = false; $("#earContinueBtn").hidden = false; sfx.bell();
}
function toggleEarCaught(btn) {
  if (!earRevealed) { toastMsg("קודם מנחשים, אחר כך חושפים 👀"); return; }
  const i = +btn.dataset.ec; if (earCaught.has(i)) earCaught.delete(i); else earCaught.add(i);
  const on = earCaught.has(i); btn.classList.toggle("on", on); btn.setAttribute("aria-pressed", on ? "true" : "false");
}
function applyEarScore() {
  if (!earRound || !earRevealed || currentScreen !== "earReveal") return;
  const ms = S.ear.valid || [], caught = earCaught.size;
  if (S.scored) {
    S.scores[S.earListener] = (S.scores[S.earListener] || 0) + caught;
    S.scores[S.earAgent] = (S.scores[S.earAgent] || 0) + (ms.length - caught);
  }
  logRound({ type: "ear", listener: S.earListener, agent: S.earAgent, missions: ms.map((m) => m[0]), caught, secs: Math.min(elapsed, S.sceneLen) });
  earRound = false; earRevealed = false; earCaught.clear(); advanceRound();
  if (S.scored) showBoard(`סיבוב ${S.round} הסתיים`);
  else roundEnd2();
}

/* ---------- משחקוני מסך ----------
   מנוע אחד: קלף פתיחה + "רמזים" מתוזמנים על המסך (cues) לפי זמן שעבר בסצנה,
   כך שהשהיה עוצרת גם אותם. לא מקריאים קלפים ב-TTS. */
function accelCues(first, gap0) {
  const L = S.sceneLen, out = []; let t = first, g = gap0;
  while (t < L - 4) { out.push(Math.round(t)); t += g; g = Math.max(5, g * .66); }
  return out;
}
function fixedCues(first, gap) { const out = []; for (let t = first; t < S.sceneLen - 4; t += gap) out.push(t); return out; }
const MINI = {
  emo: { label: "רגשות בשלט רחוק", ic: "🎚️", need: 2,
    roles: (p) => `🎭 <b>${esc(p[0])}</b> ו-<b>${esc(p[1])}</b> · כולם רואים את המסך`,
    how: ["מקבלים סצנה פשוטה ומתחילים לשחק.", "המסך נותן לכל אחד רגש, וכל צפצוף מחליף אותו. ממשיכים מאותה נקודה, רק ברגש החדש.", "לקראת הסוף הקצב עולה."],
    topic: () => { const s = drawDeck("set", pool("set")); return { k: "📍 הסצנה", v: s[0], d: s[1] }; },
    cues: () => accelCues(0, S.sceneLen * .3),
    guide: "תנו לרגש לשנות את איך שאתם אומרים, לא את מה שקורה 🎚️",
    card(i, p) {
      if (i > 0 && i % 3 === 2) return { k: "🎚️ רגע משותף", v: drawDeck("emoboth", MM_EMO_BOTH), d: "" };
      const E = kp(MM_EMO), a = drawDeck("emo", E); let b = drawDeck("emo", E); if (b === a) b = drawDeck("emo", E);
      return { k: i === 0 ? "🎚️ הרגש שלכם" : "🎚️ החלפת רגש!", rows: [[p[0], a], [p[1] || "", b]] };
    } },
  line: { label: "משפט מהמסך", ic: "📜", need: 2,
    roles: (p) => `🎭 <b>${p.map(esc).join("</b> ו-<b>")}</b> · כולם רואים את המסך`,
    how: ["משחקים סצנה רגילה.", "פתאום דינג: המסך בוחר שחקן ומשפט שהוא חייב להגיד עכשיו, ולהצדיק אותו בתוך הסיפור.", "לקראת הסוף הדינגים מגיעים מהר יותר."],
    topic: () => { const s = drawDeck("set", pool("set")); return { k: "📍 הסצנה", v: s[0], d: s[1] }; },
    cues: () => accelCues(Math.round(S.sceneLen * .12), S.sceneLen * .28),
    guide: "כשיש דינג: להגיד את המשפט תוך 5 שניות, ולגרום לו להיות הגיוני 📜",
    idle: { k: "📜 משפט מהמסך", v: "חכו לדינג…", d: "" },
    card(i, p) { const who = p[i % p.length]; return { k: `📜 ${who} חייב/ת לומר עכשיו:`, v: "״" + drawDeck("line", kp(MM_LINES)) + "״", d: "", ding: true }; } },
  heads: { label: "שלושה ראשים", ic: "🧠", need: 3,
    roles: (p) => `🧠 <b>${p.map(esc).join("</b>, <b>")}</b> הם מומחה אחד. כל אחד אומר מילה אחת בתורו`,
    how: ["עומדים בשורה, שכם אל שכם. אתם מומחה אחד עם כמה ראשים.", "עונים על השאלה מילה-מילה: כל ראש אומר מילה אחת, בתורו.", "כל כמה שניות המסך מוסיף חוק חדש לתשובה."],
    topic: () => ({ k: "🧠 השאלה למומחה", v: drawDeck("headsq", kp(MM_HEADS_Q)), d: "" }),
    cues: () => fixedCues(20, 20),
    guide: "מילה אחת בכל פעם. לא לתכנן, לבנות על מה שהקודם נתן 🧠",
    idle: { k: "🧠 חוקים", v: "עונים מילה-מילה", d: "חוק חדש יגיע עם צפצוף" },
    card() { return { k: "🧠 חוק חדש!", v: drawDeck("headsr", MM_HEADS_RULES), d: "" }; } },
  dub: { label: "כתוביות", ic: "🎬", need: 3,
    roles: (p) => p.length >= 3
      ? `🙉 <b>${esc(p[0])}</b> ו-<b>${esc(p[1])}</b>: שחקני הסרט, עם הגב למסך, מדברים ג'יבריש<br>🎬 <b>${esc(p[2])}</b>: המתרגם/ת, מול המסך`
      : `🙉 <b>${esc(p[0])}</b>: שחקן/ית הסרט, עם הגב למסך, מדבר/ת ג'יבריש<br>🎬 <b>${esc(p[1])}</b>: המתרגם/ת, מול המסך`,
    how: ["שחקני הסרט מדברים בשפה מומצאת, עם הרבה רגש.", "המתרגם/ת מתרגם/ת לקהל מה הם 'אומרים'.", "כל כמה שניות המסך חושף עובדה חדשה, והמתרגם/ת חייב/ת לגרום לה להיות אמת בסצנה."],
    topic: () => { const s = drawDeck("set", pool("set")); return { k: "📍 הסרט", v: s[0], d: s[1] }; },
    cues: () => fixedCues(10, 22),
    guide: "מתרגם/ת: השחילו את העובדה לתרגום. שחקני הסרט: פשוט תזרמו 🎬",
    idle: { k: "🎬 כתוביות", v: "הסרט מתחיל…", d: "עובדה ראשונה בעוד רגע" },
    card() { return { k: "🎬 האמת החדשה, למתרגם/ת:", v: drawDeck("dub", MM_DUB_FACTS), d: "" }; } },
  expert: { label: "מומחה שלא קיים", ic: "🎓", need: 3, secret: true,
    roles: (p) => `🙉 <b>${esc(p[0])}</b>: המומחה/ית, עם הגב למסך<br>🎤 <b>${p.slice(1).map(esc).join("</b> ו-<b>")}</b>: מראיינים, מול המסך`,
    how: ["המומחה/ית לא יודע/ת במה הוא/היא מומחה/ית. כולם חוץ ממנו/ה רואים.", "המראיינים שואלים שאלות ברצינות גמורה, בלי להגיד את התחום.", "פעמיים המסך נותן רמז, והמראיינים מקריאים אותו בקול. בסוף: מי היית?"],
    topic() { const e = drawDeck("expert", MM_EXPERT); S.mini.expert = e; return { k: "🎓 המומחה/ית הוא/היא… (לא להראות!)", v: e.t, d: "" }; },
    cues: () => [Math.round(S.sceneLen * .45), Math.round(S.sceneLen * .7)],
    guide: "מומחה/ית: דברו בביטחון מלא, גם אם אין לכם מושג 🎓",
    card(i) { const h = S.mini.expert.h[i]; return h ? { k: "💡 רמז! מראיינים, הקריאו בקול:", v: h, d: "" } : null; } }
};
function setupMiniRound(g) {
  const G = MINI[g], ps = activeP(), n = ps.length, st = (S.miniIdx || 0) % n;
  const rot = ps.slice(st).concat(ps.slice(0, st));
  S.mini = { g, perf: rot.slice(0, Math.min(G.need, n)), shown: 0 };
  S.curDir = ""; S.curPerf = S.mini.perf.slice(); S.starter = S.curPerf[0];
  S.mini.topic = G.topic();
  miniRound = true; earRound = false; guessRound = false; guessWin = false; save();
  $("#miniRnum").textContent = "סיבוב " + S.round + " · " + G.label;
  $("#miniTitle").textContent = G.ic + " " + G.label;
  $("#miniRoles").innerHTML = G.roles(S.mini.perf);
  $("#miniHow").innerHTML = G.how.map((t) => `<p>${esc(t)}</p>`).join("");
  renderMiniTopic(); show("miniIntro"); sfx.start();
  speak(`${G.label}! ${S.mini.perf.join(" ו")}, לבמה.`);
}
function renderMiniTopic() {
  const G = MINI[S.mini.g], t = S.mini.topic; miniTopicShown = !G.secret;
  $("#miniTopic").innerHTML = `<div class="scard set minitopic ${G.secret ? "blurred" : ""}" ${G.secret ? 'data-act="miniShowTopic" role="button" tabindex="0"' : ""}>
    <div class="k">${esc(t.k)}</div><div class="v">${esc(t.v)}</div>${t.d ? `<div class="vd">${esc(t.d)}</div>` : ""}
    ${G.secret ? `<div class="tapshow">👆 המומחה/ית עם הגב? לחצו כדי להציג</div>` : ""}</div>`;
}
function miniShowTopic() { const c = $("#miniTopic .minitopic"); if (c) c.classList.remove("blurred"); miniTopicShown = true; }
function miniRedraw() { S.mini.topic = MINI[S.mini.g].topic(); save(); renderMiniTopic(); }
function miniCardHTML(c) {
  const body = c.rows
    ? c.rows.filter((r) => r[0]).map((r) => `<div class="emorow"><span class="who">${esc(r[0])}</span><span class="emo">${esc(r[1])}</span></div>`).join("")
    : `<div class="v">${esc(c.v)}</div>${c.d ? `<div class="vd">${esc(c.d)}</div>` : ""}`;
  return `<div class="k">${esc(c.k)}</div>${body}`;
}
function fireMiniCue(manual) {
  if (!miniRound || !sceneRunning || paused) return;
  const G = MINI[S.mini.g], cues = S.mini.cues;
  if (manual && miniCueIdx >= cues.length) { if (S.mini.g === "expert" || miniExtra >= 4) { toastMsg(S.mini.g === "expert" ? "נגמרו הרמזים 🙂" : "מספיק לסבב אחד 🙂"); return; } miniExtra++; }
  const c = G.card(S.mini.shown, S.mini.perf); if (!c) { toastMsg("נגמרו הרמזים 🙂"); return; }
  S.mini.shown++;
  if (miniCueIdx < cues.length) miniCueIdx++;
  if (manual) { const min = elapsed + 5; for (let i = miniCueIdx; i < cues.length; i++) if (cues[i] < min + (i - miniCueIdx) * 5) cues[i] = min + (i - miniCueIdx) * 5; while (cues.length > miniCueIdx && cues[cues.length - 1] > S.sceneLen - 3) cues.pop(); }
  const card = $("#miniCard"); card.innerHTML = miniCardHTML(c);
  card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop");
  if (c.ding) sfx.bell(); else sfx.hint();
  try { if (navigator.vibrate) navigator.vibrate(90); } catch (e) {}
  save();
}
function miniTick() {
  if (!miniRound) return;
  const cues = S.mini.cues;
  if (miniCueIdx < cues.length && elapsed >= cues[miniCueIdx] && (cues[miniCueIdx] === 0 || S.sceneLen - elapsed > 2)) fireMiniCue(false);
}
function endMini() {
  const G = MINI[S.mini.g];
  if (S.mini.g === "expert") { finishExpert(); return; }
  logRound({ type: "mini", game: S.mini.g, title: S.mini.topic.v, perf: S.mini.perf.slice(), cues: S.mini.shown, secs: Math.min(elapsed, S.sceneLen) });
  miniRound = false;
  sfx.end(); speak(rand(persona().timeup));
  endT = setTimeout(() => { endT = null; if (S.scored) buildScore(); else roundEnd(); }, 700);
}
function finishExpert() {
  $("#miniRevealTitle").textContent = `${S.mini.perf[0]}, להסתובב! מי היית? 🎓`;
  $("#miniRevealCard").classList.add("blurred"); $("#miniRevealVal").textContent = S.mini.expert.t;
  $("#miniRevealBtn").hidden = false; $("#miniVerdict").hidden = true;
  sfx.end(); speak(`נגמר הזמן! ${S.mini.perf[0]}, במה את או אתה מומחה?`);
  show("miniReveal");
}
function miniRevealExpert() { $("#miniRevealCard").classList.remove("blurred"); $("#miniRevealBtn").hidden = true; $("#miniVerdict").hidden = false; sfx.bell(); }
function miniExpertDone(win) {
  if (!miniRound || currentScreen !== "miniReveal") return;
  const ex = S.mini.perf[0];
  if (win) { miniConfetti(); sfx.bell(); if (S.scored) S.scores[ex] = (S.scores[ex] || 0) + 2; }
  logRound({ type: "mini", game: "expert", title: S.mini.expert.t, perf: S.mini.perf.slice(), win: !!win, secs: Math.min(elapsed, S.sceneLen) });
  miniRound = false; advanceRound();
  if (S.scored) showBoard(`סיבוב ${S.round} הסתיים`); else roundEnd2();
}
function miniLogLine(r) {
  const G = MINI[r.game] || { ic: "🎲", label: r.game };
  return `${G.ic} ${G.label}: ${r.title}` + (r.game === "expert" ? ` · ${r.perf[0]} ${r.win ? "ניחש/ה" : "לא ניחש/ה"}` : ` · ${r.perf.join(" ו־")}`);
}

/* ---------- סיבוב ניחוש ---------- */
function setupGuessRound() {
  const g = drawDeck("guess", MM_GUESS); const secret = drawDeck("guess_s:" + g.t, g.s);
  const ps = activeP();
  S.guesser = ps[S.guessIdx % ps.length];
  S.curDir = ""; S.curPerf = ps.filter((p) => p !== S.guesser); if (S.curPerf.length) S.starter = S.curPerf[0];
  S.guess = { t: g.t, d: g.d, k: g.k, secret }; guessRound = true; guessWin = false; save();
  $("#guessRnum").textContent = "סיבוב " + S.round + " · ניחוש";
  $("#guessTitle").textContent = g.t; $("#guessGuesser").textContent = S.guesser;
  $("#secretKind").textContent = "🕵️ " + g.k; $("#secretVal").textContent = secret; $("#secretDesc").textContent = g.d;
  $("#secretCard").classList.add("blurred");
  show("guessIntro"); sfx.start();
  speak(`סיבוב ניחוש! ${S.guesser}, בלי להסתכל על המסך! כל השאר — תציצו בסוד.`);
}
(function secretHold() {
  const sc = $("#secretCard"); let holdT = null;
  const hide = () => { clearTimeout(holdT); sc.classList.add("blurred"); };
  sc.addEventListener("contextmenu", (e) => e.preventDefault());
  sc.addEventListener("pointerdown", (e) => { if (!e.isPrimary || (e.pointerType === "mouse" && e.button !== 0)) return; e.preventDefault(); holdT = setTimeout(() => sc.classList.remove("blurred"), 280); });
  ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => sc.addEventListener(ev, hide));
  sc.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); sc.classList.remove("blurred"); } });
  sc.addEventListener("keyup", hide); sc.addEventListener("blur", hide);
})();
function guessSuccess() { guessWin = true; endScene(); }
function finishGuess(win) {
  $("#guessEmoji").textContent = win ? "🎯" : "⏱️";
  $("#guessResult").textContent = win ? `${S.guesser} ניחש/ה נכון!` : "הזמן נגמר!";
  $("#guessResultSub").textContent = `הסוד היה: ${S.guess.secret}` + (win ? "" : " — אולי בפעם הבאה 😅");
  if (win) { sfx.bell(); miniConfetti(); speak(`${S.guesser} ניחש/ה נכון! כל הכבוד!`); if (S.scored) S.scores[S.guesser] = (S.scores[S.guesser] || 0) + 2; }
  else { sfx.end(); speak(`נגמר הזמן! הסוד היה: ${S.guess.secret}`); }
  hinterPick = null;
  const hp = $("#hinterPanel"); hp.hidden = !S.scored;
  if (S.scored) $("#hinterGrid").innerHTML = activeP().filter((p) => p !== S.guesser).map((p) => `<button data-hn="${esc(p)}">${esc(p)}</button>`).join("");
  logRound({ type: "guess", title: S.guess.t, secret: S.guess.secret, guesser: S.guesser, win });
  show("guessScore");
}
function applyGuessScore() {
  if (currentScreen !== "guessScore") return;
  if (S.scored && hinterPick) { S.scores[hinterPick] = (S.scores[hinterPick] || 0) + 1; S.honors[hinterPick] = (S.honors[hinterPick] || 0) + 1; }
  guessRound = false; hinterPick = null; advanceRound();
  if (S.scored) showBoard(`סיבוב ${S.round} הסתיים`);
  else roundEnd2();
}

/* ---------- ספירה לאחור → סצנה ---------- */
let countdownRunning = false, countIv = null;
function beginCountdown() {
  if (countdownRunning || sceneRunning) return; countdownRunning = true;
  ac(); let n = 3; const ov = $("#count"), el = $("#countN");
  ov.classList.add("go"); el.textContent = n; el.classList.add("pop"); sfx.count(); speak("שלוש");
  countIv = setInterval(() => {
    n--; el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
    if (n > 0) { el.textContent = n; sfx.count(); speak(n === 2 ? "שתיים" : "אחת"); }
    else { el.textContent = "אקשן!"; sfx.start(); speak("אקשן!"); clearInterval(countIv); countIv = null; setTimeout(() => { ov.classList.remove("go"); countdownRunning = false; startScene(); }, 700); }
  }, 1000);
}

/* ---------- הסצנה ---------- */
let endT = null, timer = null, swapT = null, topicAutoT = null, elapsed = 0, sceneStart = 0, sceneRunning = false, paused = false, pausedAt = 0;
let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && "wakeLock" in navigator) { if (wakeLock) return; wakeLock = await navigator.wakeLock.request("screen"); wakeLock.addEventListener("release", () => { wakeLock = null; }); }
    else if (!on && wakeLock) { const w = wakeLock; wakeLock = null; await w.release(); }
  } catch (e) {}
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  if (gameActive) keepAwake(true);
  if (sceneRunning && !paused) { elapsed = Math.round((Date.now() - sceneStart) / 1000); updateClock(); if (elapsed >= S.sceneLen) endScene(); }
});
function pushGameState() { try { if (!history.state || !history.state.mm) history.pushState({ mm: 1 }, ""); } catch (e) {} }
window.addEventListener("popstate", () => { if (gameActive && currentScreen !== "home") { pushGameState(); confirmHome(); } });
const KEYHINT_DEFAULT = "מקלדת: רווח = החלפה · T = נושא · H = רמז · P = השהיה · E = סיום";
function setKeyHint() {
  const el = $("#keyHint"); if (!el) return;
  el.textContent = miniRound ? "מקלדת: רווח = הבא עכשיו · P = השהיה · E = סיום"
    : earRound ? "מקלדת: רווח = משימה הבאה · P = השהיה · E = סיום"
    : guessRound ? "מקלדת: " + (S.settings.hints ? "H = רמז · " : "") + "P = השהיה · E = סיום" : KEYHINT_DEFAULT;
}
function startScene() {
  pushGameState();
  elapsed = 0; sceneStart = Date.now(); S.rings = 0; S.topics = 0; sceneRunning = true; paused = false; setPausedUI(false);
  if (miniRound) {
    const G = MINI[S.mini.g], t = S.mini.topic;
    S.miniIdx = (S.miniIdx || 0) + 1; S.mini.shown = 0; S.mini.cues = G.cues(); miniCueIdx = 0; miniExtra = 0;
    $("#playCards").innerHTML =
      `<div class="scard set"><div class="k">${esc(t.k.replace(" (לא להראות!)", ""))}</div><div class="v">${esc(t.v)}</div>${t.d ? `<div class="vd">${esc(t.d)}</div>` : ""}</div>` +
      `<div class="earmission minicard" id="miniCard">${G.idle ? miniCardHTML(G.idle) : ""}</div>`;
    $("#playPerf").innerHTML = G.roles(S.mini.perf);
    $("#guide").textContent = G.guide;
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = true; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = false;
    $("#miniNextBtn").textContent = S.mini.g === "expert" ? "💡 רמז עכשיו" : "⏭️ הבא עכשיו";
  } else if (earRound) {
    S.earIdx = (S.earIdx || 0) + 1; S.ear.missions = []; earNextAt = 0;
    $("#playCards").innerHTML =
      `<div class="scard set"><div class="k">📍 הסצנה</div><div class="v">${esc(S.set[0])}</div><div class="vd">${esc(S.set[1])}</div></div>` +
      `<div class="earmission" id="earMission"><div class="k">🎧 משימה סודית <span id="earNum">1</span></div><div class="v" id="earTitle"></div><div class="vd" id="earDesc"></div></div>`;
    $("#playPerf").innerHTML = `🙉 <b>${esc(S.earListener)}</b> עם הגב · 🎧 <b>${esc(S.earAgent)}</b> הסוכן/ת`;
    $("#guide").textContent = "סוכן/ת: שלבו את המשימה בשיחה בלי שיעלו עליכם! קהל: שקט, לא מסגירים 🤫";
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = true; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = false; $("#miniCtrl").hidden = true;
  } else if (guessRound) {
    S.guessIdx++; save();
    $("#playCards").innerHTML = `<div class="scard guess"><div class="k">🕵️ ניחוש · ${esc(S.guess.k)}</div><div class="v">${esc(S.guess.t)}</div><div class="vd">${esc(S.guess.d)}</div></div>`;
    $("#playPerf").innerHTML = `<b>${esc(S.guesser)}</b> מנחש/ת · כל השאר רומזים`;
    $("#guide").textContent = "רומזים חופשי — רק אסור להגיד את הסוד!";
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = true; $("#guessCtrl").hidden = false; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = true;
  } else {
    $("#playCards").innerHTML =
      `<div class="scard set"><div class="k">📍 במה</div><div class="v">${esc(S.set[0])}</div><div class="vd">${esc(S.set[1])}</div></div>` +
      `<div class="scard ${S.conCat}"><div class="k">${MM_CAT[S.conCat].ic} ${MM_CAT[S.conCat].label}</div><div class="v">${esc(S.con[0])}</div><div class="vd">${esc(S.con[1])}</div></div>`;
    $("#playPerf").textContent = S.curPerf.join("  •  ");
    $("#guide").textContent = S.mode === "manual" ? "במאי/ת: כשזה נהיה צפוי — לחצו 🔔 החלפה!" : "המנחה מוביל — הקשיבו ל\"החלפה!\" ול\"נושא חדש\"";
    $("#manualCtrl").hidden = S.mode !== "manual"; $("#autoCtrl").hidden = S.mode !== "auto"; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = true;
  }
  $("#ringcount").textContent = ""; $("#playBadge").hidden = licActive();
  updateClock(); setKeyHint(); show("play"); sfx.start(); keepAwake(true);
  if (timer) clearInterval(timer); timer = setInterval(tick, 1000);
  if (earRound) earNext(false);
  if (miniRound) miniTick();
  if (S.mode === "auto" && !guessRound && !earRound && !miniRound) { scheduleAutoSwap(); scheduleAutoTopic(); }
}
function updateClock() {
  const left = Math.max(0, S.sceneLen - elapsed); const clk = $("#clock"); clk.textContent = left;
  const frac = left / S.sceneLen; const fill = $("#timefill"); fill.style.width = (frac * 100) + "%";
  const col = frac > .5 ? "var(--ok)" : frac > .2 ? "var(--guess)" : "var(--change)"; fill.style.background = col;
  const rt = $("#ringtimer"); rt.style.setProperty("--p", frac); rt.style.setProperty("--tcol", col);
  const warn = left <= 10 && left > 0 && !paused; rt.classList.toggle("warn", warn); clk.classList.toggle("warn", warn);
}
function tick() {
  if (!sceneRunning || paused) return;
  elapsed = Math.round((Date.now() - sceneStart) / 1000); updateClock();
  const left = S.sceneLen - elapsed; if (left <= 5 && left > 0) sfx.tick();
  miniTick();
  if (earRound && elapsed >= earNextAt && S.ear.missions.length < earCount() && left > 8) earNext(true);
  if (elapsed >= S.sceneLen) endScene();
}
function nextGap() {
  const frac = elapsed / S.sceneLen, easy = S.level === "easy" || S.kids;
  if (frac < .78) { const base = (easy ? 16 : 13) - (frac / .78) * (easy ? 8 : 7); return Math.max(easy ? 6 : 4, base + (Math.random() * 4 - 2)); }
  return (easy ? 3.5 : 2.5) + Math.random() * 2;
}
function scheduleAutoSwap() {
  if (!sceneRunning || paused || S.mode !== "auto" || guessRound || earRound || miniRound) return;
  const startQuiet = S.sceneLen * ((S.level === "easy" || S.kids) ? .33 : .22);
  const delay = elapsed < startQuiet ? (startQuiet - elapsed) + Math.random() * 2 : nextGap();
  if (swapT) clearTimeout(swapT);
  swapT = setTimeout(() => { if (!sceneRunning || paused) return; if (S.sceneLen - elapsed <= 1) return; doSwap(); scheduleAutoSwap(); }, delay * 1000);
}
function scheduleAutoTopic() {
  if (!sceneRunning || paused || S.mode !== "auto" || guessRound || earRound || miniRound) return;
  const first = S.sceneLen * .45 + (Math.random() * 6 - 3);
  if (topicAutoT) clearTimeout(topicAutoT);
  topicAutoT = setTimeout(function fire() {
    if (!sceneRunning || paused) return;
    if (S.sceneLen - elapsed > 8) throwTopic();
    if (S.sceneLen - elapsed > 20) topicAutoT = setTimeout(fire, (18 + Math.random() * 8) * 1000);
  }, Math.max(2, first - elapsed) * 1000);
}
function manualSwap() { doSwap(); }
function doSwap() {
  if (!sceneRunning || paused) return; S.rings++; bumpStat("swaps");
  $("#flashTxt").textContent = "החלפה!"; $("#ringcount").textContent = `🔔 החלפות בסיבוב: ${S.rings}`;
  flashSwap(false); sfx.swap(); speak(rand(persona().swap));
}
function freeze() {
  if (!sceneRunning || paused) return; $("#flashTxt").textContent = "פריז!"; flashSwap(true); sfx.freeze();
  speak("פריז! החליפו שחקן ופתחו סצנה חדשה מאותה תנוחה!");
}
function flashSwap(isFreeze) {
  const bg = $("#flashbg"), fl = $("#flash"), app = $(".app");
  bg.classList.remove("go"); fl.classList.remove("go"); void bg.offsetWidth;
  bg.style.background = isFreeze ? "var(--lang)" : "var(--change)"; bg.classList.add("go"); fl.classList.add("go");
  if (S.settings.motion) { app.classList.remove("is-shaking"); void app.offsetWidth; app.classList.add("is-shaking"); }
  setTimeout(() => { bg.classList.remove("go"); fl.classList.remove("go"); app.classList.remove("is-shaking"); }, 620);
}
function setPausedUI(on) {
  $("#pausedBanner").classList.toggle("on", on); $("#ringtimer").classList.toggle("paused", on); $("#clock").classList.toggle("paused", on);
  $$('[data-role="pause"]').forEach((b) => b.textContent = on ? "▶️ המשך" : "⏸️ השהה");
}
function togglePause() {
  if (!sceneRunning) return;
  if (!paused) {
    paused = true; pausedAt = Date.now(); if (swapT) clearTimeout(swapT); if (topicAutoT) clearTimeout(topicAutoT);
    try { speechSynthesis.cancel(); } catch (e) {} setPausedUI(true); updateClock();
  } else {
    sceneStart += Date.now() - pausedAt; paused = false; setPausedUI(false); tick();
    if (S.mode === "auto" && !guessRound && !earRound && !miniRound) { scheduleAutoSwap(); scheduleAutoTopic(); }
  }
}
function stopSceneTimers() { if (timer) clearInterval(timer); if (swapT) clearTimeout(swapT); if (topicAutoT) clearTimeout(topicAutoT); if (endT) clearTimeout(endT); timer = swapT = topicAutoT = endT = null; }
function endScene() {
  if (!sceneRunning) return;
  sceneRunning = false; paused = false; setPausedUI(false); stopSceneTimers();
  hideHint(); hideTopic(); $("#timefill").style.width = "0%";
  if (miniRound) { endMini(); return; }
  if (earRound) { finishEar(); return; }
  if (guessRound) { finishGuess(guessWin); return; }
  logRound({ type: "scene", set: S.set[0], con: S.con[0], conCat: S.conCat, perf: S.curPerf.slice(), swaps: S.rings, topics: S.topics, secs: Math.min(elapsed, S.sceneLen) });
  sfx.end(); speak(rand(persona().timeup));
  endT = setTimeout(() => { endT = null; if (S.scored) buildScore(); else roundEnd(); }, 700);
}
function logRound(entry) { S.log.push({ n: S.round, ...entry }); bumpStat("rounds"); save(); }

/* ---------- ניקוד ---------- */
let scoreState = {};
function buildScore() {
  const body = $("#scoreBody");
  if (S.mode === "manual") {
    $("#scoreSub").textContent = "הבמאי מחלק אסימונים — עד 3 לכל מאלתר."; scoreState = {};
    body.innerHTML = S.curPerf.map((p, pi) => { scoreState[p] = { yes: false, loyal: false, pivot: false };
      return `<div class="scorer"><div class="nm">${esc(p)}</div><div class="crit" data-player="${pi}">
        <button data-c="yes">כן, ו...<small>זרם, לא חסם</small></button>
        <button data-c="loyal">נאמנות לאילוץ<small>שמר על החוק</small></button>
        <button data-c="pivot">הפניית פרסה<small>הגיב מהר להחלפה</small></button></div></div>`; }).join("");
  } else {
    $("#scoreSub").textContent = "מי הגיב הכי מהר לאילוצים? תנו כבוד (אפשר לדלג)."; scoreState = { honor: null };
    body.innerHTML = `<div class="honor" id="honorGrid">` + S.curPerf.map((p) => `<button data-hn="${esc(p)}">${esc(p)}</button>`).join("") + `</div>`;
  }
  show("score");
}
function applyScore() {
  if (currentScreen !== "score") return;
  if (S.mode === "manual") S.curPerf.forEach((p) => { const s = scoreState[p] || {}; const a = (s.yes ? 1 : 0) + (s.loyal ? 1 : 0) + (s.pivot ? 1 : 0); S.scores[p] = (S.scores[p] || 0) + a; });
  else if (scoreState.honor) { S.scores[scoreState.honor] = (S.scores[scoreState.honor] || 0) + 1; S.honors[scoreState.honor] = (S.honors[scoreState.honor] || 0) + 1; }
  advanceRound();
  const allDir = S.mode === "manual" && activeP().every((p) => (S.dirCounts[p] || 0) >= 2);
  showBoard(allDir ? "כולם היו במאי פעמיים!" : `סיבוב ${S.round} הסתיים`);
}
function showBoard(sub) {
  if (trialGate()) return;
  renderBoard(); const top = Math.max(0, ...Object.values(S.scores));
  $("#boardSub").textContent = top >= WIN_TOKENS ? `מישהו הגיע ל-${WIN_TOKENS}!` : sub;
  $("#declareWinBtn").hidden = !(top >= WIN_TOKENS); show("scoreboard");
}
function trialGate() {
  if (!S.trialRound) return false;
  if (licActive()) { S.trialRound = false; save(); return false; }
  S.trialRound = false; S.teamTrialUsed = true; save(); renderLicBoxes(); show("offer"); return true;
}
function roundEnd2() { if (trialGate()) return; $("#roundendSub").textContent = `סיבוב ${S.round} הסתיים · מוכנים לעוד?`; show("roundend"); miniConfetti(); }
function roundEnd() { advanceRound(); if (trialGate()) return; $("#roundendSub").textContent = `סיבוב ${S.round} הסתיים · מוכנים לעוד?`; show("roundend"); miniConfetti(); }
function continueFree() { S.team = false; S.industry = ""; save(); if (S.scored) showBoard(`סיבוב ${S.round} הסתיים`); else { $("#roundendSub").textContent = `סיבוב ${S.round} הסתיים · מוכנים לעוד?`; show("roundend"); } }
function advanceRound() { if (S.curDir) S.dirCounts[S.curDir] = (S.dirCounts[S.curDir] || 0) + 1; S.directorIdx = (S.directorIdx + 1) % activeP().length; save(); }
function renderBoard() {
  const arr = activeP().map((p) => ({ p, t: S.scores[p] || 0 })).sort((a, b) => b.t - a.t); const max = arr.length ? arr[0].t : 0;
  $("#board").innerHTML = arr.map((r, i) => `<div class="brow ${r.t === max && max > 0 ? "lead" : ""}" style="animation:fade .45s ease ${i * .07}s both">
    <div class="rank">${i + 1}</div><div class="bn">${esc(r.p)}</div><div class="tok">${r.t}</div></div>`).join("");
}

/* ---------- סיום ---------- */
function endGameNow() { if (S.team) { renderDebrief(); show("debrief"); } else finalEnd(); }
function finalEnd() {
  gameActive = false; S.inGame = false; save(); keepAwake(false); renderLicBoxes();
  if (S.scored) declareWinner();
  else { $("#partyendSub").textContent = `${S.round} סיבובים של צחוק${S.company ? " עם " + S.company : ""}. עד הפעם הבאה!`; show("partyend"); bigConfetti(); sfx.bell(); }
}
function renderDebrief() {
  const picks = shuffleCopy(MM_DEBRIEF).slice(0, 3);
  $("#debriefBody").innerHTML = picks.map((d) => `<div class="scorer"><div class="nm" style="font-size:clamp(17px,2.4vmin,22px);color:var(--spot)">${esc(d.theme)}</div><div class="debq">` +
    d.qs.map((q) => `<button data-act="pickDebrief" data-q="${esc(q)}" class="${S.debriefPicked.includes(q) ? "on" : ""}">${esc(q)}</button>`).join("") + `</div></div>`).join("");
}
function pickDebrief(q, btn) {
  const i = S.debriefPicked.indexOf(q); if (i >= 0) S.debriefPicked.splice(i, 1); else S.debriefPicked.push(q);
  btn.classList.toggle("on", i < 0); save();
}
function declareWinner() {
  gameActive = false; S.inGame = false; save(); keepAwake(false);
  const arr = activeP().map((p) => ({ p, t: S.scores[p] || 0 })).sort((a, b) => b.t - a.t);
  const top = arr.length ? arr[0].t : 0; const winners = arr.filter((r) => r.t === top).map((r) => r.p);
  const names = winners.join(" ו־"), tie = winners.length > 1;
  $("#winName").textContent = arr.length ? names : "—";
  $("#winSub").textContent = arr.length ? (tie ? `תיקו! עם ${top} אסימונים כל אחד` : `עם ${top} אסימונים`) : "";
  show("winner"); bigConfetti(); sfx.bell(); setTimeout(sfx.bell, 250);
  speak(arr.length ? (tie ? `${names} מנצחים! כל הכבוד!` : `${names} מנצח/ת! כל הכבוד!`) : "");
}
function spawnConfetti(n) {
  if (!S.settings.motion) return; const c = $("#confetti"); const cols = ["#e23149", "#ff5066", "#f6e7b4", "#8c2fc9", "#1786a6", "#2c9e5b", "#e08a1e"];
  c.innerHTML = "";
  for (let i = 0; i < n; i++) { const s = document.createElement("i"); s.style.left = Math.random() * 100 + "vw"; s.style.background = cols[i % cols.length];
    s.style.animationDuration = (2.4 + Math.random() * 1.8) + "s"; s.style.animationDelay = (Math.random() * .6) + "s";
    s.style.setProperty("--rot", (Math.random() * 900 - 200) + "deg"); s.style.setProperty("--dx", (Math.random() * 36 - 18) + "vw"); c.appendChild(s); }
  setTimeout(() => { c.innerHTML = ""; }, 6500);
}
function miniConfetti() { spawnConfetti(36); }
function bigConfetti() { spawnConfetti(80); }
function newGame() { gameActive = false; S.inGame = false; save(); keepAwake(false); $("#confetti").innerHTML = ""; goSetup(); }
function canResume() { return !!(S.inGame && S.round > 0 && activeP().length >= 2); }
function resumeGame() {
  if (!canResume()) { $("#resumeBtn").hidden = true; return; }
  gameActive = true; keepAwake(true); guessRound = false; guessWin = false; earRound = false; miniRound = false; ac();
  S.round = S.log.length; save();
  renderBoard(); const top = Math.max(0, ...Object.values(S.scores || {}));
  $("#boardSub").textContent = "ממשיכים משחק · " + S.round + " סיבובים שוחקו";
  $("#declareWinBtn").hidden = !(S.scored && top >= WIN_TOKENS); show("scoreboard");
}
async function confirmHome() {
  const ok = await dialog({ title: "לצאת למסך הבית?", text: "המשחק נשמר במכשיר — תוכלו ללחוץ 'המשך משחק' ולחזור ללוח.", okText: "כן, למסך הבית", cancelText: "להישאר", danger: true });
  if (!ok) return;
  if (sceneRunning) { sceneRunning = false; paused = false; stopSceneTimers(); hideHint(); hideTopic(); }
  countdownRunning = false; if (countIv) { clearInterval(countIv); countIv = null; } $("#count").classList.remove("go"); $("#count .n").classList.remove("pop");
  try { speechSynthesis.cancel(); } catch (e) {}
  gameActive = false; keepAwake(false); save();
  $("#resumeBtn").hidden = !canResume(); show("home");
}

/* ---------- סיכום מפגש ---------- */
function summaryData() {
  const scenes = S.log.filter((r) => r.type === "scene"), guesses = S.log.filter((r) => r.type === "guess");
  const swaps = scenes.reduce((a, r) => a + (r.swaps || 0), 0), topics = scenes.reduce((a, r) => a + (r.topics || 0), 0);
  const secs = S.log.filter((r) => r.type === "scene" || r.type === "ear" || r.type === "mini").reduce((a, r) => a + (r.secs || 0), 0);
  const ps = activeP();
  const board = ps.map((p) => ({ p, t: S.scores[p] || 0 })).sort((a, b) => b.t - a.t);
  const honors = ps.map((p) => ({ p, h: S.honors[p] || 0 })).filter((x) => x.h > 0).sort((a, b) => b.h - a.h);
  const d = new Date(S.startedAt || Date.now());
  const date = d.toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" });
  return { scenes, guesses, swaps, topics, mins: Math.max(1, Math.round(secs / 60)), ps, board, honors, date };
}
function showSummary() {
  const d = summaryData();
  $("#summarySub").textContent = (S.company ? S.company + " · " : "") + d.date + (S.team ? " · מצב צוות" : "");
  $("#summaryStats").innerHTML = [
    [S.log.length, "סיבובים"], [d.ps.length, "משתתפים"], [d.swaps, "החלפות"], [d.topics, "טוויסטים"], [d.mins, "דקות על הבמה"]
  ].map(([n, l]) => `<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join("");
  let html = `<div class="sumlist"><h4>👥 מי שיחק</h4><p>${d.ps.map(esc).join(" · ")}</p></div>`;
  if (S.scored && d.board.length) html += `<div class="sumlist"><h4>🏆 לוח תוצאות</h4>${d.board.map((r, i) => `<p>${i + 1}. ${esc(r.p)} — ${r.t} אסימונים</p>`).join("")}</div>`;
  if (d.honors.length) html += `<div class="sumlist"><h4>⭐ כבוד מהחבר'ה</h4><p>${d.honors.map((h) => `${esc(h.p)} (${h.h})`).join(" · ")}</p></div>`;
  if (S.log.length) html += `<div class="sumlist"><h4>🎬 הסיבובים</h4>` + S.log.map((r) => r.type === "mini"
    ? `<div class="rnd"><span class="i">${r.n}</span><span class="w">${esc(miniLogLine(r))}</span></div>`
    : r.type === "ear"
    ? `<div class="rnd"><span class="i">${r.n}</span><span class="w">🎧 האוזניה: ${esc(r.agent)} הסוכן/ת, ${esc(r.listener)} תפס/ה ${r.caught} מתוך ${r.missions.length} <small>(${r.missions.map(esc).join(" · ")})</small></span></div>`
    : r.type === "guess"
    ? `<div class="rnd"><span class="i">${r.n}</span><span class="w">🕵️ ${esc(r.title)} — ${esc(r.guesser)} ${r.win ? "ניחש/ה נכון" : "לא ניחש/ה"} <small>(${esc(r.secret)})</small></span></div>`
    : `<div class="rnd"><span class="i">${r.n}</span><span class="w">${esc(r.set)} · ${MM_CAT[r.conCat]?.ic || ""} ${esc(r.con)} <small>— ${r.perf.map(esc).join(" ו־")} · ${r.swaps} החלפות</small></span></div>`).join("") + `</div>`;
  if (S.team) html += `<div class="sumlist"><h4>💬 שאלות התחקיר שדיברתם עליהן</h4>${S.debriefPicked.length ? S.debriefPicked.map((q) => `<p>• ${esc(q)}</p>`).join("") : `<p class="muted">לא סומנו שאלות.</p>`}</div>`;
  $("#summaryBody").innerHTML = html; $("#confetti").innerHTML = ""; renderLicBoxes(); show("summary");
}
function summaryText() {
  const d = summaryData(); const L = [];
  L.push(`🎭 מהמותן — סיכום מפגש${S.company ? " · " + S.company : ""}`); L.push(d.date); L.push("");
  L.push(`${S.log.length} סיבובים · ${d.ps.length} משתתפים · ${d.swaps} החלפות · ${d.topics} טוויסטים · ~${d.mins} דקות על הבמה`);
  L.push(`משתתפים: ${d.ps.join(", ")}`); L.push("");
  if (S.scored) { L.push("🏆 תוצאות:"); d.board.forEach((r, i) => L.push(`${i + 1}. ${r.p} — ${r.t}`)); L.push(""); }
  if (d.honors.length) { L.push("⭐ כבוד: " + d.honors.map((h) => `${h.p} (${h.h})`).join(", ")); L.push(""); }
  L.push("🎬 סיבובים:");
  S.log.forEach((r) => L.push(r.type === "mini" ? `${r.n}. ${miniLogLine(r)}` : r.type === "ear" ? `${r.n}. האוזניה: ${r.agent} הסוכן/ת, ${r.listener} תפס/ה ${r.caught} מתוך ${r.missions.length}` : r.type === "guess" ? `${r.n}. ניחוש "${r.title}" — ${r.guesser} ${r.win ? "ניחש/ה נכון" : "לא ניחש/ה"}` : `${r.n}. ${r.set} + ${r.con} — ${r.perf.join(" ו־")} (${r.swaps} החלפות)`));
  if (S.team) { L.push(""); L.push("💬 תחקיר — דיברנו על:"); (S.debriefPicked.length ? S.debriefPicked : ["(לא סומנו שאלות)"]).forEach((q) => L.push("• " + q)); }
  L.push(""); L.push(licActive() ? "מהמותן · מצב צוות" : "מופעל על ידי מהמותן · " + SITE_URL.replace("https://", ""));
  return L.join("\n");
}
async function copySummary() {
  const txt = summaryText(); let ok = false;
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(txt); ok = true; } } catch (e) {}
  if (ok) toastMsg("הסיכום הועתק — הדביקו במייל או בוואטסאפ");
  else { await dialog({ title: "העתיקו את הסיכום", text: "סמנו הכול והעתיקו:", input: " ", value: txt, okText: "סגור", cancelText: "" }); }
}
async function shareSummary() {
  const txt = summaryText();
  if (navigator.share) { try { await navigator.share({ title: "מהמותן — סיכום מפגש", text: txt }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  copySummary();
}

/* ---------- לוגו ארגון (רישיון בלבד, נשמר במכשיר) ---------- */
let LOGO = null;
function loadLogo() { const l = lsGet(LOGO_KEY, null); LOGO = typeof l === "string" && l.startsWith("data:image/") ? l : null; }
function renderLogo() {
  const has = licActive() && LOGO;
  $$('[data-role="orglogo"]').forEach((el) => { el.hidden = !has; if (has) el.src = LOGO; });
  const w = $("#logoWrap"); if (w) { w.hidden = !licActive(); const p = $("#logoPreview"); if (p) { p.hidden = !LOGO; if (LOGO) p.src = LOGO; } const rm = $("#logoRemoveBtn"); if (rm) rm.hidden = !LOGO; }
}
function pickLogo() { const inp = $("#logoFile"); if (inp) { inp.value = ""; inp.click(); } }
function onLogoFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const img = new Image(); const url = URL.createObjectURL(file);
  img.onload = () => {
    if (!img.width || !img.height) { URL.revokeObjectURL(url); toastMsg("לא הצלחנו לקרוא את התמונה — נסו PNG או JPG"); return; }
    const max = 320, r = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    try { const d = c.toDataURL("image/png"); LOGO = d.startsWith("data:image/") && d.length < 400000 ? d : null; if (LOGO) lsSet(LOGO_KEY, LOGO); else toastMsg("התמונה גדולה מדי או לא נתמכת"); } catch (e) { LOGO = null; }
    renderLogo(); toastMsg("הלוגו נשמר במכשיר");
  };
  img.onerror = () => { URL.revokeObjectURL(url); toastMsg("לא הצלחנו לקרוא את התמונה"); };
  img.src = url;
}
function removeLogo() { LOGO = null; try { localStorage.removeItem(LOGO_KEY); } catch (e) {} renderLogo(); }

/* ---------- כרטיס שיתוף כתמונה (Canvas → PNG → Web Share / הורדה) ---------- */
async function shareImage() {
  const btn = $('[data-act="shareImage"]'); if (btn) btn.disabled = true;
  try {
    try { await Promise.all([document.fonts.load("60px 'Secular One'"), document.fonts.load("700 30px 'Heebo'"), document.fonts.load("500 30px 'Heebo'"), document.fonts.load("500 24px 'Rubik'")]); } catch (e) {}
    const d = summaryData(); const W = 1080, H = 1350;
    const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
    x.direction = "rtl"; x.textAlign = "right";
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1e1729"); bg.addColorStop(1, "#100c17"); x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const g1 = x.createRadialGradient(W * .5, H * 1.05, 40, W * .5, H * 1.05, 700); g1.addColorStop(0, "rgba(226,49,73,.28)"); g1.addColorStop(1, "rgba(226,49,73,0)"); x.fillStyle = g1; x.fillRect(0, 0, W, H);
    const g2 = x.createRadialGradient(W * .5, -80, 40, W * .5, -80, 760); g2.addColorStop(0, "rgba(246,231,180,.22)"); g2.addColorStop(1, "rgba(246,231,180,0)"); x.fillStyle = g2; x.fillRect(0, 0, W, H);
    const R = W - 90; let y = 130;
    x.fillStyle = "#f6e7b4"; x.font = "500 26px Rubik, Heebo, sans-serif"; x.fillText("סיכום מפגש · " + d.date, R, y);
    y += 92; x.fillStyle = "#ffffff"; x.font = "400 96px 'Secular One', Heebo, sans-serif"; x.fillText("מהמותן", R, y);
    x.fillStyle = "#e23149"; x.fillText(".", R - x.measureText("מהמותן").width, y);
    if (S.company) { y += 62; x.fillStyle = "#e9e3d4"; x.font = "700 40px Heebo, sans-serif"; x.fillText(S.company, R, y); }
    if (licActive() && LOGO) { try { const im = new Image(); im.src = LOGO; await im.decode(); const s0 = Math.min(160 / im.width, 110 / im.height, 1); x.drawImage(im, 90, 70, im.width * s0, im.height * s0); } catch (e) {} }
    y += 70;
    const stats = [[S.log.length, "סיבובים"], [d.ps.length, "משתתפים"], [d.swaps, "החלפות"], [d.mins, "דקות"]];
    const bw = (W - 90 * 2 - 24 * 3) / 4;
    stats.forEach(([n, l], i) => { const bx = W - 90 - (i + 1) * bw - i * 24; roundRect(x, bx, y, bw, 150, 26); x.fillStyle = "rgba(255,255,255,.06)"; x.fill(); x.strokeStyle = "rgba(255,255,255,.14)"; x.lineWidth = 2; x.stroke();
      x.textAlign = "center"; x.fillStyle = "#f6e7b4"; x.font = "400 66px 'Secular One', Heebo, sans-serif"; x.fillText(String(n), bx + bw / 2, y + 82);
      x.fillStyle = "#b3acc4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText(l, bx + bw / 2, y + 126); x.textAlign = "right"; });
    y += 150 + 64;
    x.fillStyle = "#f6e7b4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText("על הבמה", R, y); y += 48;
    x.fillStyle = "#ffffff"; x.font = "700 34px Heebo, sans-serif"; const nl = wrapText(x, d.ps.join("  ·  "), R, y, W - 180, 46, 3); y += 46 * nl + 40;
    if (S.scored && d.board.length && y < H - 420) { x.fillStyle = "#f6e7b4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText("לוח תוצאות", R, y); y += 50;
      d.board.slice(0, 3).forEach((r, i) => { x.fillStyle = i === 0 ? "#f6e7b4" : "#e9e3d4"; x.font = (i === 0 ? "400 44px 'Secular One'" : "700 34px Heebo") + ", Heebo, sans-serif"; x.fillText(`${["🥇", "🥈", "🥉"][i]} ${r.p}  ${r.t}`, R, y); y += i === 0 ? 58 : 48; }); y += 20; }
    const last = S.log.filter((r) => r.type === "scene").slice(-3);
    if (last.length && y < H - 360) { x.fillStyle = "#f6e7b4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText("רגעים מהמפגש", R, y); y += 48;
      last.forEach((r) => { if (y > H - 230) return; x.fillStyle = "#e9e3d4"; x.font = "500 30px Heebo, sans-serif"; x.fillText(fitText(x, `${r.set} · ${r.con}`, W - 320), R, y); y += 44; }); }
    // תחתית: כוכב + החלפה!
    x.save(); x.translate(150, H - 150); x.rotate(-0.2); x.fillStyle = "#e23149"; star(x, 0, 0, 12, 92, 62); x.fill(); x.restore();
    x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "400 40px 'Secular One', Heebo, sans-serif"; x.fillText("החלפה!", 150, H - 136);
    x.textAlign = "right"; x.fillStyle = "#8a7fa6"; x.font = "500 26px Rubik, Heebo, sans-serif";
    x.fillText(licActive() ? "מהמותן · המנחה הדיגיטלי לאלתור" : "מופעל על ידי מהמותן", R, H - 168);
    x.direction = "ltr"; x.textAlign = "right"; x.fillText(SITE_URL.replace("https://", ""), R, H - 126);
    const blob = await new Promise((res) => c.toBlob(res, "image/png"));
    const file = new File([blob], "mehamoten-summary.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: "מהמותן — סיכום מפגש", text: summaryText().split("\n").slice(0, 3).join("\n") }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mehamoten-summary.png"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toastMsg("התמונה נשמרה — שלחו אותה בוואטסאפ");
  } catch (e) { toastMsg("לא הצלחנו ליצור תמונה במכשיר הזה — נסו 'העתק טקסט'"); }
  finally { if (btn) btn.disabled = false; }
}
function roundRect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
function star(x, cx, cy, n, R1, R2) { x.beginPath(); for (let i = 0; i < n * 2; i++) { const r = i % 2 ? R2 : R1, a = Math.PI * i / n; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); }
function wrapText(x, text, X, Y, maxW, lh, maxLines = 4) { const words = text.split(" "); let line = "", yy = Y, n = 0; for (const w of words) { const t = line ? line + " " + w : w; if (x.measureText(t).width > maxW && line) { if (++n >= maxLines) { line += "…"; break; } x.fillText(line, X, yy); line = w; yy += lh; } else line = t; } if (line) { x.fillText(line, X, yy); n++; } return n; }
function fitText(x, text, maxW) { if (x.measureText(text).width <= maxW) return text; let t = text; while (t.length > 3 && x.measureText(t + "…").width > maxW) t = t.slice(0, -1); return t + "…"; }

/* ---------- הגדרות ---------- */
function openSettings() { syncSettingsUI(); loadVoices(); renderLocalStats(); renderLicBoxes(); $("#settings").classList.add("open"); ac(); $("#settings .close").focus(); }
function closeSettings() { const v = $("#voiceSel").value; if (v) S.settings.voiceURI = v; save(); $("#settings").classList.remove("open"); }
function syncSettingsUI() {
  const st = S.settings;
  const map = { persona: st.persona, tts: st.tts ? "on" : "off", hints: st.hints ? "on" : "off", sfx: st.sfx ? "on" : "off", motion: st.motion ? "on" : "off" };
  $$("[data-skey]").forEach((seg) => { const v = map[seg.dataset.skey]; seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === v)); });
}
function onSettingsSeg(seg, btn) {
  const k = seg.dataset.skey, v = btn.dataset.v;
  if (k === "persona") S.settings.persona = v; else S.settings[k] = v === "on";
  if (k === "motion") document.body.classList.toggle("noanim", !S.settings.motion);
  if (k === "hints") applyHintsVis();
  if (k === "tts" && !S.settings.tts) { try { speechSynthesis.cancel(); } catch (e) {} }
  syncSettingsUI(); save();
}
function renderLocalStats() { $("#localStats").innerHTML = `<span>משחקים<b>${STATS.games}</b></span><span>סיבובים<b>${STATS.rounds}</b></span><span>החלפות<b>${STATS.swaps}</b></span>`; }
function testVoice() { sfx.bell(); speak(persona().test); }
async function resetAll() {
  const ok = await dialog({ title: "לאפס את כל הנתונים?", text: "שמות, הגדרות, קלפים משלכם וסטטיסטיקה יימחקו מהמכשיר. אי אפשר לבטל.", okText: "כן, לאפס", cancelText: "ביטול", danger: true });
  if (!ok) return;
  try { [STORE_KEY, LEGACY_KEY, STATS_KEY, CUSTOM_KEY, SEEN_KEY, LIC_KEY, LOGO_KEY].forEach((k) => localStorage.removeItem(k)); } catch (e) {}
  location.reload();
}

/* ---------- התקנה + עדכונים ---------- */
let installEvt = null;
window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installEvt = e; $("#installBar").classList.add("on"); });
window.addEventListener("appinstalled", () => { installEvt = null; $("#installBar").classList.remove("on"); });
async function install() {
  if (!installEvt) return; installEvt.prompt();
  try { await installEvt.userChoice; } catch (e) {} installEvt = null; $("#installBar").classList.remove("on");
}
let swRefreshing = false, swReg = null;
function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register("sw.js"); swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) $("#update").classList.add("show");
      const hadController = !!navigator.serviceWorker.controller;
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && hadController) $("#update").classList.add("show"); });
      });
      navigator.serviceWorker.addEventListener("controllerchange", () => { if (swRefreshing || !hadController) return; swRefreshing = true; location.reload(); });
    } catch (e) {}
  });
}
function reloadApp() {
  $("#update").classList.remove("show");
  if (swReg && swReg.waiting) { swReg.waiting.postMessage("SKIP_WAITING"); setTimeout(() => location.reload(), 1500); }
  else location.reload();
}

/* ---------- מקלדת ---------- */
document.addEventListener("keydown", (e) => {
  const tag = (e.target && e.target.tagName) || "";
  if (e.key === "Escape") {
    if ($("#dlg")?.classList.contains("open")) return;
    if ($("#settings").classList.contains("open")) closeSettings();
    else if ($("#editor").classList.contains("open")) closeEditor();
    else if ($("#onboard").classList.contains("open")) skipOnboard();
    return;
  }
  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
  if (currentScreen !== "play" || !sceneRunning || $("#dlg")?.classList.contains("open")) return;
  const k = e.key.toLowerCase();
  if (e.code === "Space") { e.preventDefault(); if (miniRound) fireMiniCue(true); else if (earRound) earNext(false); else if (!guessRound) doSwap(); }
  else if (k === "t" || k === "א") { if (!guessRound && !earRound && !miniRound) throwTopic(); }
  else if (k === "h" || k === "י") { if (S.settings.hints && !earRound && !miniRound) sceneHint(); }
  else if (k === "p" || k === "פ") togglePause();
  else if (k === "f" || k === "כ") { if (S.mode === "manual" && !guessRound && !earRound && !miniRound) freeze(); }
  else if (k === "e" || k === "ק") endScene();
});

/* ---------- ניתוב פעולות ---------- */
const ACTIONS = {
  obSkip: skipOnboard, obNext: nextOnboard, howto: () => openOnboard(true),
  openSettings, closeSettings, testVoice, resetAll, install, reloadApp,
  goSetup, goHome: () => { S.company = ($("#companyInput").value || "").trim().slice(0, 40); save(); show("home"); $("#resumeBtn").hidden = !canResume(); },
  addPlayer, delPlayer: (b) => delPlayer(+b.dataset.i), openEditor, closeEditor, addCustomCard, delCustomCard: (b) => delCustomCard(+b.dataset.i), exportCustom, importCustom,
  startGame, resumeGame, confirmHome, drawCards, reDraw: drawCards, openerHint, goCast, backToDraw: () => show("draw"), beginCountdown,
  manualSwap, throwTopic, stuck, sceneHint, freeze, togglePause, endScene, guessSuccess, applyGuessScore,
  earNext: () => earNext(false), earRedrawSet, earReveal, applyEarScore,
  miniNext: () => fireMiniCue(true), miniRedraw, miniShowTopic, miniRevealExpert, miniExpertWin: () => miniExpertDone(true), miniExpertLose: () => miniExpertDone(false),
  applyScore, nextRound, endGameNow, declareWinner, showBoardOnly: () => { renderBoard(); show("scoreboard"); }, renderDebrief, finalEnd, newGame,
  showSummary, copySummary, shareSummary, pickDebrief: (b) => pickDebrief(b.dataset.q, b),
  hideHint, hideTopic, enterCode, removeCode, continueFree, shareImage, pickLogo, removeLogo
};
document.addEventListener("click", (e) => {
  const seg = e.target.closest(".seg[data-key], .seg[data-skey]");
  if (seg) { const b = e.target.closest("button"); if (b && seg.contains(b) && !b.disabled) { if (seg.dataset.key) onSetupSeg(seg, b); else onSettingsSeg(seg, b); } return; }
  const pk = e.target.closest("#packSeg button"); if (pk) { if (!pk.disabled) togglePack(pk.dataset.pack); return; }
  const cat = e.target.closest("#edCat button"); if (cat) { edCat = cat.dataset.c; $$("#edCat button").forEach((x) => x.classList.toggle("on", x === cat)); return; }
  const crit = e.target.closest(".crit button"); if (crit) { const grp = crit.closest(".crit"); const p = S.curPerf[+grp.dataset.player]; const c = crit.dataset.c; if (scoreState[p]) { scoreState[p][c] = !scoreState[p][c]; crit.classList.toggle("on", scoreState[p][c]); } return; }
  const hn = e.target.closest("[data-hn]"); if (hn) { const grid = hn.parentElement; grid.querySelectorAll("button").forEach((x) => x.classList.remove("on")); hn.classList.add("on");
    if (grid.id === "hinterGrid") hinterPick = hn.dataset.hn; else scoreState.honor = hn.dataset.hn; return; }
  const ec = e.target.closest("[data-ec]"); if (ec) { toggleEarCaught(ec); return; }
  const act = e.target.closest("[data-act]"); if (!act) return;
  const fn = ACTIONS[act.dataset.act]; if (fn) fn(act, e);
});
document.addEventListener("input", (e) => {
  const t = e.target;
  if (t.matches("#players input")) { S.players[+t.dataset.pi] = t.value; }
  else if (t.id === "companyInput") { S.company = t.value.trim().slice(0, 40); }
  else if (t.id === "logoFile") { onLogoFile(t.files && t.files[0]); }
});
document.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches && e.target.matches('[role="button"][data-act]')) { e.preventDefault(); e.stopPropagation(); e.target.click(); }
}, true);
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches("#players input")) { e.preventDefault(); const inputs = $$("#players input"); const i = inputs.indexOf(e.target); if (i < inputs.length - 1) inputs[i + 1].focus(); else e.target.blur(); }
  if (e.key === "Enter" && (e.target.id === "edTitle" || e.target.id === "edDesc")) { e.preventDefault(); if (e.target.id === "edTitle") $("#edDesc").focus(); else addCustomCard(); }
});

/* ---------- אתחול ---------- */
(function init() {
  load(); loadCustom(); loadLicense(); loadLogo(); buildIndustrySeg();
  /* לינק מוכן מראש: ?preset=team&company=X&industry=hitech&code=MM-... */
  try {
    const q = new URLSearchParams(location.search); let presetUsed = false;
    if (q.get("code")) { const p = parseLicense(q.get("code")); if (p.ok && p.exp > Date.now()) { LIC = p; lsSet(LIC_KEY, { code: p.code }); presetUsed = true; } }
    if (q.get("preset") === "team") { S.team = true; presetUsed = true; }
    if (q.get("company")) { S.company = q.get("company").trim().slice(0, 40); presetUsed = true; }
    if (q.get("industry") && MM_INDUSTRY[q.get("industry")]) { S.industry = q.get("industry"); presetUsed = true; }
    if (presetUsed) { lsSet(SEEN_KEY, true); save(); history.replaceState(null, "", location.pathname); setTimeout(goSetup, 0); }
  } catch (e) {}
  document.body.classList.toggle("noanim", !S.settings.motion);
  document.body.classList.toggle("bigscreen", !!S.big);
  $("#verLabel").textContent = APP_VERSION;
  $("#resumeBtn").hidden = !canResume();
  loadVoices(); applyHintsVis(); show("home");
  if (location.hash === "#play") { lsSet(SEEN_KEY, true); goSetup(); history.replaceState(null, "", location.pathname + location.search); }
  else if (!S.team || !$("#setup").classList.contains("active")) openOnboard(false);
  if (LIC && licActive() && licDaysLeft() <= 7) setTimeout(() => toastMsg(`הקוד הארגוני של ${LIC.org} פג בעוד ${licDaysLeft()} ימים — אפשר לחדש בוואטסאפ מההגדרות`), 1200);
  else if (LIC && !licActive()) setTimeout(() => toastMsg(`הקוד הארגוני של ${LIC.org} פג תוקף — מצב צוות חזר לניסיון`), 1200);
  renderLicBoxes();
  registerSW();
})();
