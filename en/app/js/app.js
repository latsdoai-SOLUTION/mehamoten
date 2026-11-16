/* ============================================================
   מהמותן — לוגיקת האפליקציה (v2.0.0)
   PWA עצמאית, עברית RTL, עובדת אופליין.
   מבנה: מצב (S) → מסכים (show) → זרימת משחק → סיכום.
   כל הכפתורים עובדים דרך data-act (האצלת אירועים אחת).
   ============================================================ */
"use strict";

const APP_VERSION = "2.6.6-en";
const MM_LANG = "en"; /* English build: /en/app/ */
const WIN_TOKENS = 15;
const MAX_PLAYERS = 8;
const STORE_KEY = "mehamoten_en_state";
const LEGACY_KEY = "mehamoten_en_legacy_none";
const STATS_KEY = "mehamoten_en_stats";
const CUSTOM_KEY = "mehamoten_en_custom";
const SEEN_KEY = "mehamoten_en_seen";
const LIC_KEY = "mehamoten_license";
const LOGO_KEY = "mehamoten_logo";
const TRIAL_KEY = "mehamoten_trial"; /* 2.6.3: מונה סיבובי ניסיון, נפרד מ-S כדי ש"קבוצה חדשה" לא יאפס אותו */
const TRIAL_ROUNDS = 2;
const WA_NUMBER = "972506325398";
const SITE_URL = "https://mehamoten.com/en";
/* 2.6.3: כפתורי "לקנות" במסך ההצעה: דפי התשלום (ישראכרט pay360). צריך להיות זהה ל-MM_BUY_LINKS ב-deploy/site.js.
   ריק = הכפתור פותח וואטסאפ עם הודעה מוכנה שמציינת את החבילה. */
