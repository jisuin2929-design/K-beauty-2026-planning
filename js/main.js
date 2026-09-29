/* K-뷰티 부스 기획안 동작 스크립트
   콘텐츠(문구)는 js/content.js 에서 수정하세요.
   페이지 주소: #/home, #/poster, #/booklet, #/sticker, #/operation, #/faq, #/faq/q3, #/concern, #/pharmacy, #/tips */
(function () {
  "use strict";

  var C = window.KB_CONTENT;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="i ' + (cls || "") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }
  function list(arr, fn) { return arr.map(fn).join(""); }
  function li(t) { return "<li>" + esc(t) + "</li>"; }
  function specs(pairs) {
    return list(pairs, function (p) { return "<div><dt>" + esc(p[0]) + "</dt><dd>" + esc(p[1]) + "</dd></div>"; });
  }
  function faqById(id) { return C.faq.filter(function (f) { return f.id === id; })[0]; }

  var pageIds = C.pages.map(function (p) { return p.id; });
  function pageById(id) { return C.pages.filter(function (p) { return p.id === id; })[0]; }

  /* ======================================================================
     목차 메뉴
     ====================================================================== */
  $("#top-nav").innerHTML = list(C.pages, function (p, i) {
    var sep = p.group === "appendix" && C.pages[i - 1].group !== "appendix" ? '<span class="nav-sep" aria-hidden="true"></span>' : "";
    return sep + '<a href="#/' + p.id + '" data-nav="' + p.id + '"><em>' + esc(p.no) + "</em>" + esc(p.label) + "</a>";
  });
  $("#home-menu").innerHTML = list(C.pages.slice(1), function (p, i) {
    return '<li><a class="menu-card" href="#/' + p.id + '">' +
      '<span class="menu-icon m' + (i % 6) + '">' + icon(p.icon) + "</span>" +
      '<span class="menu-text"><small class="menu-no">' + esc(p.no) + "</small><strong>" + esc(p.label) + "</strong><small>" + esc(p.desc) + "</small></span>" +
      icon("arrow", "menu-arrow") + "</a></li>";
  });

  /* ======================================================================
     01. 개요 · 배치도
     ====================================================================== */
  var O = C.overview;
  $("#cover-msg").textContent = O.message;
  $("#zone-list").innerHTML = list(C.boothZones, function (z) {
    return '<li><a href="#/' + z.page + '"><span class="zone-code">' + esc(z.code) + '</span>' +
      '<span class="zone-swatch z-' + esc(z.color) + '" aria-hidden="true"></span>' +
      "<span><strong>" + esc(z.title) + "</strong><small>" + esc(z.desc) + "</small></span></a></li>";
  });
  $("#flow-steps").innerHTML = list(C.steps, function (s) { return "<li><strong>" + esc(s.title) + "</strong></li>"; });
  $("#overview-facts").innerHTML = specs(O.facts);
  $("#overview-purpose").innerHTML = list(O.purpose, li);
  $("#key-message").textContent = O.message;
  $("#sub-messages").innerHTML = list(O.subMessages, li);
  $("#concept-list").innerHTML = list(O.concept, function (c) {
    return '<li><strong lang="en">' + esc(c.title) + "</strong><span>" + esc(c.desc) + "</span></li>";
  });
  $("#tone-list").innerHTML = list(O.tone, li);

  /* ======================================================================
     02. 벽면 포스터
     ====================================================================== */
  $("#poster-principles").innerHTML = list(C.poster.principles, li);
  $("#wall-list").innerHTML = list(C.poster.walls, function (w) {
    var part = C.parts[w.part];
    var items = C.faq.filter(function (f) { return f.part === w.part; });
    return '<section class="wall-block">' +
      '<h2 class="sec-title"><span>' + esc(w.code) + "</span>" + esc(w.wall) + " — " + esc(part.label) + "</h2>" +
      '<p class="sec-lead">' + esc(w.note) + "</p>" +
      '<div class="wall-mock" aria-label="' + esc(w.wall) + ' 정면 구성안">' +
      '<div class="wall-zone-label" aria-hidden="true"><span>상단 · PART 제목</span><span>눈높이 · 질문 포스터 2×2</span><span>하단 · 비움</span></div>' +
      '<div class="wall-inner">' +
      '<div class="wall-band"><small>' + esc(part.label) + "</small><strong>" + esc(part.title) + "</strong></div>" +
      '<ol class="wall-grid">' + list(items, function (f) {
        return '<li class="poster-card">' +
          '<span class="poster-no">' + f.id.toUpperCase() + "</span>" +
          '<h3 class="poster-q">' + esc(f.q) + "</h3>" +
          '<p class="poster-a">' + esc(f.summary) + "</p>" +
          '<ul class="chips">' + list(f.chips.slice(0, 4), li) + "</ul>" +
          '<p class="poster-visual"><strong>시각 요소</strong> ' + esc(C.visuals[f.id] || "") + "</p>" +
          '<a class="poster-link" href="#/faq/' + f.id + '">원고 전문 보기 →</a>' +
          "</li>";
      }) + "</ol>" +
      '<div class="wall-empty">하단 비움 — 바닥 가까운 곳에는 정보성 콘텐츠를 두지 않음</div>' +
      "</div></div></section>";
  });

  /* ======================================================================
     03. A3 책자
     ====================================================================== */
  var B = C.booklet;
  $("#booklet-specs").innerHTML = specs(B.specs);
  $("#booklet-why").innerHTML = list(B.why, li);
  $("#media-roles").innerHTML = list(C.mediaRoles, function (m) {
    return '<tr><th scope="row">' + esc(m.name) + "</th><td>" + esc(m.where) + "</td><td>" + esc(m.time) + "</td><td>" + esc(m.role) + "</td></tr>";
  });
  $("#booklet-count").textContent = B.pages.length;
  $("#booklet-pages").innerHTML = list(B.pages, function (p) {
    var f = p.q && faqById(p.q);
    var badge = /^\d+$/.test(p.no) ? "P." + p.no : p.no;
    if (f) {
      return '<li><details class="bk-page">' +
        '<summary><span class="bk-no">' + esc(badge) + '</span><span class="bk-head"><strong>' + f.id.toUpperCase() + ". " + esc(f.q) + "</strong>" +
        "<small>" + esc(C.parts[f.part].label) + " · 한 줄 답: " + esc(f.summary) + "</small></span>" + icon("chevron", "gloss-chev") + "</summary>" +
        '<div class="bk-body">' +
        '<p class="faq-lead">' + esc(f.lead) + "</p>" +
        '<h4>본문 포인트</h4><ul class="faq-points">' + list(f.points, li) + "</ul>" +
        (f.note ? '<p class="faq-note"><strong>참고</strong> ' + esc(f.note) + "</p>" : "") +
        '<p class="poster-visual"><strong>시각 요소</strong> ' + esc(C.visuals[f.id] || "") + "</p>" +
        "</div></details></li>";
    }
    return '<li><details class="bk-page">' +
      '<summary><span class="bk-no bk-no-alt">' + esc(badge) + '</span><span class="bk-head"><strong>' + esc(p.title) + "</strong><small>" + esc(p.body[0]) + "</small></span>" + icon("chevron", "gloss-chev") + "</summary>" +
      '<div class="bk-body"><ul class="faq-points">' + list(p.body, li) + "</ul></div></details></li>";
  });

  $$("[data-expand]").forEach(function (b) {
    b.addEventListener("click", function () { $$("details", $(b.getAttribute("data-expand"))).forEach(function (d) { d.open = true; }); });
  });
  $$("[data-collapse]").forEach(function (b) {
    b.addEventListener("click", function () { $$("details", $(b.getAttribute("data-collapse"))).forEach(function (d) { d.open = false; }); });
  });

  /* ======================================================================
     04. 스티커 · 기념품 · 짐 보관
     ====================================================================== */
  var S = C.stickerPanel;
  $("#panel-title").innerHTML = esc(S.title) + '<small>(대안: ' + esc(S.altTitle) + ")</small>";
  $("#panel-rows").innerHTML = list(C.concerns, function (c, i) {
    return '<li class="c-' + c.color + '"><span class="panel-label">' + esc(c.label) + "</span>" +
      '<span class="panel-dots" aria-hidden="true">' + new Array(4 + (i % 2)).join('<i></i>') + "</span></li>";
  });
  $("#panel-howto").innerHTML = list(S.howto, li);
  $("#panel-notes").innerHTML = list(S.notes, li);
  $("#souvenir-specs").innerHTML = specs(C.souvenir);
  $("#storage-specs").innerHTML = specs(C.storage);

  /* ======================================================================
     05. 동선 · 운영
     ====================================================================== */
  $("#step-list").innerHTML = list(C.steps, function (s, i) {
    return '<li class="step"><span class="step-num">STEP ' + (i + 1) + "</span>" +
      "<h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p></li>";
  });
  $("#flow-rules").innerHTML = list(C.flowRules, li);
  $("#booth-tips").innerHTML = list(C.boothTips, li);
  function propRows(rows) {
    return list(rows, function (r) { return '<tr><th scope="row">' + esc(r[0]) + "</th><td>" + esc(r[1]) + "</td></tr>"; });
  }
  $("#props-ok").innerHTML = propRows(C.props.recommend);
  $("#props-ng").innerHTML = propRows(C.props.avoid);
  $("#caution-list").innerHTML = list(C.cautions, li);

  /* ======================================================================
     06. Q&A 원고: 아코디언 + 검색/필터
     ====================================================================== */
  var faqList = $("#faq-list");
  var currentPart = "all";

  faqList.innerHTML = list([1, 2], function (p) {
    var items = C.faq.filter(function (f) { return f.part === p; });
    return '<div class="faq-part" data-part-group="' + p + '">' +
      '<h2 class="faq-part-title"><span>' + esc(C.parts[p].label) + "</span>" + esc(C.parts[p].title) + "</h2>" +
      list(items, function (f) {
        return '<article class="faq-item" data-id="' + f.id + '" data-part="' + f.part + '">' +
          '<h3 class="faq-q"><button type="button" aria-expanded="false" aria-controls="' + f.id + '-a" id="' + f.id + '-btn">' +
          '<span class="faq-num">' + f.id.toUpperCase() + "</span>" +
          '<span class="faq-q-text">' + esc(f.q) + "</span>" +
          icon("chevron", "faq-chev") + "</button></h3>" +
          '<div class="faq-a" id="' + f.id + '-a" role="region" aria-labelledby="' + f.id + '-btn" hidden>' +
          '<p class="faq-lead">' + esc(f.lead) + "</p>" +
          '<ul class="chips">' + list(f.chips, li) + "</ul>" +
          '<ul class="faq-points">' + list(f.points, li) + "</ul>" +
          (f.note ? '<p class="faq-note"><strong>참고</strong> ' + esc(f.note) + "</p>" : "") +
          '<p class="faq-summary">' + icon(f.icon) + "<span>" + esc(f.summary) + "</span></p>" +
          "</div></article>";
      }) + "</div>";
  });

  function setOpen(item, open) {
    $(".faq-q button", item).setAttribute("aria-expanded", String(open));
    $(".faq-a", item).hidden = !open;
    item.classList.toggle("is-open", open);
  }
  faqList.addEventListener("click", function (e) {
    var btn = e.target.closest(".faq-q button");
    if (!btn) return;
    setOpen(btn.closest(".faq-item"), btn.getAttribute("aria-expanded") !== "true");
  });
  $("#faq-open-all").addEventListener("click", function () {
    $$(".faq-item:not([hidden])", faqList).forEach(function (it) { setOpen(it, true); });
  });
  $("#faq-close-all").addEventListener("click", function () {
    $$(".faq-item", faqList).forEach(function (it) { setOpen(it, false); });
  });

  function normalize(s) { return String(s).toLowerCase().replace(/\s+/g, ""); }
  function applyFaqFilter() {
    var q = normalize($("#faq-search").value);
    var shown = 0;
    C.faq.forEach(function (f) {
      var item = $('.faq-item[data-id="' + f.id + '"]', faqList);
      var partOk = currentPart === "all" || String(f.part) === currentPart;
      var hay = normalize([f.q, f.lead, f.summary, f.note].concat(f.chips, f.points, f.tags).join(" "));
      var visible = partOk && (!q || hay.indexOf(q) !== -1);
      item.hidden = !visible;
      if (visible) shown++;
      if (q) setOpen(item, visible);
    });
    $$(".faq-part", faqList).forEach(function (g) { g.hidden = !$(".faq-item:not([hidden])", g); });
    $("#faq-empty").hidden = shown !== 0;
    $("#faq-status").textContent = q ? "검색 결과 " + shown + "개" : "";
  }
  var searchTimer;
  $("#faq-search").addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(applyFaqFilter, 150);
  });
  var tabs = $$(".tab");
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    currentPart = tab.getAttribute("data-part");
    applyFaqFilter();
  }
  tabs.forEach(function (t, i) {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      selectTab(next);
    });
  });

  /* ======================================================================
     부록 A. 피부고민 + 성분 사전
     ====================================================================== */
  var ingNames = C.ingredients.map(function (g) { return g.name; });
  $("#glossary").innerHTML = list(C.ingredients, function (g, i) {
    return '<details class="gloss-item" id="ing-' + i + '">' +
      "<summary><strong>" + esc(g.name) + '</strong><small lang="en">' + esc(g.en) + "</small>" + icon("chevron", "gloss-chev") + "</summary>" +
      '<div class="gloss-body"><p>' + esc(g.desc) + "</p>" +
      (g.caution ? '<p class="gloss-caution"><strong>주의</strong> ' + esc(g.caution) + "</p>" : "") +
      "</div></details>";
  });
  function openIngredient(name) {
    var idx = ingNames.indexOf(name);
    if (idx < 0) return;
    var el = document.getElementById("ing-" + idx);
    el.open = true;
    el.scrollIntoView({ block: "center" });
    $("summary", el).focus({ preventScroll: true });
  }
  var concernList = $("#concern-list");
  concernList.innerHTML = list(C.concerns, function (c) {
    return '<button type="button" class="concern-card c-' + c.color + '" data-id="' + c.id + '" aria-pressed="false">' +
      '<span class="concern-dot" aria-hidden="true"></span>' + esc(c.label) + "</button>";
  });
  concernList.addEventListener("click", function (e) {
    var btn = e.target.closest(".concern-card");
    if (!btn) return;
    var c = C.concerns.filter(function (x) { return x.id === btn.getAttribute("data-id"); })[0];
    $$(".concern-card", concernList).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    var box = $("#concern-result");
    box.className = "concern-result is-filled c-" + c.color;
    box.innerHTML =
      '<p class="concern-title"><span class="concern-dot" aria-hidden="true"></span><strong>' + esc(c.label) + "</strong>에 자주 이야기되는 키워드</p>" +
      '<ul class="concern-keys">' + list(c.keywords, function (k) {
        return ingNames.indexOf(k) >= 0
          ? '<li><button type="button" class="key-link" data-ing="' + esc(k) + '">' + esc(k) + '<span class="sr-only"> 성분 설명 보기</span></button></li>'
          : li(k);
      }) + "</ul>" +
      '<p class="concern-tip">' + esc(c.tip) + "</p>" +
      (c.care ? '<h3 class="concern-sub">생활 속 관리 팁</h3><ul class="care-list">' + list(c.care, li) + "</ul>" : "") +
      (c.ask ? '<p class="concern-ask">' + icon("pharmacy") + "<span>" + esc(c.ask) + "</span></p>" : "");
  });
  $("#concern-result").addEventListener("click", function (e) {
    var b = e.target.closest(".key-link");
    if (b) openIngredient(b.getAttribute("data-ing"));
  });

  /* ======================================================================
     부록 B. 약사상담
     ====================================================================== */
  $("#pharm-questions").innerHTML = list(C.pharmacistQuestions, li);
  $("#consult-prep").innerHTML = list(C.consultPrep, function (p) {
    return '<li><span class="prep-icon">' + icon(p.icon) + "</span><strong>" + esc(p.title) + "</strong><small>" + esc(p.desc) + "</small></li>";
  });
  $("#functional-box").innerHTML = "<h2>" + esc(C.functional.title) + "</h2><ul>" + list(C.functional.points, li) + "</ul>";

  /* ======================================================================
     부록 C. O/X
     ====================================================================== */
  $("#tip-list").innerHTML = list(C.tips, function (t, i) {
    var ans = t.a ? "O" : "X";
    return '<li><button type="button" class="tip-card" aria-expanded="false" aria-controls="tip-' + i + '">' +
      '<span class="tip-q">' + esc(t.q) + "</span>" +
      '<span class="tip-hint" aria-hidden="true">눌러서 정답 보기</span>' +
      '<span class="tip-a" id="tip-' + i + '" hidden>' +
      '<span class="tip-ox tip-' + ans.toLowerCase() + '" aria-label="정답 ' + ans + '">' + ans + "</span>" +
      '<span class="tip-why">' + esc(t.why) + "</span></span></button></li>";
  });
  function setTip(card, open) {
    card.setAttribute("aria-expanded", String(open));
    $(".tip-a", card).hidden = !open;
    $(".tip-hint", card).hidden = open;
    card.classList.toggle("is-open", open);
  }
  function updateScore() {
    var n = $$(".tip-card.is-open").length;
    $("#quiz-score").textContent = "정답 확인 " + n + " / " + C.tips.length;
  }
  $("#tip-list").addEventListener("click", function (e) {
    var card = e.target.closest(".tip-card");
    if (!card) return;
    setTip(card, card.getAttribute("aria-expanded") !== "true");
    updateScore();
  });
  updateScore();

  /* ======================================================================
     페이지 전환 (해시 라우터)
     ====================================================================== */
  var baseTitle = "K-뷰티 부스 기획안";
  var currentPage = null;

  function parseHash() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (!h) return { page: "home" };
    var parts = h.split("/");
    if (/^q[1-8]$/.test(parts[0])) return { page: "faq", sub: parts[0] };
    if (pageIds.indexOf(parts[0]) >= 0) return { page: parts[0], sub: parts[1] };
    return null; // #main 등 페이지가 아닌 해시는 무시
  }

  function renderPager(id) {
    var i = pageIds.indexOf(id);
    var prev = C.pages[i - 1];
    var next = C.pages[i + 1];
    $("#pager").innerHTML =
      (prev ? '<a class="pager-link prev" href="#/' + prev.id + '"><small>이전 · ' + esc(prev.no) + "</small><strong>" + esc(prev.label) + "</strong></a>" : "<span></span>") +
      (next ? '<a class="pager-link next" href="#/' + next.id + '"><small>다음 · ' + esc(next.no) + "</small><strong>" + esc(next.label) + "</strong></a>" : '<a class="pager-link next" href="#/home"><small>처음으로</small><strong>개요·배치도</strong></a>');
  }

  function showPage(route, fromNav) {
    var id = route.page;
    var changed = id !== currentPage;
    $$(".page").forEach(function (sec) { sec.hidden = sec.getAttribute("data-page") !== id; });
    $$("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === id) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var active = $('#top-nav [data-nav="' + id + '"]');
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center" });

    var p = pageById(id);
    document.title = p.no + " " + p.title + " | " + baseTitle;
    renderPager(id);
    currentPage = id;

    if (id === "faq" && route.sub) {
      var item = $('.faq-item[data-id="' + route.sub + '"]', faqList);
      if (item) {
        setOpen(item, true);
        setTimeout(function () { item.scrollIntoView({ block: "start" }); $(".faq-q button", item).focus({ preventScroll: true }); }, 0);
        return;
      }
    }
    if (changed || fromNav) {
      window.scrollTo(0, 0);
      if (fromNav) {
        var h1 = $('.page[data-page="' + id + '"] h1');
        if (h1) { h1.setAttribute("tabindex", "-1"); h1.focus({ preventScroll: true }); }
      }
    }
  }

  window.addEventListener("hashchange", function () {
    var r = parseHash();
    if (r) showPage(r, true);
  });
  showPage(parseHash() || { page: "home" }, false);

  /* ======================================================================
     전체 인쇄: 모든 페이지·접힌 내용을 펼쳐서 인쇄
     ====================================================================== */
  var printState = null;
  window.addEventListener("beforeprint", function () {
    printState = {
      details: $$("details").filter(function (d) { return !d.open; }),
      faq: $$(".faq-item").filter(function (it) { return !it.classList.contains("is-open"); })
    };
    printState.details.forEach(function (d) { d.open = true; });
    printState.faq.forEach(function (it) { setOpen(it, true); });
  });
  window.addEventListener("afterprint", function () {
    if (!printState) return;
    printState.details.forEach(function (d) { d.open = false; });
    printState.faq.forEach(function (it) { setOpen(it, false); });
    printState = null;
  });
  $("#btn-print").addEventListener("click", function () { window.print(); });
})();
