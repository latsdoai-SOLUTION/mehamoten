/* מהמותן: הגדרות משותפות לדפי האתר (הדף הראשי, lp, free). 2.6.4
   MM_CONTACT_EMAIL: המייל שמוצג בדפים. זה המקום היחיד.
   MM_FORM_ENDPOINT: לכאן נשלחות הפניות מהטפסים (Google Apps Script). זה המקום היחיד.
   MM_BUY_LINKS: דפי התשלום (ישראכרט pay360). צריך להיות זהה ל-BUY_LINKS ב-app/js/app.js. ריק = וואטסאפ עם הודעה מוכנה. */
var MM_CONTACT_EMAIL = "games.liran.shaya@gmail.com";
var MM_FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwOUX-TJ1JiSMp-Lv0JlZQKKX3-JOh-dTEBHVCOL5T4fhIWXVvHfA4nd9sB3RZEDSAlZg/exec";
var MM_BUY_LINKS = {
  event: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=179B1335-AAC4-A149-8ABB-F479E6B60D55",    /* ערב צוות, 690 ₪ */
  year: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B7BE0722-5BA9-1614-21CE-CC3FE8FBACF2",     /* שנה פתוחה, 4,100 ₪ */
  yearPlus: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B37C2305-3B65-4C4C-4A41-65563EE81FF4"  /* שנה + ערב עם לירן, 5,900 ₪ */
};
(function () {
  var WA = "https://wa.me/972506325398";

  /* שליחת טופס: fetch ל-MM_FORM_ENDPOINT, בלי מעבר דף.
     בטופס: data-mm-form, data-mm-page (main / free), data-mm-thanks (הודעת התודה), data-mm-hide (מה להסתיר בהצלחה, לא חובה).
     mode: "no-cors": התשובה של השרת לא קריאה, ולכן "הצלחה" = הבקשה יצאה. כישלון = אין רשת. */
  function bindForm(f) {
    if (f.dataset.mmBound) return; f.dataset.mmBound = "1";
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (f.dataset.mmSending) return;
      var btn = f.querySelector('[type="submit"]');
      var err = f.querySelector(".mm-form-err"); if (err) err.remove();
      f.dataset.mmSending = "1"; if (btn) { btn.disabled = true; btn.setAttribute("aria-busy", "true"); }
      var body = new URLSearchParams(new FormData(f));
      body.set("_page", f.dataset.mmPage || "");
      fetch(MM_FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: body })
        .then(function () {
          f.style.display = "none";
          (f.dataset.mmHide || "").split(",").forEach(function (s) { s = s.trim(); if (s) document.querySelectorAll(s).forEach(function (el) { el.style.display = "none"; }); });
          var t = f.dataset.mmThanks && document.querySelector(f.dataset.mmThanks);
          if (t) { t.style.display = "block"; try { t.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (x) {} }
        })
        .catch(function () {
          delete f.dataset.mmSending; if (btn) { btn.disabled = false; btn.removeAttribute("aria-busy"); }
          var p = document.createElement("p");
          p.className = "mm-form-err"; p.setAttribute("role", "alert");
          p.style.cssText = "margin-top:12px;padding:12px 16px;border-radius:12px;background:rgba(226,49,73,.14);border:1px solid rgba(255,80,102,.45);text-align:center";
          p.appendChild(document.createTextNode("לא הצלחנו לשלוח. אפשר לכתוב לנו "));
          var a = document.createElement("a"); a.href = WA; a.target = "_blank"; a.rel = "noopener"; a.textContent = "בוואטסאפ";
          a.style.cssText = "color:#25D366;font-weight:700";
          p.appendChild(a);
          (btn && btn.parentNode === f ? btn : f.lastElementChild).insertAdjacentElement("afterend", p);
        });
    });
  }

  function apply() {
    var mail = MM_CONTACT_EMAIL;
    document.querySelectorAll("[data-mm-email]").forEach(function (a) { a.textContent = mail; if (a.tagName === "A") a.href = "mailto:" + mail; });
    document.querySelectorAll("a[data-buy]").forEach(function (a) { var u = MM_BUY_LINKS[a.getAttribute("data-buy")]; if (u) a.href = u; });
    document.querySelectorAll("form[data-mm-form]").forEach(bindForm);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
})();
