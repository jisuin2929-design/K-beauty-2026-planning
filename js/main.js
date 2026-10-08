/* K-뷰티 부스 기획안 페이지 전환 스크립트
   문구는 index.html 안의 각 <section class="page">에서 바로 고치면 됩니다.
   페이지 주소: #/home #/layout #/content #/booklet #/program #/operation #/faq #/faq/q3 #/sponsors #/prep */
(function () {
  "use strict";
  var pages = Array.prototype.slice.call(document.querySelectorAll(".page"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav]"));
  var pager = document.getElementById("pager");
  var ids = pages.map(function (p) { return p.getAttribute("data-page"); });
  var labels = {};
  navLinks.forEach(function (a) { labels[a.getAttribute("data-nav")] = a.textContent.replace(/^\d+/, ""); });

  function show() {
    var parts = (location.hash || "#/home").replace(/^#\/?/, "").split("/");
    var id = ids.indexOf(parts[0]) >= 0 ? parts[0] : "home";
    pages.forEach(function (p) { p.hidden = p.getAttribute("data-page") !== id; });
    navLinks.forEach(function (a) {
      if (a.getAttribute("data-nav") === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var i = ids.indexOf(id), html = "";
    if (i > 0) html += '<a class="prev" href="#/' + ids[i - 1] + '"><small>이전</small>' + labels[ids[i - 1]] + "</a>";
    if (i < ids.length - 1) html += '<a class="next" href="#/' + ids[i + 1] + '"><small>다음</small>' + labels[ids[i + 1]] + "</a>";
    pager.innerHTML = html;
    if (parts[1]) {
      var el = document.getElementById("faq-" + parts[1]);
      if (el) { el.open = true; el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", show);
  show();

  var toggle = document.getElementById("faq-toggle");
  if (toggle) toggle.addEventListener("click", function () {
    var all = document.querySelectorAll("details.faq");
    var open = toggle.textContent === "모두 펼치기";
    Array.prototype.forEach.call(all, function (d) { d.open = open; });
    toggle.textContent = open ? "모두 접기" : "모두 펼치기";
  });

  var openState = [];
  window.addEventListener("beforeprint", function () {
    openState = Array.prototype.map.call(document.querySelectorAll("details.faq"), function (d) { var o = d.open; d.open = true; return o; });
  });
  window.addEventListener("afterprint", function () {
    Array.prototype.forEach.call(document.querySelectorAll("details.faq"), function (d, i) { d.open = openState[i]; });
  });
  document.getElementById("print-all").addEventListener("click", function () { window.print(); });
})();
