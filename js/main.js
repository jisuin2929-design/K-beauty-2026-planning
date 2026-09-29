/* K-뷰티 부스 홈페이지 동작 스크립트
   콘텐츠(문구)는 js/content.js 에서 수정하세요. */
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

  /* ---------- 핵심 키워드 & 루틴 ---------- */
  $("#keyword-list").innerHTML = C.keywords.map(function (k) {
    return '<li class="keyword-card reveal">' +
      '<span class="keyword-icon">' + icon(k.icon) + "</span>" +
      '<h3><span lang="en">' + esc(k.title) + "</span><small>" + esc(k.ko) + "</small></h3>" +
      "<p>" + esc(k.desc) + "</p></li>";
  }).join("");

  $("#routine-list").innerHTML = C.routine.map(function (r, i) {
    return '<li><span class="routine-num">' + (i + 1) + "</span>" +
      '<span class="routine-icon">' + icon(r.icon) + "</span>" +
      "<strong>" + esc(r.title) + "</strong><small>" + esc(r.desc) + "</small></li>";
  }).join("");

  /* ---------- FAQ 아코디언 + 검색/필터 ---------- */
  var faqList = $("#faq-list");
  var currentPart = "all";

  function renderFaq() {
    var html = "";
    [1, 2].forEach(function (p) {
      var items = C.faq.filter(function (f) { return f.part === p; });
      html += '<div class="faq-part" data-part-group="' + p + '">' +
        '<h3 class="faq-part-title"><span>' + esc(C.parts[p].label) + "</span>" + esc(C.parts[p].title) + "</h3>";
      items.forEach(function (f) {
        var num = f.id.toUpperCase();
        html += '<article class="faq-item" data-id="' + f.id + '" data-part="' + f.part + '">' +
          '<h4 class="faq-q"><button type="button" aria-expanded="false" aria-controls="' + f.id + '-a" id="' + f.id + '-btn">' +
          '<span class="faq-num">' + num + "</span>" +
          '<span class="faq-q-text">' + esc(f.q) + "</span>" +
          icon("chevron", "faq-chev") + "</button></h4>" +
          '<div class="faq-a" id="' + f.id + '-a" role="region" aria-labelledby="' + f.id + '-btn" hidden>' +
          '<p class="faq-lead">' + esc(f.lead) + "</p>" +
          '<ul class="chips">' + f.chips.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
          '<ul class="faq-points">' + f.points.map(function (pt) { return "<li>" + esc(pt) + "</li>"; }).join("") + "</ul>" +
          (f.note ? '<p class="faq-note"><strong>참고</strong> ' + esc(f.note) + "</p>" : "") +
          '<p class="faq-summary">' + icon(f.icon) + "<span>" + esc(f.summary) + "</span></p>" +
          "</div></article>";
      });
      html += "</div>";
    });
    faqList.innerHTML = html;
  }
  renderFaq();

  function setOpen(item, open) {
    var btn = $(".faq-q button", item);
    var panel = $(".faq-a", item);
    btn.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    item.classList.toggle("is-open", open);
  }

  faqList.addEventListener("click", function (e) {
    var btn = e.target.closest(".faq-q button");
    if (!btn) return;
    var item = btn.closest(".faq-item");
    setOpen(item, btn.getAttribute("aria-expanded") !== "true");
  });

  function normalize(s) { return String(s).toLowerCase().replace(/\s+/g, ""); }

  function applyFaqFilter() {
    var q = normalize($("#faq-search").value);
    var shown = 0;
    C.faq.forEach(function (f) {
      var item = $('.faq-item[data-id="' + f.id + '"]', faqList);
      var partOk = currentPart === "all" || String(f.part) === currentPart;
      var hay = normalize([f.q, f.lead, f.summary, f.note].concat(f.chips, f.points, f.tags).join(" "));
      var textOk = !q || hay.indexOf(q) !== -1;
      var visible = partOk && textOk;
      item.hidden = !visible;
      if (visible) shown++;
      // 검색 중이면 결과를 자동으로 펼쳐 보여줌
      if (q) setOpen(item, visible);
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

  // URL 해시로 특정 질문 바로 열기 (예: index.html#q3 — QR 코드별 링크에 활용 가능)
  function openFromHash() {
    var id = location.hash.slice(1);
    var item = id && $('.faq-item[data-id="' + id + '"]', faqList);
    if (!item) return;
    setOpen(item, true);
    item.scrollIntoView({ block: "start" });
  }
  window.addEventListener("hashchange", openFromHash);
  openFromHash();

  /* ---------- 피부 고민 선택 ---------- */
  var concernList = $("#concern-list");
  concernList.innerHTML = C.concerns.map(function (c) {
    return '<button type="button" class="concern-card c-' + c.color + '" data-id="' + c.id + '" aria-pressed="false">' +
      '<span class="concern-dot" aria-hidden="true"></span>' + esc(c.label) + "</button>";
  }).join("");

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
      '<ul class="concern-keys">' + c.keywords.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ul>" +
      '<p class="concern-tip">' + esc(c.tip) + "</p>";
  });

  /* ---------- 부스 참여 스텝 ---------- */
  $("#step-list").innerHTML = C.steps.map(function (s, i) {
    return '<li class="step reveal"><span class="step-num">STEP ' + (i + 1) + "</span>" +
      "<h3>" + esc(s.title) + "</h3><p>" + esc(s.desc) + "</p></li>";
  }).join("");

  /* ---------- 약사 질문 예시 ---------- */
  $("#pharm-questions").innerHTML = C.pharmacistQuestions.map(function (q) {
    return "<li>" + esc(q) + "</li>";
  }).join("");

  /* ---------- O/X 퀵 팁 ---------- */
  $("#tip-list").innerHTML = C.tips.map(function (t, i) {
    var ans = t.a ? "O" : "X";
    return '<li class="reveal"><button type="button" class="tip-card" aria-expanded="false" aria-controls="tip-' + i + '">' +
      '<span class="tip-q">' + esc(t.q) + "</span>" +
      '<span class="tip-hint" aria-hidden="true">눌러서 정답 보기</span>' +
      '<span class="tip-a" id="tip-' + i + '" hidden>' +
      '<span class="tip-ox tip-' + ans.toLowerCase() + '" aria-label="정답 ' + ans + '">' + ans + "</span>" +
      '<span class="tip-why">' + esc(t.why) + "</span></span></button></li>";
  }).join("");

  $("#tip-list").addEventListener("click", function (e) {
    var card = e.target.closest(".tip-card");
    if (!card) return;
    var open = card.getAttribute("aria-expanded") !== "true";
    card.setAttribute("aria-expanded", String(open));
    $(".tip-a", card).hidden = !open;
    $(".tip-hint", card).hidden = open;
    card.classList.toggle("is-open", open);
  });

  /* ---------- 가벼운 스크롤 등장 효과 ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- 하단/상단 네비 현재 위치 표시 ---------- */
  var navLinks = $$(".bottom-nav a, .top-nav a");
  if ("IntersectionObserver" in window) {
    var secIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = "#" + en.target.id;
        navLinks.forEach(function (a) {
          if (a.getAttribute("href") === id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["about", "faq", "concern", "booth", "pharmacy", "tips"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) secIO.observe(el);
    });
  }

  /* ---------- 공유 / QR ---------- */
  var dialog = $("#share-dialog");
  var pageUrl = location.href.split("#")[0];
  var qrLoaded = false;

  function loadQr() {
    if (qrLoaded) return;
    qrLoaded = true;
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";
    s.onload = function () {
      try {
        var qr = window.qrcode(0, "M");
        qr.addData(pageUrl);
        qr.make();
        $("#qr-box").innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true });
      } catch (err) { qrFail(); }
    };
    s.onerror = qrFail;
    document.head.appendChild(s);
  }
  function qrFail() {
    qrLoaded = false;
    $("#qr-box").innerHTML = '<span class="qr-loading">QR 코드를 불러오지 못했어요. 링크 복사를 이용해 주세요.</span>';
  }

  if (navigator.share) $("#btn-native-share").hidden = false;
  $("#btn-native-share").addEventListener("click", function () {
    navigator.share({ title: document.title, url: pageUrl }).catch(function () {});
  });
  $("#btn-copy").addEventListener("click", function () {
    var status = $("#share-status");
    var done = function () { status.textContent = "링크를 복사했어요."; $("#btn-copy").textContent = "복사 완료!"; };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(pageUrl).then(done, function () { status.textContent = "복사에 실패했어요. 주소를 직접 선택해 주세요."; });
    } else {
      var r = document.createRange();
      r.selectNodeContents($("#share-url"));
      var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      try { document.execCommand("copy"); done(); } catch (err) { status.textContent = "주소를 길게 눌러 복사해 주세요."; }
    }
  });

  $$("[data-share]").forEach(function (b) {
    b.addEventListener("click", function () {
      $("#share-url").textContent = pageUrl;
      $("#btn-copy").textContent = "링크 복사";
      if (dialog.showModal) dialog.showModal();
      else if (navigator.share) navigator.share({ title: document.title, url: pageUrl }).catch(function () {});
      loadQr();
    });
  });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });
})();
