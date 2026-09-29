/* K-뷰티 부스 홈페이지 동작 스크립트
   콘텐츠(문구)는 js/content.js 에서 수정하세요.
   페이지 주소: #/home, #/about, #/faq, #/faq/q3, #/concern, #/booth, #/pharmacy, #/tips */
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

  var pageIds = C.pages.map(function (p) { return p.id; });
  function pageById(id) { return C.pages.filter(function (p) { return p.id === id; })[0]; }

  /* ======================================================================
     메뉴 (상단 / 하단 / 홈 카드)
     ====================================================================== */
  $("#top-nav").innerHTML = list(C.pages, function (p) {
    return '<a href="#/' + p.id + '" data-nav="' + p.id + '">' + esc(p.label) + "</a>";
  });
  // 하단 고정바: 홈 + 앞의 4개 페이지
  $("#bottom-nav").innerHTML = list(C.pages.slice(0, 5), function (p) {
    return '<a href="#/' + p.id + '" data-nav="' + p.id + '">' + icon(p.icon) + "<span>" + esc(p.label) + "</span></a>";
  });
  $("#home-menu").innerHTML = list(C.pages.slice(1), function (p, i) {
    return '<li><a class="menu-card" href="#/' + p.id + '">' +
      '<span class="menu-icon m' + (i % 6) + '">' + icon(p.icon) + "</span>" +
      '<span class="menu-text"><strong>' + esc(p.label) + "</strong><small>" + esc(p.desc) + "</small></span>" +
      icon("arrow", "menu-arrow") + "</a></li>";
  });

  /* ======================================================================
     K-뷰티 페이지
     ====================================================================== */
  $("#keyword-list").innerHTML = list(C.keywords, function (k) {
    return '<li class="keyword-card">' +
      '<span class="keyword-icon">' + icon(k.icon) + "</span>" +
      '<h3><span lang="en">' + esc(k.title) + "</span><small>" + esc(k.ko) + "</small></h3>" +
      "<p>" + esc(k.desc) + "</p>" +
      (k.more ? '<ul class="keyword-more">' + list(k.more, function (m) { return "<li>" + esc(m) + "</li>"; }) + "</ul>" : "") +
      "</li>";
  });

  $("#reason-list").innerHTML = list(C.reasons, function (r, i) {
    return '<li><span class="reason-num">' + (i + 1) + "</span><div><strong>" + esc(r.title) + "</strong><p>" + esc(r.desc) + "</p></div></li>";
  });

  $("#product-list").innerHTML = list(C.productGroups, function (g) {
    return '<li><span class="product-icon">' + icon(g.icon) + "</span><strong>" + esc(g.title) + "</strong><small>" + esc(g.items) + "</small></li>";
  });

  $("#routine-list").innerHTML = list(C.routine, function (r, i) {
    return '<li><span class="routine-num">' + (i + 1) + "</span>" +
      '<span class="routine-icon">' + icon(r.icon) + "</span>" +
      "<strong>" + esc(r.title) + "</strong><small>" + esc(r.desc) + "</small></li>";
  });

  $("#routine-times").innerHTML = list(C.routineTimes, function (t) {
    return '<div class="routine-time"><strong>' + esc(t.title) + '</strong><ol class="flow">' +
      list(t.steps, function (s) { return "<li>" + esc(s) + "</li>"; }) + "</ol></div>";
  });

  /* ======================================================================
     Q&A 페이지: 아코디언 + 검색/필터
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
          '<ul class="chips">' + list(f.chips, function (c) { return "<li>" + esc(c) + "</li>"; }) + "</ul>" +
          '<ul class="faq-points">' + list(f.points, function (pt) { return "<li>" + esc(pt) + "</li>"; }) + "</ul>" +
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
      if (q) setOpen(item, visible); // 검색 중이면 결과를 펼쳐 보여줌
    });
    $$(".faq-part", faqList).forEach(function (g) {
      g.hidden = !$(".faq-item:not([hidden])", g);
    });
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
     피부고민 페이지 + 성분 사전
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
    el.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
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
    $$(".concern-card", concernList).forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    var box = $("#concern-result");
    box.className = "concern-result is-filled c-" + c.color;
    box.innerHTML =
      '<p class="concern-title"><span class="concern-dot" aria-hidden="true"></span><strong>' + esc(c.label) + "</strong>에 자주 이야기되는 키워드</p>" +
      '<ul class="concern-keys">' + list(c.keywords, function (k) {
        return ingNames.indexOf(k) >= 0
          ? '<li><button type="button" class="key-link" data-ing="' + esc(k) + '">' + esc(k) + '<span class="sr-only"> 성분 설명 보기</span></button></li>'
          : "<li>" + esc(k) + "</li>";
      }) + "</ul>" +
      '<p class="concern-tip">' + esc(c.tip) + "</p>" +
      (c.care ? '<h3 class="concern-sub">생활 속 관리 팁</h3><ul class="care-list">' + list(c.care, function (t) { return "<li>" + esc(t) + "</li>"; }) + "</ul>" : "") +
      (c.ask ? '<p class="concern-ask">' + icon("pharmacy") + "<span>" + esc(c.ask) + "</span></p>" : "");
  });

  $("#concern-result").addEventListener("click", function (e) {
    var b = e.target.closest(".key-link");
    if (b) openIngredient(b.getAttribute("data-ing"));
  });

  /* ======================================================================
     부스안내 페이지
     ====================================================================== */
  $("#step-list").innerHTML = list(C.steps, function (s, i) {
    return '<li class="step"><span class="step-num">STEP ' + (i + 1) + "</span>" +
      "<h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p></li>";
  });
  $("#zone-list").innerHTML = list(C.boothZones, function (z) {
    return '<li><span class="zone-swatch z-' + esc(z.color) + '" aria-hidden="true"></span><div><strong>' + esc(z.title) + "</strong><p>" + esc(z.desc) + "</p></div></li>";
  });
  $("#booth-tips").innerHTML = list(C.boothTips, function (t) { return "<li>" + esc(t) + "</li>"; });

  /* ======================================================================
     약사상담 페이지
     ====================================================================== */
  $("#pharm-questions").innerHTML = list(C.pharmacistQuestions, function (q) { return "<li>" + esc(q) + "</li>"; });
  $("#consult-prep").innerHTML = list(C.consultPrep, function (p) {
    return '<li><span class="prep-icon">' + icon(p.icon) + "</span><strong>" + esc(p.title) + "</strong><small>" + esc(p.desc) + "</small></li>";
  });
  $("#functional-box").innerHTML = "<h2>" + esc(C.functional.title) + "</h2><ul>" +
    list(C.functional.points, function (t) { return "<li>" + esc(t) + "</li>"; }) + "</ul>";

  /* ======================================================================
     O/X 페이지
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
  function updateScore() {
    var n = $$(".tip-card.is-open").length;
    $("#quiz-score").textContent = n === C.tips.length ? "모두 확인했어요! 궁금한 점은 약사에게 물어보세요." : "정답 확인 " + n + " / " + C.tips.length;
  }
  $("#tip-list").addEventListener("click", function (e) {
    var card = e.target.closest(".tip-card");
    if (!card) return;
    var open = card.getAttribute("aria-expanded") !== "true";
    card.setAttribute("aria-expanded", String(open));
    $(".tip-a", card).hidden = !open;
    $(".tip-hint", card).hidden = open;
    card.classList.toggle("is-open", open);
    updateScore();
  });
  updateScore();

  /* ======================================================================
     페이지 전환 (해시 라우터)
     ====================================================================== */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var baseTitle = "2026 건강서울페스티벌 K-뷰티 부스";
  var currentPage = null;

  function parseHash() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
    if (!h) return { page: "home" };
    var parts = h.split("/");
    if (/^q[1-8]$/.test(parts[0])) return { page: "faq", sub: parts[0] }; // 예전 주소(#q3) 호환
    if (pageIds.indexOf(parts[0]) >= 0) return { page: parts[0], sub: parts[1] };
    return null; // #main 등 페이지가 아닌 해시는 무시
  }

  function renderPager(id) {
    var i = pageIds.indexOf(id);
    var prev = C.pages[i - 1];
    var next = C.pages[i + 1];
    $("#pager").innerHTML =
      (prev ? '<a class="pager-link prev" href="#/' + prev.id + '"><small>이전</small><strong>' + esc(prev.label) + "</strong></a>" : "<span></span>") +
      (next ? '<a class="pager-link next" href="#/' + next.id + '"><small>다음</small><strong>' + esc(next.label) + "</strong></a>" : '<a class="pager-link next" href="#/home"><small>처음으로</small><strong>홈</strong></a>');
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
    document.title = id === "home" ? "K-BEAUTY가 뭐예요? | " + baseTitle : p.title + " | " + baseTitle;
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
     공유 / QR (현재 보고 있는 페이지 주소로 생성)
     ====================================================================== */
  var dialog = $("#share-dialog");
  var qrLib = null;

  function shareUrl() {
    return location.href.split("#")[0] + "#/" + (currentPage || "home");
  }

  function drawQr(url) {
    var qr = window.qrcode(0, "M");
    qr.addData(url);
    qr.make();
    $("#qr-box").innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true });
  }
  function qrFail() {
    qrLib = null;
    $("#qr-box").innerHTML = '<span class="qr-loading">QR 코드를 불러오지 못했어요. 링크 복사를 이용해 주세요.</span>';
  }
  function showQr(url) {
    if (window.qrcode) { try { drawQr(url); } catch (err) { qrFail(); } return; }
    $("#qr-box").innerHTML = '<span class="qr-loading">QR 코드 생성 중…</span>';
    if (qrLib) return;
    qrLib = document.createElement("script");
    qrLib.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
    qrLib.onload = function () { try { drawQr(shareUrl()); } catch (err) { qrFail(); } };
    qrLib.onerror = qrFail;
    document.head.appendChild(qrLib);
  }

  if (navigator.share) $("#btn-native-share").hidden = false;
  $("#btn-native-share").addEventListener("click", function () {
    navigator.share({ title: document.title, url: shareUrl() }).catch(function () {});
  });
  $("#btn-copy").addEventListener("click", function () {
    var status = $("#share-status");
    var url = shareUrl();
    var done = function () { status.textContent = "링크를 복사했어요."; $("#btn-copy").textContent = "복사 완료!"; };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done, function () { status.textContent = "복사에 실패했어요. 주소를 직접 선택해 주세요."; });
    } else {
      var r = document.createRange();
      r.selectNodeContents($("#share-url"));
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try { document.execCommand("copy"); done(); } catch (err) { status.textContent = "주소를 길게 눌러 복사해 주세요."; }
    }
  });

  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      var url = shareUrl();
      $("#share-url").textContent = url;
      $("#btn-copy").textContent = "링크 복사";
      if (dialog.showModal) dialog.showModal();
      else if (navigator.share) navigator.share({ title: document.title, url: url }).catch(function () {});
      showQr(url);
    });
  });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });
})();