const BUY_LINKS = {
  event: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=179B1335-AAC4-A149-8ABB-F479E6B60D55",    /* ערב צוות, 690 ₪ */
  year: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B7BE0722-5BA9-1614-21CE-CC3FE8FBACF2",     /* שנה פתוחה, 4,100 ₪ */
  yearPlus: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B37C2305-3B65-4C4C-4A41-65563EE81FF4"  /* שנה + ערב עם לירן, 5,900 ₪ */
};
const BUY_NAMES = { event: "Team evening (690 ILS)", year: "One-year access (4,100 ILS)", yearPlus: "Year + live evening with Liran (5,900 ILS)" };

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
  const d = new Date(LIC.exp); const when = d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  return `<b>${esc(LIC.org)}</b> · valid until ${when}` + (LIC.seats ? ` · up to ${LIC.seats} players` : "");
}
function renderLicBoxes() {
  const BTN = `<br><button class="ghost goldb" data-act="enterCode" style="min-height:40px;padding:8px 16px;font-size:14px">🔑 I have a code</button>`;
  const html = licActive()
    ? `✅ Team code active: ${licLabel()}` + (licDaysLeft() <= 14 ? `<br>⏳ ${licDaysLeft()} days left. <a href="${waLink("renew")}" target="_blank" rel="noopener" style="color:var(--spot)">Renew on WhatsApp</a>` : "")
    : LIC ? `⛔ The code for <b>${esc(LIC.org)}</b> has expired. <a href="${waLink("renew")}" target="_blank" rel="noopener" style="color:var(--spot)">Renew on WhatsApp</a>` + BTN
    : `${trialOver() ? "🔒 Both free trial rounds are used. To keep playing you need a code (from 690 ILS)." : `🔓 Free trial: two rounds in any mode (${trialLeft()} left). After that, enter a license code. Plans start at 690 ILS.`}` + BTN;
  $$("#licBox, #licBox2").forEach((el) => { el.innerHTML = el.id === "licBox2" ? html.replace(BTN, "") : html; el.classList.toggle("ok", licActive()); el.classList.toggle("warn", !!LIC && !licActive()); });
  const rb = $("#licRemoveBtn"); if (rb) rb.hidden = !LIC;
  renderLogo();
  $$('[data-role="mgrcta"]').forEach((el) => el.hidden = licActive());
  $$('[data-role="mgrwa"]').forEach((a) => a.href = waLink("manager"));
  $$("#offer [data-buy]").forEach((el) => el.href = buyLink(el.dataset.buy));
}
function buyLink(k) {
  if (BUY_LINKS[k]) return BUY_LINKS[k];
  const org = (S.company || (LIC && LIC.org) || "").trim();
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi, I want to buy Mehamoten (English): ${BUY_NAMES[k] || BUY_NAMES.event}${org ? ", for " + org : ""}`)}`;
}
function waLink(kind) {
  const org = (S.company || (LIC && LIC.org) || "").trim();
  const msgs = {
    manager: `Hi, we played Mehamoten in English${org ? " (" + org + ")" : ""} and I would like to hear about a team code`,
    renew: `Hi, I would like to renew the team code${org ? " for " + org : ""}`
  };
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msgs[kind] || msgs.manager)}`;
}
async function enterCode() {
  const v = await dialog({ title: "🔑 Team code", text: "Paste the code you received (for example MM-ACME-1026-50-K7Q2MX):", input: "MM-....", okText: "Activate" });
  if (v === null) return; const p = parseLicense(v);
  if (!p.ok) { await notify("Code not recognized", p.reason === "sig" ? "The code is not valid. Check that you copied all of it, or contact us on WhatsApp." : "Wrong format. A code looks like this: MM-ACME-1026-50-K7Q2MX"); return; }
  if (p.exp <= Date.now()) { await notify("The code has expired", "Contact us on WhatsApp to renew."); return; }
  LIC = p; lsSet(LIC_KEY, { code: p.code });
  const onOffer = $("#offer").classList.contains("active");
  if (!S.inGame || (onOffer && offerFromStart)) S.team = true; /* 2.6.3: באמצע משחק (משפחה, ילדים) לא עוברים למצב צוות */
  save(); renderLicBoxes(); syncSetupUI(); sfx.bell(); toastMsg(`Code activated! Team mode is open for ${p.org}`);
  if (onOffer) { if (offerFromStart || !S.inGame) goSetup(); else nextRound(); } /* ההצעה הופיעה בניסיון להתחיל סיבוב: ממשיכים אליו */
}
async function removeCode() {
  const ok = await dialog({ title: "Remove the team code?", text: "You can enter it again any time.", okText: "Remove", danger: true }); if (!ok) return;
  LIC = null; try { localStorage.removeItem(LIC_KEY); } catch (e) {} renderLicBoxes(); syncSetupUI();
}
/* 2.6.3: שני סיבובי ניסיון בכל מצב (צוות, רגיל, משפחה, ילדים, קליל ומלא). חימום לא נספר.
   סיבוב נספר כשהוא מתחיל (nextRound), כך שיציאה באמצע לא נותנת ניסיון נוסף. קוד בתוקף = בלי הגבלה. */
function trialCount() { const t = lsGet(TRIAL_KEY, null); return t && +t.n > 0 ? Math.floor(+t.n) : 0; }
function trialSpend() { lsSet(TRIAL_KEY, { n: trialCount() + 1 }); }
function trialLeft() { return Math.max(0, TRIAL_ROUNDS - trialCount()); }
function trialOver() { return !licActive() && trialCount() >= TRIAL_ROUNDS; }
/* fromStart: ההצעה הופיעה בלחיצה על "התחל" (משחק חדש). אחרי הזנת קוד חוזרים להגדרות, לא למשחק הקודם */
let offerFromStart = false, offerBackTo = "";
function showOffer(fromStart) { offerFromStart = !!fromStart; if (currentScreen !== "offer") offerBackTo = currentScreen; stopVoice(); renderLicBoxes(); show("offer"); }
/* "חזרה" במסך ההצעה: למסך שממנו הגיעו (סוף סיבוב או לוח תוצאות, ומשם לסיום ולסיכום). מ"התחל": חזרה להגדרות */
function offerBack() {
  const t = offerBackTo && offerBackTo !== "offer" && $("#" + offerBackTo) ? offerBackTo : (S.inGame && S.round > 0 ? (S.scored ? "scoreboard" : "roundend") : "setup");
  if (t === "scoreboard") renderBoard(); if (t === "setup") goSetup(); else show(t);
}

/* ---------- מצב ---------- */
const DEFAULT_SETTINGS = { persona: "compere", tts: true, sfx: true, hints: true, motion: true, voiceURI: "", voice: "tts" };
const S = {
  players: ["", "", ""], mode: "auto", scored: false, level: "easy", kids: false, team: false, company: "", industry: "",
  packs: ["style", "lang", "body"], stage: 2, sceneLen: 90, big: false, lite: true, warm: true, ls: null, liteEv: null,
  scores: {}, honors: {}, directorIdx: 0, round: 0, dirCounts: {}, curDir: "", curPerf: [], starter: "",
  guessIdx: 0, inGame: false, startedAt: 0,
  set: null, con: null, conCat: null, rings: 0, topics: 0,
  log: [], debriefPicked: [], debrief: null, freezes: 0,
  settings: { ...DEFAULT_SETTINGS }
};
function save() { S.lastActive = Date.now(); lsSet(STORE_KEY, S); }

/* ---------- קבוצה חדשה: כל קבוצה מתחילה ממסך נקי ----------
   מוחק רק את מה ששייך לקבוצה (שמות, ניקוד, יומן, שם ארגון, משחק פתוח).
   נשאר במכשיר: רישיון, לוגו, הגדרות, קלפים משלכם, סטטיסטיקה, וסיבוב הניסיון שנוצל. */
const GROUP_IDLE_MS = 6 * 60 * 60 * 1000;
function hasGroupData() { return activeP().length > 0 || !!S.company || S.log.length > 0 || !!S.inGame; }
/* נתונים ממכשיר שעוד לא היה בו lastActive (לפני 2.2.1): נופלים לזמן תחילת המשחק */
function groupIsStale() { const t = +S.lastActive || +S.startedAt || 0; return hasGroupData() && Date.now() - t > GROUP_IDLE_MS; }
function clearGroup() {
  stopGame(); /* כל מסלולי המחיקה עוצרים קודם טיימרים, ספירה לאחור וקול */
  S.players = ["", "", ""]; S.company = "";
  S.scores = {}; S.honors = {}; S.dirCounts = {}; S.log = []; S.debriefPicked = []; S.debrief = null;
  S.round = 0; S.directorIdx = 0; S.guessIdx = 0; S.earIdx = 0; S.miniIdx = 0;
  S.curDir = ""; S.curPerf = []; S.starter = ""; S.set = null; S.con = null; S.conCat = null;
  S.rings = 0; S.topics = 0; S.startedAt = 0; S.inGame = false; S.ls = null; S.liteEv = null;
  S.guesser = ""; S.earListener = ""; S.earAgent = ""; S.mini = null; S.ear = null; S.guess = null;
  gameActive = false; save();
  const ci = $("#companyInput"); if (ci) ci.value = "";
  /* מסכים מוסתרים שעוד מחזיקים שמות מהקבוצה הקודמת */
  ["#dbBody", "#board", "#introPerf", "#introDir", "#introWho", "#winName", "#summaryBody", "#playPerf", "#earListenerName", "#earAgentName"].forEach((sel) => { const e = $(sel); if (e) e.textContent = ""; });
  renderPlayers(); syncGroupUI();
}
function syncGroupUI() {
  const rb = $("#resumeBtn"); if (rb) rb.hidden = !canResume();
  const ng = $("#newGroupHome"); if (ng) ng.hidden = !hasGroupData();
}
async function newGroup() {
  if (hasGroupData()) {
    const ok = await dialog({ title: "Start a new group?", text: "The names, scores and company name of the last group will be deleted from this device. Your license, logo, settings and cards stay.", okText: "Yes, new group", cancelText: "Cancel" });
    if (!ok) return;
  }
  clearGroup(); toastMsg("Ready for a new group ✓");
  if (currentScreen !== "setup") goSetup();
}
let staleAsking = false;
async function askStaleGroup() {
  if (staleAsking) return; staleAsking = true;
  const n = activeP().length, t = +S.lastActive || +S.startedAt || 0, h = t ? Math.floor((Date.now() - t) / 3600000) : 0;
  const when = !t ? "" : h >= 48 ? ` ${Math.floor(h / 24)} days ago` : h >= 1 ? ` ${h} hours ago` : "";
  const text = `This device has data from a previous group${n ? ` (${n} players` + (when ? `, played${when})` : ")") : ""}. So the names don't show up for the next group, it's best to start clean.` + (S.inGame ? " The open game of the previous group will be closed." : "");
  /* רקע אטום: שלא יראו את השמות הישנים מאחורי החלון */
  const ok = await dialog({ title: "New group?", text, okText: "New group", cancelText: "Continue with the previous group", solid: true });
  staleAsking = false;
  if (ok) {
    clearGroup(); if (!["home", "setup"].includes(currentScreen)) show("home"); toastMsg("Ready for a new group ✓");
  } else { save(); if (gameActive) keepAwake(true); } /* מעדכן את זמן הפעילות כדי שלא ישאל שוב מיד */
}
function load() {
  let r = lsGet(STORE_KEY, null);
  if (!r) { const legacy = lsGet(LEGACY_KEY, null); if (legacy) r = legacy; }
  if (r && typeof r === "object") Object.assign(S, r);
  // ניקוי/תיקון ערכים
  if (!Array.isArray(S.players) || S.players.length < 2) S.players = ["", "", ""];
  S.players = S.players.slice(0, MAX_PLAYERS).map((p) => String(p || "").slice(0, 24));
  S.settings = { ...DEFAULT_SETTINGS, ...(S.settings || {}) }; S.settings.voice = "tts";
  if (!Array.isArray(S.packs) || !S.packs.length) S.packs = ["style", "lang", "body"];
  S.packs = S.packs.filter((p) => p === "guess" || p === "ear" || MINI[p] || MM_DATA[p]);
  if (!S.packs.length) S.packs = ["style", "lang", "body"];
  if (![60, 90, 120].includes(+S.sceneLen)) S.sceneLen = 90; else S.sceneLen = +S.sceneLen;
  if (!["auto", "manual"].includes(S.mode)) S.mode = "auto";
  if (![2, 3, 4].includes(+S.stage)) S.stage = 2; else S.stage = +S.stage;
  if (!Array.isArray(S.extra)) S.extra = [];
  if (!["easy", "reg"].includes(S.level)) S.level = "easy";
  if (S.industry && !MM_INDUSTRY[S.industry]) S.industry = "";
  if (!Array.isArray(S.log)) S.log = [];
  if (!Array.isArray(S.debriefPicked)) S.debriefPicked = [];
  if (S.debrief) { const D = S.debrief; if (Array.isArray(D) || typeof D !== "object") S.debrief = null; else { D.step = [0, 1, 2, 3].includes(D.step) ? D.step : 0; D.op = +D.op || 0; ["theme", "shared", "tryIt", "follow"].forEach((k) => { D[k] = typeof D[k] === "string" ? D[k] : ""; }); D.done = !!D.done; D.skipped = !!D.skipped; } }
  ["scores", "dirCounts", "honors"].forEach((k) => { if (!S[k] || typeof S[k] !== "object" || Array.isArray(S[k])) S[k] = {}; });
  if (!Array.isArray(S.curPerf)) S.curPerf = [];
  if (typeof S.round !== "number" || S.round < 0) S.round = 0;
  if (typeof S.directorIdx !== "number") S.directorIdx = 0;
  if (!Array.isArray(S.set) || S.set.length < 3) S.set = null;
  if (!Array.isArray(S.con) || S.con.length < 3) S.con = null;
  if (S.set && !MM_CAT[S.conCat]) { S.conCat = null; S.con = null; }
  if (typeof S.guessIdx !== "number") S.guessIdx = 0;
  S.kids = !!S.kids; S.team = !!S.team; S.big = !!S.big; S.scored = !!S.scored;
  /* מצב קליל (2.4.0, לכולם מ-2.4.1): ברירת מחדל. מכשיר שעודכן מגרסה קודמת מקבל קליל. */
  S.lite = S.lite !== false;
  /* חימום בפתיחה (2.6.0): ברירת מחדל כן */
  S.warm = S.warm !== false;
  /* רענון לפני הסיבוב הראשון (למשל באמצע החימום): סיבוב הניסיון לא נשרף */
  delete S.teamTrialUsed; delete S.trialRound; /* שדות של 2.6.2 (ניסיון צוות), לא בשימוש */
  if (!S.ls || typeof S.ls !== "object" || !Array.isArray(S.ls.roles) || !Array.isArray(S.ls.lines)) S.ls = null;
  if (S.liteEv && !["swap", "task", "style"].includes(S.liteEv.kind)) S.liteEv = null;
}
/* מצב קליל פעיל: ברירת המחדל לכולם (2.4.1), עד שבוחרים "מלא" בהגדרת המשחק */
function isLite() { return !!S.lite; }
function voiceHas(t) { try { return S.settings.voice === "tts" || (typeof MMV === "object" && MMV.has(t, S.settings.persona)); } catch (e) { return false; } }
/* סיבוב "שובר" במצב קליל: כל סיבוב רביעי משהו אחר (ניחוש עם 3+ שחקנים, אחרת רגשות בשלט רחוק) */
function liteBreaker(round) { return round > 0 && round % 4 === 0; }
/* מה קורה באמצע הסיבוב במצב קליל: סיבוב 1 כלום, סיבוב 2 החלפת דמויות, סיבוב 3 משימה אישית, ואז לסירוגין */
function liteEventKind(round) {
  if (round <= 1) return null;
  const idx = (round - 2) - Math.floor(round / 4); /* סיבוב שובר לא נספר */
  return ["swap", "task", "style"][((idx % 3) + 3) % 3];
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
  const ext = CUSTOM.filter((c) => c.cat === cat).map((c) => [c.t, c.d, "Your own card. Go for it with full confidence!"]);
  let all = (MM_DATA[cat] || []).concat(ext);
  if (cat === "set" && S.team && S.industry && MM_INDUSTRY[S.industry]) all = all.concat(MM_INDUSTRY[S.industry].cards);
  if (S.kids) all = all.filter((c) => !MM_KIDS_BLOCK.has(c[0]));
  if (cat === "set" && S.team) all = all.filter((c) => !MM_TEAM_BLOCK.has(c[0]));
  return all;
}

/* ---------- מסכים ---------- */
let currentScreen = "home";
/* ---------- 2.6.5: נורה "עוד לא התחלנו" לפני הספירה, "משחקים עכשיו" בזמן הסצנה, ותזכורת אחרי 30 שניות ---------- */
const PREP_SCREENS = ["liteScene", "cast", "guessIntro", "earIntro", "miniIntro"];
const LAMP_TXT = { wait: 'NOT STARTED YET', live: 'LIVE NOW', paused: 'PAUSED' };
const PREP_NUDGE_MS = 30000;
let prepNudgeT = null;
function airLamp(state) {
  const l = $("#airLamp"); if (!l) return;
  if (!state) { l.hidden = true; return; }
  l.className = "airlamp " + (state === "live" ? "live" : "wait");
  $("#airLampTxt").textContent = LAMP_TXT[state] || "";
  l.hidden = false;
}
function prepWatch(id) {
  if (prepNudgeT) { clearTimeout(prepNudgeT); prepNudgeT = null; }
  $$(".prepnudge").forEach((n) => n.hidden = true);
  $$(".nudgego").forEach((b) => b.classList.remove("nudgego"));
  if (id && PREP_SCREENS.includes(id)) {
    airLamp("wait");
    prepNudgeT = setTimeout(() => {
      prepNudgeT = null; if (currentScreen !== id || countdownRunning) return;
      const scr = $("#" + id), n = scr && scr.querySelector(".prepnudge"), b = scr && scr.querySelector('.big[data-act="beginCountdown"]');
      if (n) n.hidden = false; if (b) { b.classList.remove("nudgego"); void b.offsetWidth; b.classList.add("nudgego"); }
    }, PREP_NUDGE_MS);
  } else airLamp(id === "play" ? (typeof paused !== "undefined" && paused ? "paused" : "live") : null);
}
function show(id) {
  $$(".screen").forEach((s) => s.classList.remove("active"));
  const el = $("#" + id); if (!el) return;
  el.classList.add("active"); el.scrollTop = 0; currentScreen = id;
  prepWatch(id);
  if (id === "home") syncGroupUI();
  document.body.classList.toggle("ingame", !["home", "setup", "summary"].includes(id));
  const focusEl = el.querySelector("h1,h2,.who,.eyebrow,.guide"); if (focusEl) { focusEl.setAttribute("tabindex", "-1"); focusEl.focus({ preventScroll: true }); }
}
function activeP() { return S.players.map((p) => p.trim()).filter(Boolean); }

/* ---------- אודיו ---------- */
let AC = null;
function ac() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} } return AC; }
function tone(freq, dur, type = "sine", vol = .4, slideTo = null) {
  if (!S.settings.sfx) return; const c = ac(); if (!c) return;
  if (c.state !== "running") { try { c.resume().catch(() => {}); } catch (e) {} }
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
  const he = VOICES.filter((v) => /^en/i.test(v.lang)).sort((a, b) => (/^en-(US|GB)/i.test(b.lang) ? 1 : 0) - (/^en-(US|GB)/i.test(a.lang) ? 1 : 0)); const list = he.length ? he : VOICES;
  sel.innerHTML = list.map((v) => `<option value="${esc(v.voiceURI)}">${esc(v.name)} (${esc(v.lang)})</option>`).join("") || `<option value="">No voices available</option>`;
  if (S.settings.voiceURI && list.some((v) => v.voiceURI === S.settings.voiceURI)) sel.value = S.settings.voiceURI;
  else if (he[0]) { sel.value = he[0].voiceURI; S.settings.voiceURI = he[0].voiceURI; }
}
if ("speechSynthesis" in window) speechSynthesis.onvoiceschanged = () => { if (!$("#settings").classList.contains("open")) loadVoices(); };
function speak(text, seq) {
  if (!S.settings.tts) return;
  /* קול מוקלט: מנגן את מה שהוקלט. משפט שלא הוקלט נשאר על המסך בלי קול, ולא קוטע משפט שכבר מתנגן,
     כדי שלא יתערבב הקול של הדפדפן באמצע. קול הדפדפן רק אם בחרו בו או אם ההקלטות לא זמינות. */
  if (S.settings.voice !== "tts" && typeof MMV === "object" && MMV.available()) {
    if (MMV.say(seq && seq.length ? seq : [text], S.settings.persona)) { try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {} }
    return;
  }
  stopVoice();
  speakTTS(text);
}
function stopVoice() { try { if (typeof MMV === "object") MMV.stop(); } catch (e) {} try { if ("speechSynthesis" in window) speechSynthesis.cancel(); } catch (e) {} }
function speakTTS(text) {
  if (!text || !("speechSynthesis" in window)) return;
  try {
    if (speechSynthesis.speaking || speechSynthesis.pending) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = (VOICES.find((x) => x.voiceURI === S.settings.voiceURI) || {}).lang || "en-US";
    const v = VOICES.find((x) => x.voiceURI === S.settings.voiceURI); if (v) u.voice = v;
    u.rate = { compere: 1.05, cynic: .95, manic: 1.25 }[S.settings.persona] || 1;
    u.pitch = { compere: 1.1, cynic: .9, manic: 1.3 }[S.settings.persona] || 1;
    u.volume = 1; setTimeout(() => speechSynthesis.speak(u), 0);
  } catch (e) {}
}
function persona() { return MM_PERSONA[S.settings.persona] || MM_PERSONA.compere; }
function personaKey() { return MM_PERSONA[S.settings.persona] ? S.settings.persona : "compere"; }

/* ---------- חלוניות (במקום alert/confirm/prompt) ---------- */
function dialog({ title, text, input, value = "", okText = "OK", cancelText = "Cancel", danger = false, solid = false }) {
  return new Promise((resolve) => {
    let m = $("#dlg");
    if (!m) { m = document.createElement("div"); m.id = "dlg"; m.className = "modal"; m.style.zIndex = "90"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); document.body.appendChild(m); }
    m.innerHTML = `<div class="panel" style="width:min(560px,94vw);text-align:left">
      <h2 style="font-size:clamp(22px,3.4vmin,32px)">${esc(title || "")}</h2>
      ${text ? `<p class="sub" style="font-size:16px;color:#e9e3d4">${esc(text)}</p>` : ""}
      ${input ? `<textarea id="dlgIn" class="tinput" rows="4" style="resize:vertical;font-size:14px" placeholder="${esc(input)}"></textarea>` : ""}
      <div class="row" style="margin-top:18px;justify-content:flex-start">
        <button class="${danger ? "ghost" : "big sm"}" data-dlg="ok">${esc(okText)}</button>
        ${cancelText ? `<button class="${danger ? "big sm" : "ghost"}" data-dlg="cancel">${esc(cancelText)}</button>` : ""}
      </div></div>`;
    m.style.background = solid ? "#100c17" : "";
    m.classList.add("open");
    const done = (ok) => { m.classList.remove("open"); const v = input ? ($("#dlgIn")?.value || "") : true; resolve(ok ? v : null); };
    m.onclick = (e) => { const b = e.target.closest("[data-dlg]"); if (!b) return; done(b.dataset.dlg === "ok"); };
    m.onkeydown = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(false); } };
    const ta = $("#dlgIn"); if (ta && value) { ta.value = value; ta.focus(); ta.select(); }
    const first = m.querySelector(input ? "#dlgIn" : "[data-dlg=ok]"); if (first && !(ta && value)) first.focus();
  });
}
const notify = (title, text) => dialog({ title, text, okText: "Close", cancelText: "" });

/* ---------- אונבורדינג ---------- */
let obIdx = 0; const OB_LAST = 4;
function renderObDots() { $("#obDots").innerHTML = [0, 1, 2, 3, 4].map((i) => `<i class="${i === obIdx ? "on" : ""}"></i>`).join(""); }
function openOnboard(force) {
  if (!force && lsGet(SEEN_KEY, false)) return false;
  obIdx = 0; showOb(); $("#onboard").classList.add("open"); return true;
}
function showOb() {
  $$("#onboard .ob").forEach((o) => o.classList.toggle("on", +o.dataset.i === obIdx));
  renderObDots(); $("#obNext").textContent = obIdx >= OB_LAST ? "Let's go!" : "Next";
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
  $("#hintKind").textContent = "Heads up"; $("#hintTxt").textContent = text;
  $("#hint").classList.add("show"); sfx.hint(); if (hintT) clearTimeout(hintT); hintT = setTimeout(hideHint, 4000);
}
function showHint(kind, text) {
  if (!S.settings.hints) return;
  $("#hintKind").textContent = kind; $("#hintTxt").textContent = text; $("#hint").classList.add("show");
  sfx.hint(); speak(text); if (hintT) clearTimeout(hintT); hintT = setTimeout(hideHint, 7000);
}
function hideHint() { $("#hint").classList.remove("show"); }
function openerHint() { if (S.set) showHint("Opening hint", S.set[2]); }
let tipIdx = 0;
function sceneHint() {
  if (S.con && Math.random() < .55) showHint("How to beat the twist", S.con[2]);
  else { showHint("Improv tip", MM_TIPS[tipIdx % MM_TIPS.length]); tipIdx++; }
}
function stuck() { showHint("Stuck? Say this", '"' + drawDeck("openers", MM_OPENERS) + '"'); }
function showTopicToast(text) { $("#topicTxt").textContent = text; $("#topic").classList.add("show"); if (topicT) clearTimeout(topicT); topicT = setTimeout(hideTopic, 6000); }
function hideTopic() { $("#topic").classList.remove("show"); }
function throwTopic() {
  if (!sceneRunning || paused) return; S.topics++;
  let tp = MM_TOPICS; if (S.kids) tp = tp.filter((x) => !MM_KIDS_TOPIC_BLOCK.some((b) => x.includes(b)));
  const t = drawDeck("topics", tp); showTopicToast(t); sfx.topic(); speak(persona().topic(t), ["topic-lead-1", t]);
}

/* ---------- הגדרת משחק ---------- */
function goSetup() {
  /* בדיקה לפני שמציגים שמות: גם כשהאפליקציה נשארה פתוחה בלי טעינה ובלי יציאה */
  if (groupIsStale()) { if (!staleAsking) askStaleGroup().then(() => goSetup()); return; }
  renderPlayers(); syncSetupUI(); show("setup"); ac();
}
function renderPlayers() {
  $("#players").innerHTML = S.players.map((p, i) => `
    <div class="prow"><div class="idx">${i + 1}</div>
      <input type="text" value="${esc(p)}" maxlength="24" placeholder="Player ${i + 1}" data-pi="${i}" aria-label="Player ${i + 1} name" autocomplete="off" enterkeyhint="next">
      ${S.players.length > 2 ? `<button class="del" data-act="delPlayer" data-i="${i}" aria-label="Remove player ${i + 1}">✕</button>` : ""}</div>`).join("");
}
function addPlayer() {
  if (S.players.length >= MAX_PLAYERS) { toastMsg(`Up to ${MAX_PLAYERS} players`); return; }
  S.players.push(""); renderPlayers(); const last = $$("#players input").pop(); if (last) last.focus();
}
function delPlayer(i) { if (S.players.length <= 2) return; S.players.splice(i, 1); renderPlayers(); }
function buildIndustrySeg() {
  const seg = $("#industrySeg");
  seg.innerHTML = `<button data-v="">🎲 General</button>` + Object.entries(MM_INDUSTRY).map(([k, v]) => `<button data-v="${k}">${v.ic} ${esc(v.label)}</button>`).join("");
}
function setOn(segId, val) { $$(`#${segId} button`).forEach((b) => { const on = b.dataset.v === val; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); }); }
function syncSetupUI() {
  setOn("modeSeg", S.mode); setOn("scoredSeg", S.scored ? "scored" : "party"); setOn("levelSeg", S.level);
  setOn("kidsSeg", S.kids ? "on" : "off"); setOn("teamSeg", S.team ? "on" : "off"); setOn("bigSeg", S.big ? "on" : "off");
  setOn("timeSeg", String(S.sceneLen)); setOn("industrySeg", S.industry || "");
  $("#teamExtra").hidden = !S.team; $("#companyInput").value = S.company || ""; renderLicBoxes();
  setOn("warmSeg", S.warm ? "on" : "off");
  setOn("stageSeg", String(stageN())); $$("#stageSeg button").forEach((b) => b.disabled = S.kids && b.dataset.v !== "2"); { const sn = $("#stageNote"); if (sn) sn.hidden = !S.kids; }
  setOn("liteSeg", S.lite ? "on" : "off"); if (isLite()) setOn("modeSeg", "auto");
  /* במצב קליל: המנחה אוטומטי, והאילוצים, הרמה ומשחקי המיני לא בשימוש */
  const lite = isLite(); const ln = $("#liteNote"); if (ln) ln.hidden = !lite;
  $$("#modeSeg button, #levelSeg button, #packSeg button").forEach((b) => b.disabled = lite || (b.dataset.pack === "guess" && S.kids));
  $$("#packSeg button").forEach((b) => { const on = S.packs.includes(b.dataset.pack); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); });
  $$("#scoredSeg button").forEach((b) => b.disabled = S.kids);
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
  else if (key === "lite") S.lite = v === "on";
  else if (key === "warm") S.warm = v === "on";
  else if (key === "stage") S.stage = [2, 3, 4].includes(+v) ? +v : 2;
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
  if (i >= 0) { if (S.packs.length > 1) S.packs.splice(i, 1); else toastMsg("You need at least one pack"); }
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
  if (CUSTOM.some((c) => c.cat === edCat && c.t === t)) { toastMsg("That card already exists"); return; }
  CUSTOM.push({ cat: edCat, t: t.slice(0, 40), d: d.slice(0, 90) }); saveCustom();
  $("#edTitle").value = ""; $("#edDesc").value = ""; $("#edTitle").focus(); renderCustom(); sfx.hint();
}
function delCustomCard(i) { CUSTOM.splice(i, 1); saveCustom(); renderCustom(); }
async function exportCustom() {
  if (!CUSTOM.length) { await notify("No cards to export", "Add at least one card first."); return; }
  const txt = "mehamoten-cards:" + JSON.stringify(CUSTOM);
  let ok = false;
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(txt); ok = true; } } catch (e) {}
  if (ok) await notify("Copied!", "Send the text to friends. They paste it in 'Import'.");
  else await dialog({ title: "Copy the text", text: "Select all and copy:", input: " ", value: txt, okText: "Close", cancelText: "" });
}
async function importCustom() {
  const txt = await dialog({ title: "Import cards", text: "Paste the text you received here:", input: "mehamoten-cards:[...]", okText: "Import" });
  if (!txt) return;
  try {
    const raw = txt.trim().replace(/^[‎‏﻿]*(mehamoten-cards|מהמותן-קלפים):/, "").trim();
    const arr = JSON.parse(raw); if (!Array.isArray(arr)) throw 0;
    let added = 0;
    arr.forEach((c) => { if (c && c.t && validCat(c.cat) && !CUSTOM.some((x) => x.cat === c.cat && x.t === c.t)) { CUSTOM.push({ cat: c.cat, t: String(c.t).slice(0, 40), d: String(c.d || "").slice(0, 90) }); added++; } });
    saveCustom(); renderCustom();
    await notify(added ? `${added} cards added! 🎉` : "No new cards found", added ? "" : "Maybe you already have all of them.");
  } catch (e) { await notify("Text not recognized", "Make sure you copied all of it, including the start 'mehamoten-cards:'."); }
}
function renderCustom() {
  $("#edCount").textContent = CUSTOM.length;
  const cols = { set: "var(--set)", style: "var(--style)", lang: "var(--lang)", body: "var(--body)" };
  $("#customList").innerHTML = CUSTOM.length ? CUSTOM.map((c, i) =>
    `<div class="crow"><div class="cc" style="background:${cols[c.cat] || "var(--set)"}"></div>
     <div class="ct"><b>${esc(c.t)}</b><span>${MM_CAT[c.cat] ? MM_CAT[c.cat].label : ""}${c.d ? " · " + esc(c.d) : ""}</span></div>
     <button class="del" data-act="delCustomCard" data-i="${i}" aria-label="Delete">✕</button></div>`).join("")
    : `<div class="emptyc">No cards of your own yet. Add the first one!</div>`;
}

