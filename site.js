/* מהמותן: הגדרות משותפות לדפי האתר (הדף הראשי, lp, free). 2.6.3
   MM_CONTACT_EMAIL: לכאן מגיעות הפניות מהטפסים (דרך FormSubmit) ומכאן מוצג המייל בדפים. זה המקום היחיד.
   MM_BUY_LINKS: דפי התשלום (ישראכרט pay360). צריך להיות זהה ל-BUY_LINKS ב-app/js/app.js. ריק = וואטסאפ עם הודעה מוכנה. */
var MM_CONTACT_EMAIL = "games.liran.shaya@gmail.com";
var MM_BUY_LINKS = {
  event: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=179B1335-AAC4-A149-8ABB-F479E6B60D55",    /* ערב צוות, 690 ₪ */
  year: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B7BE0722-5BA9-1614-21CE-CC3FE8FBACF2",     /* שנה פתוחה, 4,100 ₪ */
  yearPlus: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B37C2305-3B65-4C4C-4A41-65563EE81FF4"  /* שנה + ערב עם לירן, 5,900 ₪ */
};
(function () {
  function apply() {
    var mail = MM_CONTACT_EMAIL;
    document.querySelectorAll("form[data-mm-form]").forEach(function (f) { f.action = "https://formsubmit.co/" + mail; });
    document.querySelectorAll("[data-mm-email]").forEach(function (a) { a.textContent = mail; if (a.tagName === "A") a.href = "mailto:" + mail; });
    document.querySelectorAll("a[data-buy]").forEach(function (a) { var u = MM_BUY_LINKS[a.getAttribute("data-buy")]; if (u) a.href = u; });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply); else apply();
})();
