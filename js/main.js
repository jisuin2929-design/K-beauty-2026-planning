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

  function gov(items) {
    return list(items, function (it) { return '<li class="lv' + it.lv + '">' + esc(it.text) + "</li>"; });
  }
  function rows(arr, keys, firstIsHeader) {
    return list(arr, function (r) {
      return "<tr>" + keys.map(function (k, i) {
        return i === 0 && firstIsHeader ? '<th scope="row">' + esc(r[k]) + "</th>" : "<td>" + esc(r[k]) + "</td>";
      }).join("") + "</tr>";
    });
  }
  function bar(items) {
    var total = items.reduce(function (s, x) { return s + x.mm; }, 0);
    return list(items, function (x) {
      return '<div class="bar-seg z-' + x.color + '" style="flex:' + x.mm + '"><strong>' + x.mm.toLocaleString() + "</strong><span>" + esc(x.name) + "</span></div>";
    }) + '<span class="sr-only">합계 ' + total + "mm</span>";
  }

  /* ======================================================================
     01. 개요 · 배치도
     ====================================================================== */
  var M = C.meta;
  $("#cover-event").textContent = M.event;
  $("#home-title").textContent = M.title;
  $("#cover-tagline").textContent = M.tagline;
  $("#cover-info").textContent = M.info;
  $("#summary-box").innerHTML = specs(C.summary);
  $("#zone-list").innerHTML = list(C.boothZones, function (z) {
    return '<li><a href="#/' + z.page + '"><span class="zone-code">' + esc(z.code) + '</span>' +
      '<span class="zone-swatch z-' + esc(z.color) + '" aria-hidden="true"></span>' +
      "<span><strong>" + esc(z.title) + " <em>· " + esc(z.loc) + "</em></strong><small>" + esc(z.spec) + "</small></span></a></li>";
  });
  $("#flow-steps").innerHTML = list(C.steps, function (s) { return "<li><strong>" + esc(s.title) + "</strong></li>"; });
  $("#background").innerHTML = gov(C.background);
  $("#overview-table").innerHTML = specs(C.overview);
  $("#key-message").textContent = C.message;
  $("#kpi-table").innerHTML = rows(C.kpis, ["metric", "target", "method"], true);
  $("#capacity-note").textContent = "※ " + C.capacityNote;

  /* ======================================================================
     02. 공간 · 치수
     ====================================================================== */
  $("#space-checks").innerHTML = gov(C.space.checks);
  $("#width-bar").innerHTML = bar(C.space.widths);
  $("#leftwall-bar").innerHTML = bar(C.space.leftWall);
  $("#leftwall-note").textContent = "※ " + C.space.leftWallNote;
  $("#zone-table").innerHTML = list(C.boothZones, function (z) {
    return '<tr><th scope="row"><span class="zone-code">' + esc(z.code) + "</span> " + esc(z.title) + "</th><td>" + esc(z.loc) + "</td><td>" + esc(z.spec) + "</td><td>" + esc(z.op) + "</td></tr>";
  });
  $("#space-notes").innerHTML = list(C.space.notes, li);

  /* ======================================================================
     03. 벽면 포스터
     ====================================================================== */
  $("#poster-principles").innerHTML = gov(C.poster.principles);
  $("#wall-list").innerHTML = list(C.poster.walls, function (w) {
    var part = C.parts[w.part];
    var items = C.faq.filter(function (f) { return f.part === w.part; });
    return '<section class="wall-block">' +
      '<h2 class="sec-title"><span>' + esc(w.code) + "</span>" + esc(w.wall) + " — " + esc(part.label) + ' <small class="zone-tag">' + esc(w.size) + "</small></h2>" +
      '<p class="sec-lead">' + esc(w.note) + "</p>" +
      '<div class="wall-mock" aria-label="' + esc(w.wall) + ' 포스터 구성안">' +
      '<div class="wall-zone-label" aria-hidden="true"><span>2,100mm</span><span>눈높이 1,500</span><span>900mm</span></div>' +
      '<div class="wall-inner">' +
      '<div class="wall-band"><small>' + esc(part.label) + "</small><strong>" + esc(part.title) + "</strong></div>" +
      '<ol class="wall-grid">' + list(items, function (f) {
        return '<li class="poster-card">' +
          '<span class="poster-no">' + f.id.toUpperCase() + "</span>" +
          '<h3 class="poster-q">' + esc(f.q) + "</h3>" +
          '<p class="poster-a">' + esc(f.poster) + "</p>" +
          '<ul class="chips">' + list(f.chips.slice(0, 4), li) + "</ul>" +
          '<p class="poster-visual"><strong>시각 요소</strong> ' + esc(C.visuals[f.id] || "") + "</p>" +
          "</li>";
      }) + "</ol></div></div>" +
      '<div class="wall-empty">' + esc(C.poster.install) + "</div>" +
      "</section>";
  });

  /* ======================================================================
     04. A3 책자
     ====================================================================== */
  var B = C.booklet;
  $("#booklet-specs").innerHTML = specs(B.specs);
  $("#booklet-layout").innerHTML = list(B.layout, function (l, i) {
    return '<div class="pm-row pm' + i + '" style="flex:' + l.pct + '"><strong>' + l.pct + "%</strong> " + esc(l.name) + "</div>";
  });
  $("#media-roles").innerHTML = rows(C.mediaRoles, ["name", "where", "time", "role"], true);
  $("#booklet-count").textContent = B.pages.length;
  $("#booklet-pages").innerHTML = list(B.pages, function (p) {
    var f = p.q && faqById(p.q);
    var badge = /^\d+$/.test(p.no) ? "P." + (Number(p.no) + 1) : p.no;
    if (f) {
      return '<li><details class="bk-page">' +
        '<summary><span class="bk-no">' + esc(badge) + '</span><span class="bk-head"><strong>' + f.id.toUpperCase() + ". " + esc(f.q) + "</strong>" +
        "<small>" + esc(f.poster) + "</small></span>" + icon("chevron", "gloss-chev") + "</summary>" +
        '<div class="bk-body">' +
        '<p class="bk-sec"><em>상단 20%</em> 질문 · 한 줄 답</p><p class="faq-lead">' + esc(f.poster) + "</p>" +
        '<p class="bk-sec"><em>중단 60%</em> 핵심 + 도식</p><ul class="faq-points">' + list(f.points, li) + "</ul>" +
        '<p class="poster-visual"><strong>도식</strong> ' + esc(C.visuals[f.id] || "") + "</p>" +
        '<p class="bk-sec"><em>하단 20%</em> 약사 TIP</p><p class="pharm-tip">' + icon("pharmacy") + "<span>" + esc(f.tip) + "</span></p>" +
        "</div></details></li>";
    }
    return '<li><details class="bk-page">' +
      '<summary><span class="bk-no bk-no-alt">' + esc(badge) + '</span><span class="bk-head"><strong>' + esc(p.title) + "</strong><small>" + esc(p.body[0]) + "</small></span>" + icon("chevron", "gloss-chev") + "</summary>" +
      '<div class="bk-body"><ul class="faq-points">' + list(p.body, li) + "</ul></div></details></li>";
  });
  $("#review-note-1").textContent = "※ " + C.reviewNote;

  $$("[data-expand]").forEach(function (b) {
    b.addEventListener("click", function () { $$("details", $(b.getAttribute("data-expand"))).forEach(function (d) { d.open = true; }); });
  });
  $$("[data-collapse]").forEach(function (b) {
    b.addEventListener("click", function () { $$("details", $(b.getAttribute("data-collapse"))).forEach(function (d) { d.open = false; }); });
  });

  /* ======================================================================
     05. 운영 계획
     ====================================================================== */
  var colorName = { yellow: "노랑", blue: "파랑", red: "빨강", green: "초록", purple: "보라" };
  $("#panel-title").textContent = C.sticker.title;
  $("#panel-rows").innerHTML = list(C.concerns, function (c, i) {
    return '<li class="c-' + c.color + '"><span class="panel-label">' + esc(c.label) + "</span>" +
      '<span class="panel-dots" aria-hidden="true">' + new Array(4 + (i % 2)).join("<i></i>") + "</span>" +
      '<span class="panel-color">' + esc(colorName[c.color] || c.color) + "</span></li>";
  });
  $("#sticker-rules").innerHTML = gov(C.sticker.rules);
  $("#souvenir-list").innerHTML = gov(C.souvenir);
  $("#storage-specs").innerHTML = specs(C.storage);
  $("#staff-total").textContent = C.staffTotal;
  $("#staff-table").innerHTML = rows(C.staff, ["role", "count", "where", "duty"], true);
  $("#staff-notes").innerHTML = list(C.staffNotes, li);
  $("#crowd-table").innerHTML = rows(C.crowd, ["when", "action"], true);

  /* ======================================================================
     06. 제작물 · 07. 일정
     ====================================================================== */
  $("#supplies-table").innerHTML = list(C.supplies, function (r) {
    var added = /추가/.test(r.note) ? ' class="row-added"' : "";
    return "<tr" + added + '><th scope="row">' + esc(r.item) + "</th><td>" + esc(r.spec) + "</td><td>" + esc(r.qty) + "</td><td>" + esc(r.src) + "</td><td>" + esc(r.note) + "</td></tr>";
  });
  $("#supplies-notes").innerHTML = list([C.suppliesNote, C.space.notes[2]], li);
  $("#schedule-list").innerHTML = list(C.schedule, function (s) {
    return '<li><span class="tl-when">' + esc(s.when) + "</span><span>" + esc(s.what) + "</span></li>";
  });
  $("#checks-table").innerHTML = rows(C.checks, ["item", "who", "impact"], true);
  $("#review-note-2").textContent = "※ " + C.reviewNote;
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
          '<p class="faq-oneliner"><em>포스터 한 줄 답</em>' + esc(f.poster) + "</p>" +
          '<p class="faq-lead">' + esc(f.lead) + "</p>" +
          '<ul class="chips">' + list(f.chips, li) + "</ul>" +
          '<ul class="faq-points">' + list(f.points, li) + "</ul>" +
          (f.note ? '<p class="faq-note"><strong>참고</strong> ' + esc(f.note) + "</p>" : "") +
          '<p class="pharm-tip">' + icon("pharmacy") + "<span><strong>약사 TIP</strong> " + esc(f.tip) + "</span></p>" +
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
      var hay = normalize([f.q, f.poster, f.tip, f.lead, f.summary, f.note].concat(f.chips, f.points, f.tags).join(" "));
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
  var baseTitle = "K-뷰티 부스 운영 기획안";
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