/* ---------- זרימת משחק ---------- */
let guessRound = false, guessWin = false, hinterPick = null, gameActive = false;
let earRound = false, earRevealed = false, earNextAt = 0; const earCaught = new Set();
let miniRound = false, miniCueIdx = 0, miniExtra = 0, miniTopicShown = false;
async function startGame() {
  S.company = ($("#companyInput").value || "").trim().slice(0, 40);
  if (trialOver()) { save(); showOffer(true); return; } /* 2.6.3: הניסיון נוצל, לא מתחילים חימום */
  const ps = activeP();
  if (S.kids) { S.scored = false; S.packs = S.packs.filter((p) => p !== "guess"); if (!S.packs.length) S.packs = ["style", "lang", "body"]; }
  if (isLite()) S.mode = "auto"; /* במצב קליל המנחה הדיגיטלי מנהל, אין במאי */
  if (S.mode === "auto" && ps.length < 2) { await notify("Not enough players", "Auto mode needs at least 2 players with names."); return; }
  if (S.mode === "manual" && ps.length < 3) { await notify("Not enough players", "Manual mode needs at least 3 players (a director + 2 players)."); return; }
  const norm = ps.map((p) => p.replace(/\s+/g, " ").toLowerCase());
  if (new Set(norm).size !== norm.length) { toastMsg("Two players have the same name. Change one of them"); return; }
  S.scores = {}; S.dirCounts = {}; S.honors = {}; ps.forEach((p) => { S.scores[p] = 0; S.dirCounts[p] = 0; S.honors[p] = 0; });
  S.round = 0; S.directorIdx = 0; S.guessIdx = 0; S.earIdx = 0; S.miniIdx = 0; S.log = []; S.debriefPicked = []; S.debrief = null; S.startedAt = Date.now();
  guessRound = false; guessWin = false; earRound = false; miniRound = false; gameActive = true; S.inGame = true; clearDecks();
  S.ls = null; S.liteEv = null;
  bumpStat("games"); keepAwake(true); save();
  if (S.warm) warmOpen(); else if (isLite()) liteIntro(); else nextRound();
}
/* ---------- מצב קליל: פתיחה, במה, מי זה מי ---------- */
function liteIntro() {
  $("#liteIntroBody").innerHTML = MM_LITE_INTRO.map((t) => `<p>${esc(t)}</p>`).join("");
  show("liteIntro"); sfx.start();
  speak(MM_LITE_INTRO.join(" "), MM_LITE_INTRO.map((t, i) => "lite-intro-" + i)); /* 2.6.2: הפתיחה מוקלטת */
}
function liteGo() { nextRound(); }

/* ---------- חימום קבוצתי (2.6.0) ----------
   W.mode: "open" = לפני הסיבוב הראשון (סט קבוע של 3, משימה אחרת מאותו שלב), "mid" = משימה אחת מהתפריט, חזרה למסך הקודם.
   phase: ready (מקריאים ולוחצים התחילו) → run (טיימר) → done (עוד אחד / הבא). לא נשמר במכשיר: רענון חוזר ללוח. */
