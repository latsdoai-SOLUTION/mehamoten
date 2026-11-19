/* Mehamoten English pages: shared settings. Same endpoint, contact and buy links as ../site.js (keep in sync). */
var MM_CONTACT_EMAIL = "games.liran.shaya@gmail.com";
var MM_FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbwOUX-TJ1JiSMp-Lv0JlZQKKX3-JOh-dTEBHVCOL5T4fhIWXVvHfA4nd9sB3RZEDSAlZg/exec";
var MM_BUY_LINKS = {
  event: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=179B1335-AAC4-A149-8ABB-F479E6B60D55",    
  year: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B7BE0722-5BA9-1614-21CE-CC3FE8FBACF2",     
  yearPlus: "https://pay360.isracard.co.il/CustomerPayment/GenericURL?SaleId=B37C2305-3B65-4C4C-4A41-65563EE81FF4"  
};
(function () {
  var WA = "https://wa.me/972506325398";
  function getSrc() {
    var q = new URLSearchParams(location.search), s = q.get("utm_source"), c = q.get("utm_campaign");
    try {
      if (s) { sessionStorage.setItem("mm_src", s); sessionStorage.setItem("mm_cmp", c || ""); }
      return { s: s || sessionStorage.getItem("mm_src") || "", c: c || sessionStorage.getItem("mm_cmp") || "" };
    } catch (e) { return { s: s || "", c: c || "" }; }
  }
  getSrc();

  /* form submit: fetch to MM_FORM_ENDPOINT, no page change (no-cors: success = request left) */
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
      /* lead source from utm (19.11.2026), saved in the sheet as מקור / קמפיין */
      var src = getSrc();
      if (!body.get("מקור")) body.set("מקור", src.s || "direct");
      if (!body.get("קמפיין") && src.c) body.set("קמפיין", src.c);
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
          p.appendChild(document.createTextNode("We couldn't send that. You can message us "));
          var a = document.createElement("a"); a.href = WA; a.target = "_blank"; a.rel = "noopener"; a.textContent = "on WhatsApp";
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