let W = null, wuIv = null;
function wuTask(id) { return MM_WARMUP.find((t) => t.id === id); }
function wuDrawItems(t) { const it = S.kids && t.kidsItems ? t.kidsItems : t.items; return it ? (t.ordered ? it.slice() : shuffleCopy(it)) : []; }
function wuSetTask(id) {
  const t = wuTask(id); W.task = t; W.items = wuDrawItems(t); W.ii = 0; W.phase = "ready"; W.left = t.secs; W.stage = -1; W.swapped = false; W.did = false;
}
function warmOpen() {
  wuClear();
  W = { mode: "open", list: MM_WARMUP_OPEN.slice(), i: 0, back: "" };
  try { pushGameState(); } catch (e) {}
  $("#wuBtns").dataset.k = ""; wuSetTask(W.list[0]); renderWu(); show("warmup"); sfx.start(); wuAnnounce();
}
function wuMenu() {
  wuClear();
  const btn = (t) => `<button class="wupick" data-act="wuPickOne" data-id="${t.id}"><span class="wi">${t.ic}</span><b>${esc(t.n)}</b><small>${MM_WARMUP_TIER[t.tier]}</small></button>`;
  $("#wuMid").innerHTML = MM_WARMUP_MID.map((id) => btn(wuTask(id))).join("");
  $("#wuAll").innerHTML = ["quiet", "pair", "group"].map((tr) =>
    `<div class="label">${MM_WARMUP_TIER[tr]}</div><div class="wulist">${MM_WARMUP.filter((t) => t.tier === tr).map(btn).join("")}</div>`).join("");
  $(".wuall").open = false;
  W = { mode: "mid", list: [], i: 0, back: currentScreen === "wuPick" || currentScreen === "warmup" ? (W && W.back) || "roundend" : currentScreen };
  show("wuPick");
}
function wuPickOne(id) {
  const back = W ? W.back : "roundend";
  W = { mode: "mid", list: [id], i: 0, back };
  $("#wuBtns").dataset.k = ""; wuSetTask(id); renderWu(); show("warmup"); sfx.start(); wuAnnounce();
}
function wuSurprise() {
  const ids = MM_WARMUP.filter((t) => t.id !== 20 && t.id !== 25).map((t) => t.id);
  wuPickOne(drawDeck("wumid", ids));
}
/* משימה אחרת: בפתיחה מאותו שלב (רק open:true), באמצע מכל המשימות */
function wuOther() {
  if (!W || W.phase === "run") return;
  const cur = W.task;
  const cands = MM_WARMUP.filter((t) => t.id !== cur.id && (W.mode === "mid" ? t.id !== 20 && t.id !== 25 : (t.open && t.tier === cur.tier && !W.list.includes(t.id))));
  if (!cands.length) return;
  const nx = cands[Math.floor(Math.random() * cands.length)];
  W.list[W.i] = nx.id; wuSetTask(nx.id); renderWu(); wuAnnounce();
}
function wuStages(t) {
  if (t.stagesFromItems) return W.items.slice(0, Math.max(1, Math.round(t.secs / 5)));
  return t.stages || null;
}
/* קול לחימום (2.6.2): קבצים wu-* מוקלטים ב-ElevenLabs (tools/gpt_voice). מה שלא הוקלט נשאר שקט. */
function wuItemKey(t, txt) {
  const i = (t.items || []).indexOf(txt); if (i >= 0) return `wu-${t.id}-i${i}`;
  const k = (t.kidsItems || []).indexOf(txt); return k >= 0 ? `wu-${t.id}-k${k}` : null;
}
function wuSay(seq, txt) { seq = seq.filter(Boolean); if (seq.length) speak(txt || "", seq); }
function wuAnnounce(itemOnly) {
  if (!W || !W.task) return; const t = W.task;
  const item = W.items.length && !t.stagesFromItems ? W.items[W.ii % W.items.length] : "";
  const seq = itemOnly ? [] : [W.mode === "open" && W.i === 0 ? "wu-lead" : "", "wu-how-" + t.id, t.pair ? "wu-pair" : ""];
  if (item) seq.push(wuItemKey(t, item));
  wuSay(seq, (itemOnly ? "" : t.n + ". " + t.how + " ") + item);
}
function wuStageKey(t, st, si) { return t.stagesFromItems ? wuItemKey(t, st[si]) : `wu-${t.id}-s${si}`; }
function wuTxt(el, v) { if (el.textContent !== v) el.textContent = v; }
function renderWu() {
  if (!W || !W.task) return;
  const t = W.task, open = W.mode === "open";
  $("#wuStep").textContent = (open ? `Warm-up ${W.i + 1} of ${W.list.length}` : "Warm-up") + " · " + MM_WARMUP_TIER[t.tier];
  $("#wuLead").hidden = !(open && W.i === 0 && W.phase === "ready");
  $("#wuName").textContent = t.ic + " " + t.n;
  const tags = (t.seat ? `<span>🪑 OK sitting</span>` : `<span>🧍 Better standing</span>`) + (t.secs ? `<span>⏱️ ${t.secs} seconds</span>` : "");
  if ($("#wuTags").dataset.h !== tags) { $("#wuTags").innerHTML = tags; $("#wuTags").dataset.h = tags; }
  wuTxt($("#wuHow"), t.how);
  const st = wuStages(t);
  const showItem = W.items.length && !t.stagesFromItems;
  wuTxt($("#wuItem"), showItem ? W.items[W.ii % W.items.length] : (t.stagesFromItems && W.phase !== "run" ? t.ic : (W.items.length ? "" : t.ic)));
  $("#wuItem").classList.toggle("emoji", !showItem);
  const stg = $("#wuStage");
  if (t.stagesFromItems && W.phase === "run" && st && W.stage >= 0) { wuTxt($("#wuItem"), st[Math.min(W.stage, st.length - 1)]); $("#wuItem").classList.remove("emoji"); wuTxt(stg, ""); stg.hidden = true; }
  else if (W.phase === "run" && st && W.stage >= 0) { wuTxt(stg, st[Math.min(W.stage, st.length - 1)]); stg.hidden = false; }
  else if (W.phase === "done" && t.end) { wuTxt(stg, t.end); stg.hidden = false; }
  else if (W.phase === "ready" && st && !t.stagesFromItems) { wuTxt(stg, st.join(" → ")); stg.hidden = false; stg.classList.add("dim"); }
  else { wuTxt(stg, ""); stg.hidden = true; }
  if (!(W.phase === "ready")) stg.classList.remove("dim");
  const tm = $("#wuTime");
  wuTxt(tm, W.phase === "run" && t.secs ? String(Math.max(0, Math.ceil(W.left))) : "");
  tm.hidden = !(W.phase === "run" && t.secs);
  $("#wuEx").hidden = !t.ex || W.phase === "run"; $("#wuEx").textContent = t.ex ? "For example: " + t.ex : "";
  $("#wuPair").hidden = !t.pair || W.phase === "run"; $("#wuPair").textContent = t.pair ? "👫 " + MM_WARMUP_PAIR : "";
  $("#wuNote").hidden = !t.note || W.phase === "run"; $("#wuNote").textContent = t.note || "";
  const last = !open || W.i >= W.list.length - 1;
  const nextLbl = open ? (last ? "To the first round! →" : "Next task →") : "Back to the game →";
  let b = "";
  if (W.phase === "ready") {
    b = (W.did ? `<button class="ghost" data-act="wuNext">${nextLbl}</button>` : `<button class="ghost" data-act="wuOther">🔄 Different task</button>`) + `<button class="big pulsego" data-act="wuStart">▶️ Start</button>`;
  } else if (W.phase === "run") {
    b = t.secs ? `<button class="ghost" data-act="wuStop">⏹️ We're done</button>` : `<button class="big" data-act="wuStop">🎉 We did it!</button>`;
  } else {
    b = (W.items.length > 1 && !t.stagesFromItems ? `<button class="ghost" data-act="wuMore">🔁 One more</button>` : `<button class="ghost" data-act="wuMore">🔁 Again</button>`) +
        `<button class="big" data-act="wuNext">${nextLbl}</button>`;
  }
  const bk = W.phase + "|" + (W.did ? 1 : 0) + "|" + W.i + "|" + t.id + "|" + W.mode; /* לא מחליפים כפתורים כל 200ms (לחיצה הולכת לאיבוד) */
  if ($("#wuBtns").dataset.k !== bk) {
    const hadFocus = $("#wuBtns").contains(document.activeElement);
    $("#wuBtns").innerHTML = b; $("#wuBtns").dataset.k = bk; W.lockUntil = Date.now() + 450; /* לחיצה כפולה לא מדלגת על מסך */
    if (hadFocus) { const f = $("#wuBtns .big") || $("#wuBtns button"); if (f) f.focus({ preventScroll: true }); }
  }
  $("#wuSkipBtn").textContent = open ? "Skip the warm-up" : "Back without warm-up";
  $("#wuSkipBtn").hidden = W.phase === "run" || (!open && W.did);
}
function wuClear() { if (wuIv) { clearInterval(wuIv); wuIv = null; } }
function wuStart() {
  if (!W || W.phase === "run" || Date.now() < (W.lockUntil || 0)) return;
  const t = W.task; ac();
  W.phase = "run"; W.left = t.secs; W.stage = -1; W.swapped = false; W.lastTick = -1;
  sfx.start();
  if (!t.secs) { renderWu(); return; } /* בלי טיימר: מחכים ל"הצלחנו!" */
  const st0 = wuStages(t), st = st0 && st0.length ? st0 : null, t0 = Date.now(), total = t.secs * 1000;
  if (st) { W.stage = 0; wuSay([wuStageKey(t, st, 0)], st[0]); } else stopVoice();
  renderWu();
  wuClear();
  wuIv = setInterval(() => {
    if (!W || W.phase !== "run") { wuClear(); return; }
    const el = Date.now() - t0; W.left = Math.max(0, (total - el) / 1000);
    if (st) { const si = Math.min(st.length - 1, Math.floor(el / (total / st.length))); if (si !== W.stage) { W.stage = si; sfx.hint(); wuSay([wuStageKey(t, st, si)], st[si]); } }
    if (t.swap && !W.swapped && el >= total / 2) {
      W.swapped = true; sfx.swap();
      if (W.items.length > 1) W.ii++;
      flashWu("Switch! 🔄");
      const nIt = W.items.length > 1 && !t.stagesFromItems ? W.items[W.ii % W.items.length] : "";
      wuSay(["wu-swap", nIt ? wuItemKey(t, nIt) : ""], "Switch! " + nIt);
    }
    const sec = Math.ceil(W.left);
    if (sec <= 3 && sec > 0 && sec !== W.lastTick) { W.lastTick = sec; sfx.tick(); }
    if (el >= total) { wuDone(); return; }
    renderWu();
  }, 200);
}
function flashWu(txt) {
  const f = document.createElement("div"); f.className = "wuflash"; f.setAttribute("role", "alert"); f.textContent = txt;
  $("#warmup").appendChild(f); setTimeout(() => f.remove(), 1600);
}
function wuDone() {
  wuClear(); if (!W) return;
  W.phase = "done"; W.left = 0; W.did = true;
  if (W.task.end) sfx.freeze(); else sfx.bell();
  wuSay([W.task.end ? `wu-${W.task.id}-end` : "wu-done"], W.task.end || "That's it! Well done.");
  renderWu();
}
function wuStop() { if (W && W.phase === "run") wuDone(); }
function wuMore() {
  if (!W || W.phase !== "done" || Date.now() < (W.lockUntil || 0)) return;
  if (W.items.length) { W.ii++; if (W.task.stagesFromItems) W.items = wuDrawItems(W.task); }
  W.phase = "ready"; W.stage = -1; W.swapped = false; renderWu(); wuAnnounce(true);
}
function wuNext() {
  if (!W || Date.now() < (W.lockUntil || 0)) return; wuClear();
  if (W.mode === "open" && W.i < W.list.length - 1) { W.i++; wuSetTask(W.list[W.i]); renderWu(); sfx.start(); wuAnnounce(); return; }
  wuFinish();
}
function wuSkip() { wuClear(); wuFinish(); }
function wuFinish() {
  wuClear(); stopVoice(); const w = W; W = null;
  if (!w || w.mode === "open") { if (isLite()) liteIntro(); else nextRound(); return; }
  show(w.back && $("#" + w.back) ? w.back : "roundend");
}
function wuBack() { const back = W && W.back; wuClear(); stopVoice(); W = null; show(back && $("#" + back) ? back : "roundend"); }
/* קלף הבמה הקליל: מקום + בעיה קטנה + מי זה מי. דמות 1 תמיד למי שמתחיל. */
function liteDraw() {
  const st = drawDeck("lite", MM_LITE_SET);
  S.ls = { place: st.place, prob: st.prob, roles: st.roles.slice(), lines: st.lines.slice() };
  S.set = [st.place, st.roles.join(" and "), st.lines[0]]; S.con = null; S.conCat = null;
  /* מי שמתחיל = דמות 1, השני = דמות 2 (בלי בחירה, בלי דיון) */
  const other = S.curPerf.find((p) => p !== S.starter) || S.curPerf[1] || "";
  S.ls.who = [S.starter, other]; S.liteEv = null;
  setupExtras(st);
  renderLiteScene(); show("liteScene"); sfx.start();
  /* במה שעוד לא הוקלטה: המנחה אומר רק "קדימה!" (משפט חצי מוקלט לא מושמע) */
  speak(`The stage: ${S.ls.place}. Go!`, voiceHas(S.ls.place) ? ["draw-a-1", S.ls.place, "draw-b-1"] : ["draw-b-1"]);
  save();
}
/* 2.6.3: שורה קצרה אחת על מה שיקרה באמצע הסיבוב (מסך הסצנה האחד) */
function liteCastNote() {
  const k = liteEventKind(S.round);
  if (k === "swap") return `🔔 In the middle you will hear <b>"Swap!"</b>: switch characters and continue from the same point.`;
  if (k === "task") return `🎯 In the middle, one of you gets a <b>small task</b> on the screen.`;
  if (k === "style") return `🎭 In the middle, one of you gets a <b>style</b> and plays it until the end.`;
  const x4 = (S.extra || []).find((x) => x.slot === 4);
  if (x4) return `🚪 Later on, <b>${esc(x4.who)}</b> comes in when the screen calls them. Other than that: just you, the place and the first line.`;
  return `🟢 A round with no interruptions: just you, the place and the first line.`;
}
/* 2.6.3: מסך אחד במקום "קלף" + "לפני הסצנה". הקול של השליפה נשאר, הקול של "לפני הסצנה" יורד (חזר על המקום). */
function renderLiteScene() {
  const L = S.ls; if (!L) return;
  $("#lsRnum").textContent = "Round " + S.round + " · Your stage";
  $("#lsCard").innerHTML = `<div class="band"><span class="lbl">📍 The stage</span></div><div class="body"><h3 class="t">${esc(L.place)}</h3><p class="d">${esc(L.prob)}</p></div>`;
  $("#lsWho").innerHTML = [0, 1].map((i) =>
    `<div class="lsrow${i ? "" : " first"}"><div class="lshead"><span class="tag">${i ? "Answers" : "Starts"}</span><b class="wn">${esc(L.who[i])}</b><span class="wr">${esc(L.roles[i])}</span></div>` +
    `<div class="wl">"${esc(L.lines[i])}"</div></div>`).join("") + extraRowsHTML();
  $("#lsNote").innerHTML = liteCastNote();
}
function liteSwapRoles() {
  const L = S.ls; if (!L) return;
  L.who = [L.who[1], L.who[0]]; S.starter = L.who[0]; save();
  const pc = $("#playCards"); if (pc) pc.innerHTML = litePlayCards();
}
function litePlayCards() {
  const L = S.ls, ev = S.liteEv;
  return `<div class="scard set"><div class="k">📍 The stage</div><div class="v">${esc(L.place)}</div><div class="vd">${esc(L.prob)}</div></div>` +
    `<div class="scard lite"><div class="k">🎭 Who is who</div><div class="v who2s"><span><b>${esc(L.who[0])}</b> ${esc(L.roles[0])}</span><span><b>${esc(L.who[1])}</b> ${esc(L.roles[1])}</span></div>` +
    (ev && ev.fired && ev.kind === "swap" ? `<div class="vd">You switched characters. Continue from the same point.</div>` : `<div class="plines"><div><b>${esc(L.who[0])}</b> starts: ${esc(L.lines[0])}</div><div><b>${esc(L.who[1])}</b> answers: ${esc(L.lines[1])}</div></div>`) + `</div>` +
    extrasCardHTML() + (ev && ev.fired && (ev.kind === "task" || ev.kind === "style") ? `<div class="scard task"><div class="k">${ev.kind === "style" ? "🎭 Style" : "🎯 Task"} for ${esc(ev.who)}</div><div class="v">${esc(ev.text)}</div><div class="vd">${esc(ev.other)} continues as normal</div></div>` : "");
}
/* האירוע היחיד של הסיבוב: החלפת דמויות (תמיד פעם אחת, באמצע) או משימה אישית (ב-120 שניות: שתיים, 40% ו-70%). */
function scheduleLiteEvent() {
  if (!sceneRunning || paused || !isLite() || guessRound || earRound || miniRound) return;
  const kind = liteEventKind(S.round); if (!kind) return;
  if (!S.liteEv) S.liteEv = { kind, fired: 0, max: kind === "task" && S.sceneLen >= 120 ? 2 : 1 };
  const ev = S.liteEv; if (ev.fired >= ev.max) return;
  const at = ev.max === 2 ? (ev.fired === 0 ? .4 : .7) : .5;
  const delay = Math.max(1, S.sceneLen * at - elapsed + (Math.random() * 6 - 3));
  if (swapT) clearTimeout(swapT);
  swapT = setTimeout(() => {
    if (!sceneRunning || paused) return; if (S.sceneLen - elapsed <= 12) return;
    fireLiteEvent(); if (ev.fired < ev.max) scheduleLiteEvent();
  }, delay * 1000);
}
/* 2.5.0: עצירה קצרה אחרי אירוע, כדי שיספיקו להבין מה השתנה לפני שממשיכים (השעון עומד) */
let holdT = null;
function liteHoldSoon(sec, msg) { setTimeout(() => { if (sceneRunning && !paused) liteHold(sec, msg); }, 1600); }
function liteHold(sec, msg) {
  if (!sceneRunning || paused) return;
  togglePause(); const b = $("#pausedBanner"); let n = sec; b.textContent = `${msg} · ${n}`;
  holdT = setInterval(() => {
    n--;
    if (n <= 0) { clearInterval(holdT); holdT = null; b.textContent = "⏸️ Paused"; if (paused) togglePause(); }
    else b.textContent = `${msg} · ${n}`;
  }, 1000);
}
function fireLiteEvent() {
  const ev = S.liteEv, L = S.ls; if (!ev || !L) return; ev.fired++;
  if (ev.kind === "swap") {
    S.rings++; bumpStat("swaps"); liteSwapRoles();
    $("#flashTxt").textContent = "Swap!"; $("#ringcount").textContent = `🔔 You switched characters: ${L.who[0]} = ${L.roles[0]} · ${L.who[1]} = ${L.roles[1]}`;
    flashSwap(false); sfx.swap(); speak("Swap!");
  } else {
    const isStyle = ev.kind === "style";
    const who = rand(L.who), other = L.who.find((p) => p !== who) || "";
    ev.who = who; ev.other = other; ev.text = isStyle ? drawDeck("litestyle", MM_LITE_STYLE) : drawDeck("litetask", MM_LITE_TASK); S.tasks = (S.tasks || 0) + 1;
    $("#flashTxt").textContent = `${isStyle ? "Style" : "Task"} for ${who}!`; $("#ringcount").textContent = `${isStyle ? "🎭" : "🎯"} ${who}: ${ev.text}`;
    flashSwap(true); sfx.topic(); speak(isStyle ? "New style!" : "New task!", [isStyle ? "lite-style" : "lite-task"]);
    const pc = $("#playCards"); if (pc) pc.innerHTML = litePlayCards();
  }
  liteHoldSoon(ev.kind === "swap" ? 7 : 5, ev.kind === "swap" ? "🔄 Switching characters, take a moment" : "👀 Read the screen, take a moment");
  save();
}
/* 2.6.6: how many go on stage (2/3/4). Kids mode: always 2 */
function stageN() { return S.kids ? 2 : ([2, 3, 4].includes(+S.stage) ? +S.stage : 2); }
function rolesForRound() {
  const ps = activeP(), n = ps.length, want = stageN();
  if (S.mode === "auto") { const perf = []; for (let k = 0; k < n && perf.length < want; k++) { const c = ps[(S.directorIdx + k) % n]; if (!perf.includes(c)) perf.push(c); } return { dir: "", perf }; }
  const dir = ps[S.directorIdx % n], perf = []; let k = 1;
  while (perf.length < want && k <= n) { const c = ps[(S.directorIdx + k) % n]; if (c !== dir && !perf.includes(c)) perf.push(c); k++; }
  return { dir, perf };
}
/* 2.6.6: role 3 and role 4 for every card (MM_EXTRAS). Key: place + characters (full/industry), place (lite) */
let EXTRA_MAP = null;
function extraKey(c) { return Array.isArray(c) ? "s|" + c[0] + "|" + c[1] : (c && c.place ? "l|" + c.place : ""); }
function extrasFor(card) {
  if (!EXTRA_MAP) {
    EXTRA_MAP = new Map(); const add = (c, e) => { if (c && e) EXTRA_MAP.set(extraKey(c), e); };
    if (typeof MM_EXTRAS === "object") {
      MM_LITE_SET.forEach((c, i) => add(c, (MM_EXTRAS.lite || [])[i]));
      MM_DATA.set.forEach((c, i) => add(c, (MM_EXTRAS.set || [])[i]));
      for (const k in MM_INDUSTRY) MM_INDUSTRY[k].cards.forEach((c, i) => add(c, (MM_EXTRAS[k] || [])[i]));
    }
  }
  return card ? EXTRA_MAP.get(extraKey(card)) || null : null;
}
/* Gives players 3 and 4 the card's extra roles. A card with no extra roles (your own card): only 2 go on stage */
function setupExtras(card) {
  S.extra = []; const more = S.curPerf.slice(2); if (!more.length) return;
  const ex = extrasFor(card);
  if (!ex) { S.curPerf = S.curPerf.slice(0, 2); toastMsg("This card has no extra roles, so only 2 go on stage"); return; }
  more.forEach((p, i) => { const r = ex[i]; if (r) S.extra.push({ who: p, slot: i + 3, r: r[0], g: r[1], l: r[2], on: i === 0 }); });
}
function extraRowsHTML() {
  return (S.extra || []).map((x) =>
    `<div class="lsrow extra${x.on ? "" : " later"}"><div class="lshead"><span class="tag">${x.slot === 3 ? "Role 3 · from the start" : "Role 4 · comes in later"}</span><b class="wn">${esc(x.who)}</b><span class="wr">${esc(x.r)}</span></div>` +
    `<div class="wg">🎯 ${esc(x.g)}</div><div class="wl">"${esc(x.l)}"</div></div>`).join("");
}
function extrasCardHTML() {
  if (!S.extra || !S.extra.length) return "";
  return `<div class="scard extra"><div class="k">➕ Also on stage</div>` + S.extra.map((x) =>
    `<div class="xrow${x.on ? "" : " later"}"><b>${esc(x.who)}</b> ${esc(x.r)}<span class="xg">${x.on ? "🎯 " + esc(x.g) + ' · "' + esc(x.l) + '"' : "⏳ Comes in later, when the screen calls them"}</span></div>`).join("") +
    `<div class="vd">Extra role: say your line, then listen. Speak again when someone talks to you, or when your goal needs it.</div></div>`;
}
function refreshPlayCards() { const pc = $("#playCards"); if (!pc) return; pc.innerHTML = (isLite() && S.ls) ? litePlayCards() : fullPlayCards(); }
/* Role 4 comes in at 30% of the scene (in Lite mode, before the mid-scene event). The screen call is the signal; the sound only plays if sounds are on */
function extraTick() {
  if (guessRound || earRound || miniRound || !S.extra) return;
  const x = S.extra.find((e) => !e.on); if (!x || elapsed < Math.round(S.sceneLen * 0.3)) return;
  x.on = true;
  $("#flashTxt").textContent = `${x.who}, come in now!`; $("#ringcount").textContent = `🚪 ${x.who} comes in: ${x.r}. "${x.l}"`;
  flashSwap(false); sfx.topic(); speak(`${x.who}, come in now!`);
  refreshPlayCards(); save();
}
function nextRound() {
  gameActive = true; S.inGame = true; keepAwake(true);
  if (trialOver()) { save(); showOffer(); return; }
  if (!licActive()) trialSpend(); /* נספר כבר בהתחלה */
  S.round++; const { dir, perf } = rolesForRound();
  S.curDir = dir; S.curPerf = perf; S.starter = rand(perf.slice(0, 2)); S.extra = [];
  $("#introRnum").textContent = "Round " + S.round + (S.company ? " · " + S.company : ""); renderLogo();
  $("#introPerf").textContent = perf.join("  •  ");
  if (S.mode === "manual") { $("#introDirLine").hidden = false; $("#introDir").textContent = dir; $("#introWho").textContent = dir + ", you are the director"; }
  else { $("#introDirLine").hidden = true; $("#introWho").textContent = "The host is ready"; }
  show("intro"); speak(persona().intro(perf.join(" and ")), [personaKey() + "-intro-1", personaKey() + "-intro-2"]); save();
}
function buildCard(cat, card) {
  return `<div class="gcard ${cat} b-${cat}">
    <div class="band"><span class="cdot"></span><span class="lbl">${MM_CAT[cat].label}</span><span class="ic">${MM_CAT[cat].ic}</span></div>
    <div class="body"><h3 class="t">${esc(card[0])}</h3><div class="rule"></div><p class="d">${esc(card[1])}</p>
    <div class="wm" aria-hidden="true">${MM_CAT[cat].ltr}</div><div class="foot">Mehamoten</div></div></div>`;
}
/* מסביר במילים פשוטות מה כתוב על הקלפים ומה קורה עכשיו (למי שמשחק בפעם הראשונה) */
const CON_HOW = {
  style: "play <b>the whole scene</b> in this style",
  lang: "talk like this for <b>the whole scene</b>",
  body: "keep it in your body for <b>the whole scene</b>"
};
function renderDrawGuide(cat) {
  const g = $("#drawGuide"); if (!g || !S.set || !S.con) return;
  const how = CON_HOW[cat] || "play by it for <b>the whole scene</b>";
  const ex = typeof MM_CON_EXPLAIN === "object" ? MM_CON_EXPLAIN[S.con[0]] : null;
  g.innerHTML =
    `<div class="gl"><span class="gi">📍</span><span><b>The stage:</b> the scene happens at <b>${esc(S.set[0])}</b>. Who you are: ${esc(S.set[1])}.</span></div>` +
    `<div class="gl"><span class="gi">${MM_CAT[cat] ? MM_CAT[cat].ic : "🎭"}</span><span><b>The twist: ${esc(S.con[0])}.</b> The characters stay from the stage card. The twist decides <b>how</b> you play them: ${how}.` +
      (ex ? `<span class="ex"><b>What it means:</b> ${esc(ex[0])}</span><span class="ex"><b>For example:</b> ${esc(ex[1])}</span>` : `<span class="ex">${esc(S.con[1])}</span>`) +
    `</span></div>` +
    `<div class="gl next"><span class="gi">👉</span><span>Not playing yet. Press <b>"Continue"</b> to see who goes on stage and who starts. Don't like the cards? <b>"Draw again"</b>.</span></div>`;
}
function drawCards() {
  earRound = false; miniRound = false; S.extra = [];
  if (isLite()) {
    guessRound = false; guessWin = false;
    { const r = rolesForRound(); S.curDir = r.dir; S.curPerf = r.perf; S.extra = []; if (!S.curPerf.slice(0, 2).includes(S.starter)) S.starter = rand(S.curPerf.slice(0, 2)); }
    if (liteBreaker(S.round)) { if (activeP().length < 3) setupMiniRound("emo"); else if ((S.round / 4) % 2 === 0) setupMiniRound("story"); else setupGuessRound(); return; } /* 2.6.6: breaker alternates: guess, story */
    liteDraw(); return;
  }
  const packs = S.kids ? S.packs.filter((p) => p !== "guess") : S.packs;
  const cat = rand(packs.length ? packs : ["style", "lang", "body"]);
  if (cat === "guess") { setupGuessRound(); return; }
  if (cat === "ear") { setupEarRound(); return; }
  if (MINI[cat]) { setupMiniRound(cat); return; }
  guessRound = false; guessWin = false;
  { const r = rolesForRound(); S.curDir = r.dir; S.curPerf = r.perf; S.extra = []; if (!S.curPerf.slice(0, 2).includes(S.starter)) S.starter = rand(S.curPerf.slice(0, 2)); }
  S.set = drawDeck("set", pool("set")); setupExtras(S.set); S.conCat = cat; S.con = drawDeck(cat, pool(cat));
  $("#drawRnum").textContent = "Round " + S.round + " · Your stage and twist";
  $("#drawCards").innerHTML = buildCard("set", S.set) + buildCard(cat, S.con);
  renderDrawGuide(cat);
  applyHintsVis(); show("draw"); sfx.start(); speak(persona().draw(S.set[0], S.con[0]), ["draw-a-1", S.set[0], "draw-a-2", S.con[0], "draw-b-1"]);
  if (S.settings.tts && S.settings.voice !== "tts" && typeof MMV === "object") MMV.prefetch([S.set[1]], S.settings.persona); /* התפקיד של המסך הבא */
}
function goCast() {
  if (isLite() && S.ls) { show("liteScene"); return; } /* 2.6.3: במצב קליל אין מסך "לפני הסצנה" */
  $("#castNote").hidden = true; $("#castCon").hidden = false;
  { const cw = $("#castWho"); const xr = extraRowsHTML(); cw.innerHTML = xr; cw.hidden = !xr; }
  $("#castPlace").textContent = S.set[0]; $("#castRel").textContent = S.set[1]; $("#castStarter").textContent = S.starter;
  $("#castCon").textContent = "The twist: " + S.con[0] + " · " + S.con[1];
  const seed = $("#castSeed");
  if (S.level === "easy") { seed.hidden = false; $("#castSeedTxt").textContent = '"' + rand(MM_OPENERS) + '"'; } else seed.hidden = true;
  show("cast"); speak(persona().frame(S.set[0], S.set[1], S.starter), ["frame-a-1", S.set[1], "frame-a-2", S.set[0]]);
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
  $("#earRnum").textContent = "Round " + S.round + " · The Earpiece";
  $("#earListenerName").textContent = S.earListener; $("#earAgentName").textContent = S.earAgent;
  $("#earEvery").textContent = earEvery(); renderEarSet();
  show("earIntro"); sfx.start();
  speak(`Earpiece round! ${S.earListener}, turn your back to the screen. ${S.earAgent}, you are the agent.`);
}
function renderEarSet() {
  $("#earSetCard").innerHTML = `<div class="scard set"><div class="k">📍 The scene</div><div class="v">${esc(S.set[0])}</div><div class="vd">${esc(S.set[1])}</div></div>`;
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
  if (S.ear.missions.length >= earCount() + 3) { toastMsg("That's enough tasks for one round 🙂"); return; }
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
  $("#earRevealTitle").textContent = `${S.earListener}, turn around! 🔄`;
  $("#earRevealSub").textContent = `There were ${ms.length} secret tasks. Guess what they were, then reveal.` + (skipped ? ` (${skipped} were skipped too fast and don't count)` : "");
  $("#earList").innerHTML = ms.map((m, i) => `<button class="earitem blurred" data-ec="${i}" aria-pressed="false">
    <span class="n">${i + 1}</span><span class="tx"><b>${esc(m[0])}</b><small>${esc(m[1])}</small></span><span class="st">🎯 Caught</span></button>`).join("");
  $("#earRevealBtn").hidden = false; $("#earTapHint").hidden = true; $("#earContinueBtn").hidden = true;
  sfx.end(); speak(`Time's up! ${S.earListener}, turn around. What were the tasks?`);
  show("earReveal");
}
function earReveal() {
  earRevealed = true; $$("#earList .earitem").forEach((b) => b.classList.remove("blurred"));
  $("#earRevealBtn").hidden = true; $("#earTapHint").hidden = false; $("#earContinueBtn").hidden = false; sfx.bell();
}
function toggleEarCaught(btn) {
  if (!earRevealed) { toastMsg("Guess first, then reveal 👀"); return; }
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
  if (S.scored) showBoard(`Round ${S.round} is over`);
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
  emo: { label: "Remote control emotions", ic: "🎚️", need: 2,
    roles: (p) => `🎭 <b>${esc(p[0])}</b> and <b>${esc(p[1])}</b> · everyone sees the screen`,
    how: ["You get a simple scene and start playing.", "The screen gives each of you an emotion, and every beep changes it. Continue from the same point, just with the new emotion.", "Near the end, it gets faster."],
    topic: () => { const s = drawDeck("set", pool("set")); return { k: "📍 The scene", v: s[0], d: s[1] }; },
    cues: () => accelCues(0, S.sceneLen * .3),
    guide: "Let the emotion change how you say things, not what happens 🎚️",
    card(i, p) {
      if (i > 0 && i % 3 === 2) return { k: "🎚️ Shared moment", v: drawDeck("emoboth", MM_EMO_BOTH), d: "" };
      const E = kp(MM_EMO), a = drawDeck("emo", E); let b = drawDeck("emo", E); if (b === a) b = drawDeck("emo", E);
      return { k: i === 0 ? "🎚️ Your emotion" : "🎚️ Emotion change!", rows: [[p[0], a], [p[1] || "", b]] };
    } },
  line: { label: "Line from the screen", ic: "📜", need: 2,
    roles: (p) => `🎭 <b>${p.map(esc).join("</b> and <b>")}</b> · everyone sees the screen`,
    how: ["Play a normal scene.", "Suddenly, ding: the screen picks a player and a line they must say now, and make it fit the story.", "Near the end, the dings come faster."],
    topic: () => { const s = drawDeck("set", pool("set")); return { k: "📍 The scene", v: s[0], d: s[1] }; },
    cues: () => accelCues(Math.round(S.sceneLen * .12), S.sceneLen * .28),
    guide: "On the ding: say the line within 5 seconds, and make it make sense 📜",
    idle: { k: "📜 Line from the screen", v: "Wait for the ding…", d: "" },
    card(i, p) { const who = p[i % p.length]; return { k: `📜 ${who} must say now:`, v: "“" + drawDeck("line", kp(MM_LINES)) + "”", d: "", ding: true }; } },
  heads: { label: "Three heads", ic: "🧠", need: 3,
    roles: (p) => `🧠 <b>${p.map(esc).join("</b>, <b>")}</b> are one expert. Each says one word in turn`,
    how: ["Stand in a line, shoulder to shoulder. You are one expert with several heads.", "Answer the question word by word: each head says one word, in turn.", "Every few seconds the screen adds a new rule to the answer."],
    topic: () => ({ k: "🧠 The question for the expert", v: drawDeck("headsq", kp(MM_HEADS_Q)), d: "" }),
    cues: () => fixedCues(20, 20),
    guide: "One word at a time. Don't plan, build on what the last head gave 🧠",
    idle: { k: "🧠 Rules", v: "Answer word by word", d: "A new rule comes with a beep" },
    card() { return { k: "🧠 New rule!", v: drawDeck("headsr", MM_HEADS_RULES), d: "" }; } },
  dub: { label: "Subtitles", ic: "🎬", need: 3,
    roles: (p) => p.length >= 3
      ? `🙉 <b>${esc(p[0])}</b> and <b>${esc(p[1])}</b>: the movie actors, backs to the screen, speaking gibberish<br>🎬 <b>${esc(p[2])}</b>: the translator, facing the screen`
      : `🙉 <b>${esc(p[0])}</b>: the movie actor, back to the screen, speaking gibberish<br>🎬 <b>${esc(p[1])}</b>: the translator, facing the screen`,
    how: ["The movie actors speak a made-up language, with lots of feeling.", "The translator tells the audience what they are 'saying'.", "Every few seconds the screen shows a new fact, and the translator must make it true in the scene."],
    topic: () => { const s = drawDeck("set", pool("set")); return { k: "📍 The movie", v: s[0], d: s[1] }; },
    cues: () => fixedCues(10, 22),
    guide: "Translator: slip the fact into the translation. Actors: just go with it 🎬",
    idle: { k: "🎬 Subtitles", v: "The movie starts…", d: "First fact in a moment" },
    card() { return { k: "🎬 The new truth, for the translator:", v: drawDeck("dub", MM_DUB_FACTS), d: "" }; } },
  story: { label: "Sentence by sentence story", ic: "📖", need: 5,
    roles: (p) => `📖 Stand in a line, in this order: ` + p.map((x, i) => `<b>${i + 1}. ${esc(x)}</b>`).join(" · "),
    how: ["Stand in a line in the order on the screen, and start from the story on the card.", "Each person says one sentence, and continues exactly where the last person stopped.", "At every beep the screen adds a change to the story, and whoever's turn it is puts it in right away."],
    topic() { const t = S.kids ? drawDeck("storykt", MM_STORY_KIDS_TOPICS) : drawDeck("storyt", MM_LITE_SET); return { k: "📖 Your story starts here", v: t.place, d: `${t.prob} The first person in line starts: "Once upon a time..."` }; },
    cues: () => [0.22, 0.45, 0.7].map((f) => Math.round(S.sceneLen * f)),
    guide: "Listen to the sentence before you. Stuck? Start with \"And because of that...\" 📖",
    idle: { k: "📖 One sentence each", v: "Continue from where the last person stopped", d: "The first change comes with a beep" },
    card(i) {
      const tw = () => ({ k: "🔀 Twist!", v: drawDeck(S.kids ? "storytwk" : "storytw", S.kids ? MM_STORY_KIDS_TWIST : MM_STORY_TWIST), d: "Whoever's turn it is, put it in now" });
      const nw = () => ({ k: "🚪 Something new!", v: drawDeck(S.kids ? "storynwk" : "storynw", S.kids ? MM_STORY_KIDS_NEW : MM_STORY_NEW), d: "Whoever's turn it is, put it in now" });
      if (i === 0) return tw(); if (i === 1) return nw();
      return { k: "🏁 Wrap up the story!", v: drawDeck("storyend", MM_STORY_END), d: "Every sentence now moves toward the end" };
    } },
  expert: { label: "Fake expert", ic: "🎓", need: 3, secret: true,
    roles: (p) => `🙉 <b>${esc(p[0])}</b>: the expert, back to the screen<br>🎤 <b>${p.slice(1).map(esc).join("</b> and <b>")}</b>: interviewers, facing the screen`,
    how: ["The expert doesn't know what they are an expert in. Everyone else can see it.", "The interviewers ask very serious questions, without saying the field.", "Twice the screen gives a hint, and the interviewers read it out loud. At the end: who were you?"],
    topic() { const e = drawDeck("expert", MM_EXPERT); S.mini.expert = e; return { k: "🎓 The expert is… (don't show!)", v: e.t, d: "" }; },
    cues: () => [Math.round(S.sceneLen * .45), Math.round(S.sceneLen * .7)],
    guide: "Expert: talk with full confidence, even if you have no idea 🎓",
    card(i) { const h = S.mini.expert.h[i]; return h ? { k: "💡 Hint! Interviewers, read out loud:", v: h, d: "" } : null; } }
};
function setupMiniRound(g) {
  const G = MINI[g], ps = activeP(), n = ps.length, st = (S.miniIdx || 0) % n;
  const rot = ps.slice(st).concat(ps.slice(0, st));
  S.mini = { g, perf: rot.slice(0, Math.min(G.need, n)), shown: 0 };
  S.curDir = ""; S.curPerf = S.mini.perf.slice(); S.starter = S.curPerf[0];
  S.mini.topic = G.topic();
  miniRound = true; earRound = false; guessRound = false; guessWin = false; save();
  $("#miniRnum").textContent = "Round " + S.round + " · " + G.label;
  $("#miniTitle").textContent = G.ic + " " + G.label;
  $("#miniRoles").innerHTML = G.roles(S.mini.perf);
  $("#miniHow").innerHTML = G.how.map((t) => `<p>${esc(t)}</p>`).join("");
  renderMiniTopic(); show("miniIntro"); sfx.start();
  speak(`${G.label}! ${S.mini.perf.join(" and ")}, to the stage.`);
}
function renderMiniTopic() {
  const G = MINI[S.mini.g], t = S.mini.topic; miniTopicShown = !G.secret;
  $("#miniTopic").innerHTML = `<div class="scard set minitopic ${G.secret ? "blurred" : ""}" ${G.secret ? 'data-act="miniShowTopic" role="button" tabindex="0"' : ""}>
    <div class="k">${esc(t.k)}</div><div class="v">${esc(t.v)}</div>${t.d ? `<div class="vd">${esc(t.d)}</div>` : ""}
    ${G.secret ? `<div class="tapshow">👆 Is the expert's back turned? Tap to show</div>` : ""}</div>`;
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
  if (manual && miniCueIdx >= cues.length) { if (S.mini.g === "expert" || miniExtra >= 4) { toastMsg(S.mini.g === "expert" ? "No more hints 🙂" : "That's enough for one round 🙂"); return; } miniExtra++; }
  const c = G.card(S.mini.shown, S.mini.perf); if (!c) { toastMsg("No more hints 🙂"); return; }
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
  $("#miniRevealTitle").textContent = `${S.mini.perf[0]}, turn around! Who were you? 🎓`;
  $("#miniRevealCard").classList.add("blurred"); $("#miniRevealVal").textContent = S.mini.expert.t;
  $("#miniRevealBtn").hidden = false; $("#miniVerdict").hidden = true;
  sfx.end(); speak(`Time's up! ${S.mini.perf[0]}, what are you an expert in?`);
  show("miniReveal");
}
function miniRevealExpert() { $("#miniRevealCard").classList.remove("blurred"); $("#miniRevealBtn").hidden = true; $("#miniVerdict").hidden = false; sfx.bell(); }
function miniExpertDone(win) {
  if (!miniRound || currentScreen !== "miniReveal") return;
  const ex = S.mini.perf[0];
  if (win) { miniConfetti(); sfx.bell(); if (S.scored) S.scores[ex] = (S.scores[ex] || 0) + 2; }
  logRound({ type: "mini", game: "expert", title: S.mini.expert.t, perf: S.mini.perf.slice(), win: !!win, secs: Math.min(elapsed, S.sceneLen) });
  miniRound = false; advanceRound();
  if (S.scored) showBoard(`Round ${S.round} is over`); else roundEnd2();
}
function miniLogLine(r) {
  const G = MINI[r.game] || { ic: "🎲", label: r.game };
  return `${G.ic} ${G.label}: ${r.title}` + (r.game === "expert" ? ` · ${r.perf[0]} ${r.win ? "guessed it" : "didn't guess"}` : ` · ${r.perf.join(" and ")}`);
}

/* ---------- סיבוב ניחוש ---------- */
function setupGuessRound() {
  const g = drawDeck("guess", MM_GUESS); const secret = drawDeck("guess_s:" + g.t, g.s);
  const ps = activeP();
  S.guesser = ps[S.guessIdx % ps.length];
  S.curDir = ""; S.curPerf = ps.filter((p) => p !== S.guesser); if (S.curPerf.length) S.starter = S.curPerf[0];
  S.guess = { t: g.t, d: g.d, k: g.k, secret }; guessRound = true; guessWin = false; save();
  $("#guessRnum").textContent = "Round " + S.round + " · Guess";
  $("#guessTitle").textContent = g.t; $("#guessGuesser").textContent = S.guesser; $("#guessGuesser2").textContent = S.guesser;
  $("#secretKind").textContent = "🕵️ " + g.k; $("#secretVal").textContent = secret; $("#secretDesc").textContent = g.d;
  $("#secretCard").classList.add("blurred");
  show("guessIntro"); sfx.start();
  speak(`Guessing round! ${S.guesser}, don't look at the screen! Everyone else, take a secret look.`, ["guess-intro-1", "guess-intro-2"]);
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
  $("#guessResult").textContent = win ? `${S.guesser} got it right!` : "Time's up!";
  $("#guessResultSub").textContent = `The secret was: ${S.guess.secret}` + (win ? "" : ". Maybe next time 😅");
  if (win) { sfx.bell(); miniConfetti(); speak(`${S.guesser} got it right! Well done!`, ["guess-win-2"]); if (S.scored) S.scores[S.guesser] = (S.scores[S.guesser] || 0) + 2; }
  else { sfx.end(); speak(`Time's up! The secret was: ${S.guess.secret}`, ["guess-lose-1", S.guess.secret]); }
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
  if (S.scored) showBoard(`Round ${S.round} is over`);
  else roundEnd2();
}

/* ---------- ספירה לאחור → סצנה ---------- */
let countdownRunning = false, countIv = null;
function beginCountdown() {
  if (countdownRunning || sceneRunning) return; countdownRunning = true; prepWatch(null);
  ac(); let n = 3; const ov = $("#count"), el = $("#countN");
  ov.classList.add("go"); el.textContent = n; el.classList.add("pop"); sfx.count(); speak("Three");
  countIv = setInterval(() => {
    n--; el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
    if (n > 0) { el.textContent = n; sfx.count(); speak(n === 2 ? "Two" : "One"); }
    else { el.textContent = "Action!"; sfx.start(); speak("Action!"); clearInterval(countIv); countIv = null; setTimeout(() => { ov.classList.remove("go"); if (!countdownRunning) return; countdownRunning = false; startScene(); }, 700); }
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
  /* טאבלט/אפליקציה שנשארו פתוחים לילה שלם: שואלים גם בלי טעינה מחדש */
  if (groupIsStale() && !(sceneRunning && !paused) && !document.querySelector("#dlg.open")) { askStaleGroup(); return; }
  if (gameActive) keepAwake(true);
  if (sceneRunning && !paused) { elapsed = Math.round((Date.now() - sceneStart) / 1000); updateClock(); if (elapsed >= S.sceneLen) endScene(); }
});
function pushGameState() { try { if (!history.state || !history.state.mm) history.pushState({ mm: 1 }, ""); } catch (e) {} }
window.addEventListener("popstate", () => { if (gameActive && currentScreen !== "home") { pushGameState(); confirmHome(); } });
const KEYHINT_DEFAULT = "Keyboard: Space = swap · T = twist · H = hint · P = pause · E = end";
function setKeyHint() {
  const el = $("#keyHint"); if (!el) return;
  el.textContent = miniRound ? "Keyboard: Space = next now · P = pause · E = end"
    : earRound ? "Keyboard: Space = next task · P = pause · E = end"
    : guessRound ? "Keyboard: " + (S.settings.hints ? "H = hint · " : "") + "P = pause · E = end"
    : isLite() ? "Keyboard: H = hint · P = pause · E = end" : KEYHINT_DEFAULT;
}
function startScene() {
  pushGameState();
  (S.extra || []).forEach((x) => { x.on = x.slot === 3; }); elapsed = 0; sceneStart = Date.now(); S.rings = 0; S.topics = 0; S.freezes = 0; S.tasks = 0; S.liteEv = null; sceneRunning = true; paused = false; setPausedUI(false);
  if (miniRound) {
    const G = MINI[S.mini.g], t = S.mini.topic;
    S.miniIdx = (S.miniIdx || 0) + 1; S.mini.shown = 0; S.mini.cues = G.cues(); miniCueIdx = 0; miniExtra = 0;
    $("#playCards").innerHTML =
      `<div class="scard set"><div class="k">${esc(t.k.replace(" (don't show!)", ""))}</div><div class="v">${esc(t.v)}</div>${t.d ? `<div class="vd">${esc(t.d)}</div>` : ""}</div>` +
      `<div class="earmission minicard" id="miniCard">${G.idle ? miniCardHTML(G.idle) : ""}</div>`;
    $("#playPerf").innerHTML = G.roles(S.mini.perf);
    $("#playGuide").textContent = G.guide;
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = true; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = false;
    $("#miniNextBtn").textContent = S.mini.g === "expert" ? "💡 Hint now" : "⏭️ Next now";
  } else if (earRound) {
    S.earIdx = (S.earIdx || 0) + 1; S.ear.missions = []; earNextAt = 0;
    $("#playCards").innerHTML =
      `<div class="scard set"><div class="k">📍 The scene</div><div class="v">${esc(S.set[0])}</div><div class="vd">${esc(S.set[1])}</div></div>` +
      `<div class="earmission" id="earMission"><div class="k">🎧 Secret task <span id="earNum">1</span></div><div class="v" id="earTitle"></div><div class="vd" id="earDesc"></div></div>`;
    $("#playPerf").innerHTML = `🙉 <b>${esc(S.earListener)}</b> back turned · 🎧 <b>${esc(S.earAgent)}</b> the agent`;
    $("#playGuide").textContent = "Agent: slip the task into the talk without getting caught! Audience: quiet, don't give it away 🤫";
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = true; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = false; $("#miniCtrl").hidden = true;
  } else if (guessRound) {
    S.guessIdx++; save();
    $("#playCards").innerHTML = `<div class="scard guess"><div class="k">🕵️ Guess · ${esc(S.guess.k)}</div><div class="v">${esc(S.guess.t)}</div><div class="vd">${esc(S.guess.d)}</div></div>`;
    $("#playPerf").innerHTML = `<b>${esc(S.guesser)}</b> guesses · everyone else gives hints`;
    $("#playGuide").textContent = "Give hints freely. Just never say the secret!";
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = true; $("#guessCtrl").hidden = false; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = true;
  } else if (isLite() && S.ls) {
    $("#playCards").innerHTML = litePlayCards();
    $("#playPerf").textContent = S.curPerf.join("  •  ");
    $("#playGuide").textContent = "You don't need to be funny. Just talk to each other like you are really there.";
    $("#manualCtrl").hidden = true; $("#autoCtrl").hidden = false; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = true;
  } else {
    $("#playCards").innerHTML = fullPlayCards();
    $("#playPerf").textContent = S.curPerf.join("  •  ");
    $("#playGuide").textContent = S.mode === "manual" ? "Director: when it gets predictable, press 🔔 Swap!" : "The host leads. Listen for \"Swap!\" and \"New twist\"";
    $("#manualCtrl").hidden = S.mode !== "manual"; $("#autoCtrl").hidden = S.mode !== "auto"; $("#guessCtrl").hidden = true; $("#earCtrl").hidden = true; $("#miniCtrl").hidden = true;
  }
  /* במצב קליל אין "נושא חדש" ואין "קפאו": רק תקוע?, רמז, השהיה וסיום */
  const lite = isLite() && !guessRound && !earRound && !miniRound;
  $$("#autoCtrl .topicb").forEach((b) => b.hidden = lite);
  const ah = $("#autoCtrl .autohint"); if (ah) ah.textContent = lite ? "🤖 The host runs the scene. Just talk, that's all you need." : "🤖 The host runs the scene… listen for \"Swap!\"";
  document.body.classList.toggle("litescene", lite);
  $("#ringcount").textContent = ""; $("#playBadge").hidden = licActive();
  updateClock(); setKeyHint(); show("play"); sfx.start(); keepAwake(true);
  if (timer) clearInterval(timer); timer = setInterval(tick, 1000);
  if (earRound) earNext(false);
  if (miniRound) miniTick();
  if (isLite() && !guessRound && !earRound && !miniRound) scheduleLiteEvent();
  else if (S.mode === "auto" && !guessRound && !earRound && !miniRound) { scheduleAutoSwap(); scheduleAutoTopic(); }
}
function fullPlayCards() {
  if (!S.set || !S.con || !MM_CAT[S.conCat]) return "";
  return `<div class="scard set"><div class="k">📍 Stage</div><div class="v">${esc(S.set[0])}</div><div class="vd">${esc(S.set[1])}</div></div>` +
    `<div class="scard ${S.conCat}"><div class="k">${MM_CAT[S.conCat].ic} ${MM_CAT[S.conCat].label}</div><div class="v">${esc(S.con[0])}</div><div class="vd">${esc(S.con[1])}</div></div>` + extrasCardHTML();
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
  miniTick(); extraTick();
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
  $("#flashTxt").textContent = "Swap!"; $("#ringcount").textContent = `🔔 Swaps this round: ${S.rings}`;
  flashSwap(false); sfx.swap(); speak(rand(persona().swap));
}
function freeze() {
  if (!sceneRunning || paused) return; S.freezes = (S.freezes || 0) + 1; $("#flashTxt").textContent = "Freeze!"; flashSwap(true); sfx.freeze();
  speak("Freeze! Swap a player, and start a new scene from the same pose.");
}
function flashSwap(isFreeze) {
  const bg = $("#flashbg"), fl = $("#flash"), app = $(".app");
  bg.classList.remove("go"); fl.classList.remove("go"); void bg.offsetWidth;
  bg.style.background = isFreeze ? "var(--lang)" : "var(--change)"; bg.classList.add("go"); fl.classList.add("go");
  if (S.settings.motion) { app.classList.remove("is-shaking"); void app.offsetWidth; app.classList.add("is-shaking"); }
  setTimeout(() => { bg.classList.remove("go"); fl.classList.remove("go"); app.classList.remove("is-shaking"); }, 620);
}
function setPausedUI(on) {
  airLamp(currentScreen === "play" ? (on ? "paused" : "live") : null);
  $("#pausedBanner").classList.toggle("on", on); $("#ringtimer").classList.toggle("paused", on); $("#clock").classList.toggle("paused", on);
  $$('[data-role="pause"]').forEach((b) => b.textContent = on ? "▶️ Resume" : "⏸️ Pause");
}
function togglePause() {
  if (!sceneRunning) return;
  if (holdT) { clearInterval(holdT); holdT = null; $("#pausedBanner").textContent = "⏸️ Paused"; }
  if (!paused) {
    paused = true; pausedAt = Date.now(); if (swapT) clearTimeout(swapT); if (topicAutoT) clearTimeout(topicAutoT);
    stopVoice(); setPausedUI(true); updateClock();
  } else {
    sceneStart += Date.now() - pausedAt; paused = false; setPausedUI(false); tick();
    if (isLite() && !guessRound && !earRound && !miniRound) scheduleLiteEvent();
    else if (S.mode === "auto" && !guessRound && !earRound && !miniRound) { scheduleAutoSwap(); scheduleAutoTopic(); }
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
  logRound({ type: "scene", set: S.set[0], con: S.con ? S.con[0] : "", conCat: S.conCat, lite: isLite() && !!S.ls, who: S.ls ? S.ls.who.slice() : undefined, roles: S.ls ? S.ls.roles.slice() : undefined, perf: S.curPerf.slice(), swaps: S.rings, topics: S.topics, tasks: S.tasks || 0, freezes: S.freezes || 0, secs: Math.min(elapsed, S.sceneLen) });
  sfx.end(); speak(rand(persona().timeup));
  endT = setTimeout(() => { endT = null; if (S.scored) buildScore(); else roundEnd(); }, 700);
}
function logRound(entry) { S.log.push({ n: S.round, ...entry }); bumpStat("rounds"); save(); }

/* ---------- ניקוד ---------- */
let scoreState = {};
function buildScore() {
  const body = $("#scoreBody");
  if (S.mode === "manual") {
    $("#scoreSub").textContent = "The director gives tokens, up to 3 per player."; scoreState = {};
    body.innerHTML = S.curPerf.map((p, pi) => { scoreState[p] = { yes: false, loyal: false, pivot: false };
      return `<div class="scorer"><div class="nm">${esc(p)}</div><div class="crit" data-player="${pi}">
        <button data-c="yes">Yes, and...<small>went with it, didn't block</small></button>
        <button data-c="loyal">True to the twist<small>kept the rule</small></button>
        <button data-c="pivot">Quick turn<small>reacted fast to the swap</small></button></div></div>`; }).join("");
  } else {
    $("#scoreSub").textContent = isLite() ? "Who listened best to their partner? Give a shout-out (you can skip)." : "Who reacted fastest to the twists? Give a shout-out (you can skip)."; scoreState = { honor: null };
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
  showBoard(allDir ? "Everyone was director twice!" : `Round ${S.round} is over`);
}
function showBoard(sub) {
  renderBoard(); const top = Math.max(0, ...Object.values(S.scores));
  $("#boardSub").textContent = top >= WIN_TOKENS ? `Someone reached ${WIN_TOKENS}!` : sub;
  $("#declareWinBtn").hidden = !(top >= WIN_TOKENS); show("scoreboard");
}
function roundEnd2() { $("#roundendSub").textContent = `Round ${S.round} is over · Ready for more?`; show("roundend"); miniConfetti(); }
function roundEnd() { advanceRound(); $("#roundendSub").textContent = `Round ${S.round} is over · Ready for more?`; show("roundend"); miniConfetti(); }
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
  else { $("#partyendSub").textContent = `${S.round} rounds of laughs${S.company ? " with " + S.company : ""}. See you next time!`; show("partyend"); bigConfetti(); sfx.bell(); }
}
/* ---------- שיחת סיום מונחית (מצב צוות) ----------
   3 שלבים: רגע מהמשחק, "יש לזה קשר לעבודה שלנו?" (נושא אחד), מה לוקחים.
   לא מסיקים מהמשחק מי טוב במה. מתעדים רק מה שהקבוצה אישרה לשתף, בלי שמות. */
const DB_SUGGEST = { change: "You used 'Swap' today. You can talk about what helped you continue when the direction changed.", help: "There were player swaps with 'Freeze' today. You can talk about how we help a scene keep going.", listen: "" };
function dbFacts() {
  const sc = S.log.filter((r) => r.type === "scene");
  const sum = (k) => sc.reduce((a, r) => a + (r[k] || 0), 0);
  const last = sc.length ? sc[sc.length - 1] : null;
  return { swaps: sum("swaps"), topics: sum("topics"), freezes: sum("freezes"), con: last ? last.con : "" };
}
function dbOpeners() {
  const f = dbFacts();
  return MM_DEBRIEF2.openers.filter((o) => o.when === "any" || (o.when === "con" ? !!f.con : f[o.when] > 0))
    .map((o) => o.q.replace("{con}", () => f.con || ""));
}
function dbSuggestKey() { const f = dbFacts(); return f.swaps > 0 ? "change" : f.freezes > 0 ? "help" : "listen"; }
function dbState() {
  if (!S.debrief) S.debrief = { step: 0, op: 0, theme: "", shared: "", tryIt: "", follow: "" };
  return S.debrief;
}
function renderDebrief() { dbState(); renderDb(); }
function dbTip(title, lines) {
  return `<details class="dbtip"><summary>${title}</summary>${lines.map((l) => `<p>${l}</p>`).join("")}</details>`;
}
function renderDb() {
  const D = dbState(), SC = MM_DEBRIEF2.script, body = $("#dbBody"), nav = $("#dbNav");
  const head = (n, t, mins) => `<div class="dbstep">${n ? `Step ${n} of 3 · ` : ""}${mins}</div><h2>${t}</h2>`;
  const say = (t) => `<div class="dbsay"><span class="lbl">Say out loud:</span> "${esc(t)}"</div>`;
  let h = "", n = "";
  if (D.step === 0) {
    h = head(0, "💬 Closing talk", "About 10 minutes") +
      `<p class="sub">Before we say goodbye: a short talk about what happened, and if there is something worth taking back to work. Sit in a circle.</p>` +
      say(SC.open) + say(SC.rules) + say(SC.record) +
      `<p class="dbnote">More than 12 people? In step 2, give half a minute to talk in pairs, then hear 2 or 3 examples. Not everyone needs to speak.</p>`;
    const typed = !!(D.shared || D.tryIt || D.follow || D.theme);
    n = (typed ? "" : `<button class="ghost" data-act="dbSkip">Skip the talk</button>`) + `<button class="big" data-act="dbNext">Start →</button>`;
  } else if (D.step === 1) {
    const ops = dbOpeners(), q = ops[D.op % ops.length];
    h = head(1, "A moment from the game", "2 minutes") + `<div class="dbq">${esc(q)}</div>` +
      `<p class="dbnote">People who only watched are welcome to answer too.</p>` +
      (ops.length > 1 ? `<div class="row" style="justify-content:flex-start"><button class="ghost" data-act="dbOther">🔀 Different question</button></div>` : "") +
      dbTip("Silence? What to do", [`"${esc(SC.silence)}"`, `Still quiet? "${esc(SC.pairs)}"`]);
    n = `<button class="ghost" data-act="dbBack">Back</button><button class="big" data-act="dbNext">Next →</button>`;
  } else if (D.step === 2) {
    const sug = dbSuggestKey(), th = MM_DEBRIEF2.themes.find((t) => t.key === D.theme);
    h = head(2, "Does it connect to our work?", "4 minutes") + say(SC.bridge) +
      `<p class="dbnote">"Not really" is a fine answer too. ${DB_SUGGEST[sug] ? esc(DB_SUGGEST[sug]) + " " : ""}Pick one topic:</p>` +
      `<div class="dbthemes">` + MM_DEBRIEF2.themes.map((t) => `<button data-act="dbTheme" data-k="${t.key}" class="${t.key === D.theme ? "on" : ""}">${t.ic} ${esc(t.label)}${t.key === sug && !D.theme ? ' <small>suggested</small>' : ""}</button>`).join("") + `</div>` +
      (th ? `<div class="dbq sm">${esc(th.qs[0])}</div><div class="dbq sm2"><span class="lbl">If there is time:</span> ${esc(th.qs[1])}</div>` + (th.note ? `<p class="dbnote">${esc(th.note)}</p>` : "") : "") +
      dbTip("Tips for the facilitator", ["A manager leading the talk: listen to others first, and share your view only at the end.", `Someone takes over: "${esc(SC.dominate)}"`, `Criticism of a specific person: "${esc(SC.personal)}"`, "No link to work comes up? That's fine. Don't force one."]);
    n = `<button class="ghost" data-act="dbBack">Back</button><button class="big" data-act="dbNext">Next →</button>`;
  } else {
    h = head(3, "What do we take with us?", "3 minutes") +
      `<ul class="dbclose">${MM_DEBRIEF2.close.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>` +
      `<p class="dbnote">You don't need to ask all of them. If nothing is decided, that's fine. Only what the group agreed goes in the summary, with no names.</p>` +
      `<label class="dbf"><span>A line from the talk the group agreed to share (optional)</span><textarea id="dbShared" rows="2" maxlength="220">${esc(D.shared)}</textarea></label>` +
      `<label class="dbf"><span>What we will try, and when (optional)</span><textarea id="dbTry" rows="2" maxlength="220">${esc(D.tryIt)}</textarea></label>` +
      `<label class="dbf"><span>Who will remind us to check if it helped, and when (optional)</span><input id="dbFollow" maxlength="120" value="${esc(D.follow)}"></label>` +
      say(SC.end);
    n = `<button class="ghost" data-act="dbBack">Back</button><button class="big" data-act="dbFinish">Finish →</button>`;
  }
  body.innerHTML = h; nav.innerHTML = n;
  const bind = (sel, k) => { const e = $(sel); if (e) e.addEventListener("input", () => { D[k] = e.value.trim(); save(); }); };
  bind("#dbShared", "shared"); bind("#dbTry", "tryIt"); bind("#dbFollow", "follow");
  const p = $("#debrief .dbpanel"); if (p) p.scrollTop = 0;
}
function dbGo(d) { const D = dbState(); D.step = Math.max(0, Math.min(3, D.step + d)); save(); renderDb(); }
function pickDebrief(q, btn) {
  const i = S.debriefPicked.indexOf(q); if (i >= 0) S.debriefPicked.splice(i, 1); else S.debriefPicked.push(q);
  btn.classList.toggle("on", i < 0); save();
}
function declareWinner() {
  gameActive = false; S.inGame = false; save(); keepAwake(false);
  const arr = activeP().map((p) => ({ p, t: S.scores[p] || 0 })).sort((a, b) => b.t - a.t);
  const top = arr.length ? arr[0].t : 0; const winners = arr.filter((r) => r.t === top).map((r) => r.p);
  const names = winners.join(" and "), tie = winners.length > 1;
  $("#winName").textContent = arr.length ? names : "—";
  $("#winSub").textContent = arr.length ? (tie ? `A tie! ${top} tokens each` : `With ${top} tokens`) : "";
  show("winner"); bigConfetti(); sfx.bell(); setTimeout(sfx.bell, 250);
  speak(arr.length ? (tie ? `${names} win! Well done!` : `${names} wins! Well done!`) : "", arr.length ? [tie ? "compere-timeup-3" : "winner-2"] : []);
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
  if (groupIsStale()) { if (!staleAsking) askStaleGroup().then(() => { if (canResume()) resumeGame(); }); return; }
  if (!canResume()) { $("#resumeBtn").hidden = true; return; }
  gameActive = true; keepAwake(true); guessRound = false; guessWin = false; earRound = false; miniRound = false; ac();
  S.round = S.log.length; save();
  renderBoard(); const top = Math.max(0, ...Object.values(S.scores || {}));
  $("#boardSub").textContent = "Game continues · " + S.round + " rounds played";
  $("#declareWinBtn").hidden = !(S.scored && top >= WIN_TOKENS); show("scoreboard");
}
async function confirmHome() {
  const ok = await dialog({ title: "Go to the home screen?", text: "The game is saved on this device. Press 'Continue game' to come back to the board.", okText: "Yes, go home", cancelText: "Stay", danger: true });
  if (!ok) return;
  stopGameToHome();
}
function stopGameToHome() { stopGame(); syncGroupUI(); show("home"); }
function stopGame() {
  if (sceneRunning) { sceneRunning = false; paused = false; stopSceneTimers(); hideHint(); hideTopic(); }
  countdownRunning = false; if (countIv) { clearInterval(countIv); countIv = null; } $("#count").classList.remove("go"); $("#count .n").classList.remove("pop");
  stopVoice(); wuClear(); W = null;
  gameActive = false; keepAwake(false); save();
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
  const date = d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return { scenes, guesses, swaps, topics, mins: Math.max(1, Math.round(secs / 60)), ps, board, honors, date };
}
function showSummary() {
  const d = summaryData();
  $("#summarySub").textContent = (S.company ? S.company + " · " : "") + d.date + (S.team ? " · Team mode" : "");
  $("#summaryStats").innerHTML = [
    [S.log.length, "Rounds"], [d.ps.length, "Players"], [d.swaps, "Swaps"], [d.topics, "Twists"], [d.mins, "Minutes on stage"]
  ].map(([n, l]) => `<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join("");
  let html = `<div class="sumlist"><h4>👥 Who played</h4><p>${d.ps.map(esc).join(" · ")}</p></div>`;
  if (S.scored && d.board.length) html += `<div class="sumlist"><h4>🏆 Scoreboard</h4>${d.board.map((r, i) => `<p>${i + 1}. ${esc(r.p)} : ${r.t} tokens</p>`).join("")}</div>`;
  if (d.honors.length) html += `<div class="sumlist"><h4>⭐ Shout-outs</h4><p>${d.honors.map((h) => `${esc(h.p)} (${h.h})`).join(" · ")}</p></div>`;
  if (S.log.length) html += `<div class="sumlist"><h4>🎬 The rounds</h4>` + S.log.map((r) => r.type === "mini"
    ? `<div class="rnd"><span class="i">${r.n}</span><span class="w">${esc(miniLogLine(r))}</span></div>`
    : r.type === "ear"
    ? `<div class="rnd"><span class="i">${r.n}</span><span class="w">🎧 The Earpiece: ${esc(r.agent)} was the agent, ${esc(r.listener)} caught ${r.caught} of ${r.missions.length} <small>(${r.missions.map(esc).join(" · ")})</small></span></div>`
    : r.type === "guess"
    ? `<div class="rnd"><span class="i">${r.n}</span><span class="w">🕵️ ${esc(r.title)}: ${esc(r.guesser)} ${r.win ? "guessed right" : "didn't guess"} <small>(${esc(r.secret)})</small></span></div>`
    : `<div class="rnd"><span class="i">${r.n}</span><span class="w">${esc(r.set)}${r.con ? ` · ${MM_CAT[r.conCat]?.ic || ""} ${esc(r.con)}` : ""} <small>· ${r.perf.map(esc).join(" and ")} · ${r.swaps} swaps</small></span></div>`).join("") + `</div>`;
  if (S.team) html = `<div class="sumlist mgrprev"><h4>📤 This is what goes to the manager</h4><pre>${esc(summaryMgrText())}</pre><p class="muted">No scores, no ranking and no names of who said what.</p><button class="ghost" data-act="dbEdit">✏️ Edit in the closing talk</button></div>` + html;
  const mb = $("#mementoBtn"); if (mb) mb.hidden = !S.team;
  $("#summaryBody").innerHTML = html; $("#confetti").innerHTML = ""; renderLicBoxes(); show("summary");
}
/* סיכום למנהל/ת (מצב צוות): מה התקיים, על מה דיברו, מה סוכם. בלי ניקוד, דירוג או שמות */
function summaryMgrText() {
  const d = summaryData(), D = S.debrief || {}, th = MM_DEBRIEF2.themes.find((t) => t.key === D.theme), L = [];
  L.push(`🎭 Mehamoten | Session summary`);
  L.push((S.company ? S.company + " • " : "") + d.date);
  L.push(`${d.ps.length} players • ${S.log.length} rounds`);
  L.push("");
  if (th) { L.push("💬 We talked about:"); L.push(th.label + "."); }
  else if (D.done && !D.skipped) L.push("💬 There was a closing talk. No topic was chosen to record.");
  else L.push("💬 No recorded closing talk took place.");
  if (D.shared) { L.push(""); L.push("From the talk, as agreed to share:"); L.push(`"${D.shared}"`); }
  L.push("");
  if (D.tryIt) { L.push("🔁 What we will try:"); L.push(D.tryIt); }
  else L.push("No next step was set.");
  if (D.follow) L.push("Follow-up: " + D.follow);
  L.push("");
  L.push("This summary records the talk and the agreements, not an evaluation of the players.");
  L.push(licActive() ? "Mehamoten · Team mode" : "Powered by Mehamoten · " + SITE_URL.replace("https://", ""));
  return L.join("\n");
}
async function shareMemento() {
  const txt = summaryText();
  if (navigator.share) { try { await navigator.share({ title: "Mehamoten · Game memory", text: txt }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  copyText(txt);
}
function summaryText() {
  const d = summaryData(); const L = [];
  L.push(`🎭 Mehamoten: session summary${S.company ? " · " + S.company : ""}`); L.push(d.date); L.push("");
  L.push(`${S.log.length} rounds · ${d.ps.length} players · ${d.swaps} swaps · ${d.topics} twists · ~${d.mins} minutes on stage`);
  L.push(`Players: ${d.ps.join(", ")}`); L.push("");
  if (S.scored) { L.push("🏆 Results:"); d.board.forEach((r, i) => L.push(`${i + 1}. ${r.p}: ${r.t}`)); L.push(""); }
  if (d.honors.length) { L.push("⭐ Shout-outs: " + d.honors.map((h) => `${h.p} (${h.h})`).join(", ")); L.push(""); }
  L.push("🎬 Rounds:");
  S.log.forEach((r) => L.push(r.type === "mini" ? `${r.n}. ${miniLogLine(r)}` : r.type === "ear" ? `${r.n}. The Earpiece: ${r.agent} was the agent, ${r.listener} caught ${r.caught} of ${r.missions.length}` : r.type === "guess" ? `${r.n}. Guess "${r.title}": ${r.guesser} ${r.win ? "guessed right" : "didn't guess"}` : `${r.n}. ${r.set}${r.con ? " + " + r.con : ""}: ${r.perf.join(" and ")} (${r.swaps} swaps)`));
  L.push(""); L.push(licActive() ? "Mehamoten · Team mode" : "Powered by Mehamoten · " + SITE_URL.replace("https://", ""));
  return L.join("\n");
}
async function copyText(txt) {
  let ok = false;
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(txt); ok = true; } } catch (e) {}
  if (ok) toastMsg("Summary copied. Paste it in an email or WhatsApp");
  else { await dialog({ title: "Copy the summary", text: "Select all and copy:", input: " ", value: txt, okText: "Close", cancelText: "" }); }
}
function copySummary() { return copyText(S.team ? summaryMgrText() : summaryText()); }
async function shareSummary() {
  const txt = S.team ? summaryMgrText() : summaryText();
  if (navigator.share) { try { await navigator.share({ title: "Mehamoten: session summary", text: txt }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
  copyText(txt);
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
    if (!img.width || !img.height) { URL.revokeObjectURL(url); toastMsg("Could not read the image. Try PNG or JPG"); return; }
    const max = 320, r = Math.min(1, max / Math.max(img.width, img.height));
    const c = document.createElement("canvas"); c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    try { const d = c.toDataURL("image/png"); LOGO = d.startsWith("data:image/") && d.length < 400000 ? d : null; if (LOGO) lsSet(LOGO_KEY, LOGO); else toastMsg("The image is too big or not supported"); } catch (e) { LOGO = null; }
    renderLogo(); toastMsg("Logo saved on this device");
  };
  img.onerror = () => { URL.revokeObjectURL(url); toastMsg("Could not read the image"); };
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
    x.direction = "ltr"; x.textAlign = "left";
    const bg = x.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1e1729"); bg.addColorStop(1, "#100c17"); x.fillStyle = bg; x.fillRect(0, 0, W, H);
    const g1 = x.createRadialGradient(W * .5, H * 1.05, 40, W * .5, H * 1.05, 700); g1.addColorStop(0, "rgba(226,49,73,.28)"); g1.addColorStop(1, "rgba(226,49,73,0)"); x.fillStyle = g1; x.fillRect(0, 0, W, H);
    const g2 = x.createRadialGradient(W * .5, -80, 40, W * .5, -80, 760); g2.addColorStop(0, "rgba(246,231,180,.22)"); g2.addColorStop(1, "rgba(246,231,180,0)"); x.fillStyle = g2; x.fillRect(0, 0, W, H);
    const R = 90; let y = 130;
    x.fillStyle = "#f6e7b4"; x.font = "500 26px Rubik, Heebo, sans-serif"; x.fillText("Session summary · " + d.date, R, y);
    y += 92; x.fillStyle = "#ffffff"; x.font = "400 96px 'Secular One', Heebo, sans-serif"; x.fillText("Mehamoten", R, y);
    x.fillStyle = "#e23149"; x.fillText(".", R + x.measureText("Mehamoten").width, y);
    if (S.company) { y += 62; x.fillStyle = "#e9e3d4"; x.font = "700 40px Heebo, sans-serif"; x.fillText(S.company, R, y); }
    if (licActive() && LOGO) { try { const im = new Image(); im.src = LOGO; await im.decode(); const s0 = Math.min(160 / im.width, 110 / im.height, 1); x.drawImage(im, W - 90 - im.width * s0, 70, im.width * s0, im.height * s0); } catch (e) {} }
    y += 70;
    const stats = [[S.log.length, "rounds"], [d.ps.length, "players"], [d.swaps, "swaps"], [d.mins, "minutes"]];
    const bw = (W - 90 * 2 - 24 * 3) / 4;
    stats.forEach(([n, l], i) => { const bx = 90 + i * (bw + 24); roundRect(x, bx, y, bw, 150, 26); x.fillStyle = "rgba(255,255,255,.06)"; x.fill(); x.strokeStyle = "rgba(255,255,255,.14)"; x.lineWidth = 2; x.stroke();
      x.textAlign = "center"; x.fillStyle = "#f6e7b4"; x.font = "400 66px 'Secular One', Heebo, sans-serif"; x.fillText(String(n), bx + bw / 2, y + 82);
      x.fillStyle = "#b3acc4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText(l, bx + bw / 2, y + 126); x.textAlign = "left"; });
    y += 150 + 64;
    x.fillStyle = "#f6e7b4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText("On stage", R, y); y += 48;
    x.fillStyle = "#ffffff"; x.font = "700 34px Heebo, sans-serif"; const nl = wrapText(x, d.ps.join("  ·  "), R, y, W - 180, 46, 3); y += 46 * nl + 40;
    if (S.scored && !S.team && d.board.length && y < H - 420) { x.fillStyle = "#f6e7b4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText("Scoreboard", R, y); y += 50;
      d.board.slice(0, 3).forEach((r, i) => { x.fillStyle = i === 0 ? "#f6e7b4" : "#e9e3d4"; x.font = (i === 0 ? "400 44px 'Secular One'" : "700 34px Heebo") + ", Heebo, sans-serif"; x.fillText(`${["🥇", "🥈", "🥉"][i]} ${r.p}  ${r.t}`, R, y); y += i === 0 ? 58 : 48; }); y += 20; }
    const last = S.log.filter((r) => r.type === "scene").slice(-3);
    if (last.length && y < H - 360) { x.fillStyle = "#f6e7b4"; x.font = "500 24px Rubik, Heebo, sans-serif"; x.fillText("Moments from the session", R, y); y += 48;
      last.forEach((r) => { if (y > H - 230) return; x.fillStyle = "#e9e3d4"; x.font = "500 30px Heebo, sans-serif"; x.fillText(fitText(x, r.con ? `${r.set} · ${r.con}` : r.set, W - 320), R, y); y += 44; }); }
    // תחתית: כוכב + החלפה!
    x.save(); x.translate(W - 150, H - 150); x.rotate(-0.2); x.fillStyle = "#e23149"; star(x, 0, 0, 12, 92, 62); x.fill(); x.restore();
    x.textAlign = "center"; x.fillStyle = "#fff"; x.font = "400 40px 'Secular One', Heebo, sans-serif"; x.fillText("Swap!", W - 150, H - 136);
    x.textAlign = "left"; x.fillStyle = "#8a7fa6"; x.font = "500 26px Rubik, Heebo, sans-serif";
    x.fillText(licActive() ? "Mehamoten · the digital improv host" : "Powered by Mehamoten", R, H - 168);
    x.direction = "ltr"; x.textAlign = "left"; x.fillText(SITE_URL.replace("https://", ""), R, H - 126);
    const blob = await new Promise((res) => c.toBlob(res, "image/png"));
    const file = new File([blob], "mehamoten-summary.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: "Mehamoten: session summary", text: summaryText().split("\n").slice(0, 3).join("\n") }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "mehamoten-summary.png"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toastMsg("Image saved. Send it on WhatsApp");
  } catch (e) { toastMsg("Could not create an image on this device. Try 'Copy text'"); }
  finally { if (btn) btn.disabled = false; }
}
function roundRect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }
function star(x, cx, cy, n, R1, R2) { x.beginPath(); for (let i = 0; i < n * 2; i++) { const r = i % 2 ? R2 : R1, a = Math.PI * i / n; x.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } x.closePath(); }
function wrapText(x, text, X, Y, maxW, lh, maxLines = 4) { const words = text.split(" "); let line = "", yy = Y, n = 0; for (const w of words) { const t = line ? line + " " + w : w; if (x.measureText(t).width > maxW && line) { if (++n >= maxLines) { line += "…"; break; } x.fillText(line, X, yy); line = w; yy += lh; } else line = t; } if (line) { x.fillText(line, X, yy); n++; } return n; }
function fitText(x, text, maxW) { if (x.measureText(text).width <= maxW) return text; let t = text; while (t.length > 3 && x.measureText(t + "…").width > maxW) t = t.slice(0, -1); return t + "…"; }

/* ---------- הגדרות ---------- */
function applyVoiceUI() { const w = $("#ttsVoiceWrap"); if (w) w.hidden = S.settings.voice !== "tts"; }
function openSettings() { syncSettingsUI(); applyVoiceUI(); loadVoices(); renderLocalStats(); renderLicBoxes(); $("#settings").classList.add("open"); ac(); $("#settings .close").focus(); }
function closeSettings() { const v = $("#voiceSel").value; if (v) S.settings.voiceURI = v; save(); $("#settings").classList.remove("open"); }
function syncSettingsUI() {
  const st = S.settings;
  const map = { persona: st.persona, voice: st.voice === "tts" ? "tts" : "rec", tts: st.tts ? "on" : "off", hints: st.hints ? "on" : "off", sfx: st.sfx ? "on" : "off", motion: st.motion ? "on" : "off" };
  $$("[data-skey]").forEach((seg) => { const v = map[seg.dataset.skey]; seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.v === v)); });
}
function onSettingsSeg(seg, btn) {
  const k = seg.dataset.skey, v = btn.dataset.v;
  if (k === "persona" || k === "voice") S.settings[k] = v; else S.settings[k] = v === "on";
  if (k === "motion") document.body.classList.toggle("noanim", !S.settings.motion);
  if (k === "hints") applyHintsVis();
  if (k === "tts" && !S.settings.tts) stopVoice();
  if (k === "voice") { stopVoice(); applyVoiceUI(); }
  syncSettingsUI(); save();
}
function renderLocalStats() { $("#localStats").innerHTML = `<span>Games<b>${STATS.games}</b></span><span>Rounds<b>${STATS.rounds}</b></span><span>Swaps<b>${STATS.swaps}</b></span>`; }
function testVoice() { sfx.bell(); speak(persona().test); }
async function resetAll() {
  const ok = await dialog({ title: "Reset all data?", text: "Names, settings, your own cards and stats will be deleted from this device. This cannot be undone.", okText: "Yes, reset", cancelText: "Cancel", danger: true });
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
    if ($("#guide").classList.contains("open")) { $("#guide").classList.remove("open"); return; }
    if ($("#settings").classList.contains("open")) closeSettings();
    else if ($("#editor").classList.contains("open")) closeEditor();
    else if ($("#onboard").classList.contains("open")) skipOnboard();
    return;
  }
  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
  if ($("#guide").classList.contains("open")) return; /* במדריך: מקשי המשחק לא פעילים */
  if (currentScreen !== "play" || !sceneRunning || $("#dlg")?.classList.contains("open")) return;
  const k = e.key.toLowerCase();
  if (e.code === "Space") { e.preventDefault(); if (miniRound) fireMiniCue(true); else if (earRound) earNext(false); else if (!guessRound && !isLite()) doSwap(); }
  else if (k === "t") { if (!guessRound && !earRound && !miniRound && !isLite()) throwTopic(); }
  else if (k === "h") { if (S.settings.hints && !earRound && !miniRound) sceneHint(); }
  else if (k === "p") togglePause();
  else if (k === "f") { if (S.mode === "manual" && !guessRound && !earRound && !miniRound) freeze(); }
  else if (k === "e") endScene();
});

/* ---------- ניתוב פעולות ---------- */
const ACTIONS = {
  obSkip: skipOnboard, obNext: nextOnboard, howto: () => openOnboard(true),
  openGuide: () => { $("#guide").classList.add("open"); $("#guide .gpanel").scrollTop = 0; $("#guide .close").focus(); }, closeGuide: () => $("#guide").classList.remove("open"),
  openSettings, closeSettings, testVoice, resetAll, install, reloadApp,
  goSetup, goHome: () => { S.company = ($("#companyInput").value || "").trim().slice(0, 40); save(); show("home"); syncGroupUI(); },
  addPlayer, delPlayer: (b) => delPlayer(+b.dataset.i), openEditor, closeEditor, addCustomCard, delCustomCard: (b) => delCustomCard(+b.dataset.i), exportCustom, importCustom,
  startGame, resumeGame, confirmHome, newGroup, liteGo, drawCards, reDraw: drawCards, openerHint, goCast, backToDraw: () => show("draw"), liteSceneBack: () => { stopVoice(); show("intro"); }, beginCountdown,
  manualSwap, throwTopic, stuck, sceneHint, freeze, togglePause, endScene, guessSuccess, applyGuessScore,
  earNext: () => earNext(false), earRedrawSet, earReveal, applyEarScore,
  miniNext: () => fireMiniCue(true), miniRedraw, miniShowTopic, miniRevealExpert, miniExpertWin: () => miniExpertDone(true), miniExpertLose: () => miniExpertDone(false),
  applyScore, nextRound, endGameNow, declareWinner: () => (S.team && !(S.debrief && S.debrief.done) ? endGameNow() : declareWinner()), showBoardOnly: () => { renderBoard(); show("scoreboard"); }, renderDebrief, finalEnd, newGame,
  dbNext: () => dbGo(1), dbBack: () => dbGo(-1), dbOther: () => { dbState().op++; save(); renderDb(); },
  dbTheme: (b) => { const D = dbState(); D.theme = D.theme === b.dataset.k ? "" : b.dataset.k; save(); renderDb(); }, dbSkip: () => { S.debrief = { step: 0, op: 0, theme: "", shared: "", tryIt: "", follow: "", done: true, skipped: true }; save(); finalEnd(); },
  dbFinish: () => { const D = dbState(); const again = !!D.done; D.done = true; save(); if (again) showSummary(); else finalEnd(); }, shareMemento,
  dbEdit: () => { const D = dbState(); D.step = 3; D.done = true; save(); renderDb(); show("debrief"); },
  showSummary, copySummary, shareSummary, pickDebrief: (b) => pickDebrief(b.dataset.q, b),
  wuMenu, wuPickOne: (b) => wuPickOne(+b.dataset.id), wuSurprise, wuOther, wuStart, wuStop, wuMore, wuNext, wuSkip, wuBack,
  hideHint, hideTopic, enterCode, removeCode, offerBack, shareImage, pickLogo, removeLogo
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
  /* חזרה אחרי הפסקה ארוכה: לא מציגים לקבוצה הבאה את השמות של הקודמת */
  let staleGroup = groupIsStale();
  /* לינק מוכן מראש: ?preset=team&company=X&industry=hitech&code=MM-... */
  try {
    const q = new URLSearchParams(location.search);
    const pc = q.get("code") ? parseLicense(q.get("code")) : null, codeOk = !!(pc && pc.ok && pc.exp > Date.now());
    const qCompany = (q.get("company") || "").trim().slice(0, 40), qTeam = q.get("preset") === "team";
    const qInd = q.get("industry") && MM_INDUSTRY[q.get("industry")] ? q.get("industry") : "";
    const presetUsed = codeOk || qTeam || !!qCompany || !!qInd;
    /* לינק של ארגון אחר, או נתונים ישנים: מתחילים נקי בלי לשאול */
    const normOrg = (x) => String(x || "").replace(/\s+/g, " ").trim().toLowerCase();
    const otherOrg = (!!qCompany && normOrg(qCompany) !== normOrg(S.company)) || (codeOk && (!LIC || LIC.org !== pc.org));
    const applyPreset = () => {
      if (codeOk) { LIC = pc; lsSet(LIC_KEY, { code: pc.code }); }
      if (qTeam) S.team = true;
      if (qCompany) S.company = qCompany;
      if (qInd) S.industry = qInd;
      lsSet(SEEN_KEY, true); save(); renderLicBoxes();
    };
    if (presetUsed) {
      history.replaceState(null, "", location.pathname);
      staleGroup = false;
      if (otherOrg && S.inGame && !groupIsStale()) {
        /* משחק פתוח ועדכני + לינק של ארגון אחר: שום דבר לא משתנה עד שהמנחה מאשר */
        setTimeout(async () => {
          const ok = await dialog({ title: "Switch to another company?", text: "You opened a link for another company, but there is an open game on this device. Switching closes the game and deletes its names and scores. Cancel keeps everything exactly as it was.", okText: "Switch to the new company", cancelText: "Cancel, keep playing", solid: true });
          if (!ok) { syncGroupUI(); return; }
          clearGroup(); applyPreset(); goSetup();
        }, 0);
      } else {
        if (hasGroupData() && (groupIsStale() || otherOrg)) clearGroup(); /* ארגון אחר או נתונים ישנים: מתחילים נקי */
        applyPreset(); setTimeout(goSetup, 0);
      }
    }
  } catch (e) {}
  document.body.classList.toggle("noanim", !S.settings.motion);
  document.body.classList.toggle("bigscreen", !!S.big);
  $("#verLabel").textContent = APP_VERSION;
  syncGroupUI();
  loadVoices(); applyHintsVis(); show("home");
  if (location.hash === "#play") { lsSet(SEEN_KEY, true); if (staleGroup) askStaleGroup().then(goSetup); else goSetup(); history.replaceState(null, "", location.pathname + location.search); }
  else if (staleGroup) askStaleGroup();
  else if (!S.team || !$("#setup").classList.contains("active")) openOnboard(false);
  if (LIC && licActive() && licDaysLeft() <= 7) setTimeout(() => toastMsg(`The team code for ${LIC.org} expires in ${licDaysLeft()} days. You can renew on WhatsApp from Settings`), 1200);
  else if (LIC && !licActive()) setTimeout(() => toastMsg(`The team code for ${LIC.org} has expired. You can renew on WhatsApp from Settings`), 1200);
  renderLicBoxes();
  registerSW();
})();

