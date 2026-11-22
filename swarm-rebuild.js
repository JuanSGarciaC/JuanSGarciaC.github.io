/*
 * Swarm Rebuild (D9): un enjambre de cursores de colores "construye" la página.
 * Sin dependencias. Debe cargarse como PRIMER elemento de <body> (sin defer) para ocultar
 * las capas antes del primer pintado. Sin JS o con prefers-reduced-motion la página se ve completa.
 *
 * Fases: escaneo (~1,8 s) → construcción (cada agente toma la siguiente capa visible) →
 * reposo (los cursores siguen al ratón; quieto 2 s forman un anillo) → fin.
 * Solo anima transform y opacity; los cursores tienen un tope de 1800 px/s.
 */
(function () {
  "use strict";
  var root = document.documentElement;
  var script = document.currentScript;
  if (!window.requestAnimationFrame || !window.matchMedia) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var LANG = (root.lang || "es").slice(0, 2);
  var T = {
    es: { agents: "agentes", layers: "capas", tour: "Tour", skip: "Saltar (Esc)", close: "Quitar los cursores",
          done: function (n, s) { return "Construidas " + n + " capas en " + s + " s"; },
          scanning: "Escaneando la página…" },
    en: { agents: "agents", layers: "layers", tour: "Tour", skip: "Skip (Esc)", close: "Remove the cursors",
          done: function (n, s) { return "Rebuilt " + n + " layers in " + s + " s"; },
          scanning: "Scanning the page…" }
  }[LANG === "en" ? "en" : "es"];

  var LAYER_SEL = "h1,h2,h3,h4,p,li,img,figure,.btn,.chip,.sr-layer";
  var BOX_SEL = ".card,.panel,[data-sr-box]";
  var COLORS = ["#2563eb", "#db2777", "#16a34a", "#ea580c", "#7c3aed", "#0891b2", "#ca8a04",
                "#dc2626", "#0d9488", "#9333ea", "#4f46e5", "#65a30d", "#c026d3", "#0284c7"];
  var SPEED = 2, MIN_REVEAL_MS = 220, SCROLL_SPEED = 2200, MAX_CURSOR = 1800, SCAN_MS = 1200;

  // Corre en cada carga de la página.
  hideNow();

  function hideNow() {
    root.classList.add("sr-active");
    if (!document.getElementById("sr-style")) {
      var css = document.createElement("style");
      css.id = "sr-style";
      css.textContent =
        "html.sr-active [data-sr-root] :is(" + LAYER_SEL + "):not(.sr-done){opacity:0}" +
        "html.sr-active [data-sr-root] :is(" + BOX_SEL + "):not(.sr-box-done){background:transparent!important;" +
        "border-color:transparent!important;box-shadow:none!important}" +
        "[data-sr-root] .sr-fade{transition:opacity .35s ease}" +
        "[data-sr-root] :is(" + BOX_SEL + "){transition:background-color .5s ease,border-color .5s ease,box-shadow .5s ease}";
      (document.head || root).appendChild(css);
    }
  }

  var S = null; // estado de una corrida

  function start() {
    var scope = document.querySelector("[data-sr-root]") || document.body;
    var nodes = Array.prototype.slice.call(scope.querySelectorAll(LAYER_SEL));
    // Una capa dentro de otra capa se construye con su padre.
    var layers = nodes.filter(function (el) {
      var p = el.parentElement;
      while (p && p !== scope) { if (p.matches(LAYER_SEL)) return false; p = p.parentElement; }
      return el.offsetParent !== null || el.tagName === "IMG";
    });
    var small = window.innerWidth < 600;
    var n = small ? 8 : (parseInt(script && script.getAttribute("data-agents"), 10) || 14);

    S = {
      scope: scope, layers: layers.map(function (el, i) { return { el: el, i: i, state: "todo" }; }),
      boxes: Array.prototype.slice.call(scope.querySelectorAll(BOX_SEL)),
      agents: [], ui: null, bar: null, t0: performance.now(), last: performance.now(),
      phase: "scan", desire: window.scrollY, tour: false, built: 0, finishedAt: 0,
      mouse: { x: window.innerWidth / 2, y: window.innerHeight / 2, moved: 0 }, exiting: false, raf: 0
    };
    buildUi(n);
    bindInput();
    S.raf = requestAnimationFrame(tick);
  }

  // ------------------------------------------------------------------ interfaz
  function buildUi(n) {
    var ui = document.createElement("div");
    ui.id = "sr-ui";
    ui.setAttribute("aria-hidden", "true");
    ui.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden";
    var scan = document.createElement("div");
    scan.style.cssText = "position:absolute;left:0;right:0;top:0;height:2px;background:#2563eb;" +
      "box-shadow:0 0 12px #2563eb;opacity:.85;will-change:transform";
    ui.appendChild(scan);
    S.scan = scan;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    for (var i = 0; i < n; i++) {
      var c = COLORS[i % COLORS.length];
      var a = document.createElement("div");
      a.style.cssText = "position:absolute;left:0;top:0;will-change:transform;transform-origin:0 0";
      a.innerHTML =
        '<svg width="20" height="22" viewBox="0 0 20 22" style="display:block;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))">' +
        '<path d="M1 1 L1 17 L5.5 13 L8.5 20 L11.5 18.6 L8.6 11.8 L14.5 11.8 Z" fill="' + c + '" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
      ui.appendChild(a);
      var ang = (i / n) * Math.PI * 2;
      var svg = a.firstChild;
      svg.style.transformOrigin = "1px 1px"; // la punta de la flecha
      svg.style.willChange = "transform";
      S.agents.push({ el: a, svg: svg, color: c, x: cx + Math.cos(ang) * 40, y: cy + Math.sin(ang) * 40, rot: 0,
                      job: null, phase: "idle", t: 0 });
    }
    document.body.appendChild(ui);
    S.ui = ui;

    var bar = document.createElement("div");
    bar.id = "sr-bar";
    bar.setAttribute("role", "status");
    bar.innerHTML =
      '<span class="sr-dot"></span><span data-k="agents"></span><span data-k="layers"></span>' +
      '<span class="sr-progress"><i></i></span>' +
      '<button type="button" data-k="tour">' + T.tour + '</button>' +
      '<button type="button" data-k="skip" title="' + T.skip + '">⏭</button>' +
      '<button type="button" data-k="close" aria-label="' + T.close + '" title="' + T.close + '">✕</button>';
    document.body.appendChild(bar);
    S.bar = bar;
    bar.querySelector('[data-k="tour"]').onclick = function () { S.tour = !S.tour; this.classList.toggle("on", S.tour); };
    bar.querySelector('[data-k="skip"]').onclick = skipAll;
    bar.querySelector('[data-k="close"]').onclick = exit;
    updateBar();
  }

  function updateBar() {
    if (!S || !S.bar) return;
    var total = S.layers.length;
    S.bar.querySelector('[data-k="agents"]').textContent = S.agents.length + " " + T.agents;
    var lab = S.bar.querySelector('[data-k="layers"]');
    if (S.phase === "scan") lab.textContent = T.scanning;
    else if (S.phase === "done") lab.textContent = T.done(total, ((S.finishedAt - S.t0) / 1000).toFixed(1));
    else lab.textContent = S.built + " / " + total + " " + T.layers;
    S.bar.querySelector(".sr-progress i").style.transform = "scaleX(" + (total ? S.built / total : 1) + ")";
  }

  // ------------------------------------------------------------------ entrada
  function building() { return S && (S.phase === "scan" || S.phase === "build"); }

  function bindInput() {
    // Fuera de la construcción, el scroll es del usuario: cualquier gesto suyo apaga el Tour.
    function userTakesOver() { if (S.tour) { S.tour = false; var b = S.bar && S.bar.querySelector('[data-k="tour"]'); if (b) b.classList.remove("on"); } }
    // El scroll es siempre del usuario y nunca se bloquea: los cursores construyen lo que va apareciendo.
    function userScrolls() { userTakesOver(); }
    S.onWheel = function () { userScrolls(); };
    S.onTouchStart = function () { if (!building()) userTakesOver(); };
    S.onTouchMove = function () { userScrolls(); };
    var SCROLL_KEYS = { ArrowDown: 1, ArrowUp: 1, PageDown: 1, PageUp: 1, " ": 1, End: 1, Home: 1 };
    S.onKey = function (e) {
      if (e.key === "Escape") { if (building()) skipAll(); return; }
      if (SCROLL_KEYS[e.key]) userScrolls();
    };
    S.onMouse = function (e) { S.mouse.x = e.clientX; S.mouse.y = e.clientY; S.mouse.moved = performance.now(); };
    // Un enlace interno salta como siempre; lo que queda atrás se completa y el destino se construye allí.
    S.onClick = function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (a) userTakesOver();
    };
    window.addEventListener("wheel", S.onWheel, { passive: true });
    window.addEventListener("touchstart", S.onTouchStart, { passive: true });
    window.addEventListener("touchmove", S.onTouchMove, { passive: true });
    window.addEventListener("keydown", S.onKey);
    window.addEventListener("mousemove", S.onMouse, { passive: true });
    document.addEventListener("click", S.onClick, true);
  }

  function unbindInput() {
    window.removeEventListener("wheel", S.onWheel);
    window.removeEventListener("touchstart", S.onTouchStart);
    window.removeEventListener("touchmove", S.onTouchMove);
    window.removeEventListener("keydown", S.onKey);
    window.removeEventListener("mousemove", S.onMouse);
    document.removeEventListener("click", S.onClick, true);
  }

  // ------------------------------------------------------------------ capas
  function boxOf(el) {
    var p = el.parentElement;
    while (p && p !== S.scope) { if (p.matches(BOX_SEL)) return p; p = p.parentElement; }
    return null;
  }

  function isPlainText(el) {
    if (el.tagName === "IMG" || !el.childNodes.length) return false;
    for (var i = 0; i < el.childNodes.length; i++) if (el.childNodes[i].nodeType !== 3) return false;
    return el.textContent.trim().length > 0 && el.textContent.length < 600;
  }

  function beginReveal(L, agent) {
    var el = L.el;
    var box = boxOf(el);
    if (box) box.classList.add("sr-box-done");
    // Marco del color del agente, con la etiqueta del tipo de capa.
    var r = el.getBoundingClientRect();
    var f = document.createElement("div");
    f.style.cssText = "position:absolute;left:0;top:0;width:" + Math.max(r.width, 8) + "px;height:" + Math.max(r.height, 8) +
      "px;border:1.5px solid " + agent.color + ";border-radius:4px;opacity:0;transition:opacity .18s;will-change:transform";
    f.innerHTML = '<span style="position:absolute;left:-1.5px;top:-17px;font:600 10px/1 ui-monospace,monospace;color:#fff;background:' +
      agent.color + ';padding:3px 5px;border-radius:4px 4px 0 0">' + label(el) + "</span>";
    S.ui.insertBefore(f, S.ui.firstChild);
    L.frame = f;
    L.start = performance.now();
    if (isPlainText(el)) {
      L.text = el.textContent;
      el.textContent = "";
      L.typed = document.createElement("span");
      L.rest = document.createElement("span");
      L.rest.style.visibility = "hidden";
      L.rest.textContent = L.text;
      el.appendChild(L.typed); el.appendChild(L.rest);
      el.classList.add("sr-done");
      L.mode = "type";
      L.dur = Math.min(900, Math.max(260, L.text.length * 11));
    } else {
      var kids = [el].concat(Array.prototype.slice.call(el.querySelectorAll(LAYER_SEL)));
      kids.forEach(function (k) { k.classList.add("sr-fade"); });
      L.mode = "fade";
      L.dur = el.tagName === "IMG" || el.tagName === "FIGURE" ? 450 : 320;
      requestAnimationFrame(function () { kids.forEach(function (k) { k.classList.add("sr-done"); }); });
    }
    requestAnimationFrame(function () { f.style.opacity = "1"; });
  }

  function label(el) {
    if (el.matches(".btn") || (el.tagName === "LI" && el.children.length === 1 && el.firstElementChild.matches(".btn"))) return "button";
    if (el.matches(".chip")) return "tag";
    if (el.tagName === "IMG" || el.tagName === "FIGURE") return "frame";
    return el.tagName.toLowerCase();
  }

  function finishLayer(L) {
    if (L.state === "done") return;
    var el = L.el;
    if (L.mode === "type") el.textContent = L.text; // deja el DOM como estaba
    el.classList.add("sr-done");
    el.classList.remove("sr-fade");
    var box = boxOf(el);
    if (box) box.classList.add("sr-box-done");
    var desc = el.querySelectorAll(LAYER_SEL);
    for (var i = 0; i < desc.length; i++) desc[i].classList.add("sr-done");
    if (L.frame) {
      var f = L.frame; f.style.opacity = "0";
      setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 260);
    }
    L.state = "done";
    S.built++;
  }

  function nextLayer() {
    var vh = window.innerHeight;
    // Al final de la página ya no se puede bajar más: todo lo que queda cuenta como visible.
    var atEnd = window.scrollY >= document.documentElement.scrollHeight - vh - 2;
    for (var i = 0; i < S.layers.length; i++) {
      var L = S.layers[i];
      if (L.state !== "todo") continue;
      var r = L.el.getBoundingClientRect();
      if (r.bottom <= 0) { finishLayer(L); continue; } // quedó atrás sin construir: aparece ya, para que no falte al volver
      if (r.top < vh - 10 || atEnd) return L; // la siguiente capa visible, en orden del DOM
      return null; // las de más abajo esperan a que el scroll las muestre
    }
    return null;
  }

  function firstUnbuilt() {
    for (var i = 0; i < S.layers.length; i++) if (S.layers[i].state !== "done") return S.layers[i];
    return null;
  }

  // ------------------------------------------------------------------ bucle
  function moveTo(a, tx, ty, dt, k) {
    var dx = tx - a.x, dy = ty - a.y, d = Math.hypot(dx, dy);
    if (d < 0.5) { a.x = tx; a.y = ty; return true; }
    var step = Math.min(d, Math.max(d * (k || 9) * dt, 120 * dt), MAX_CURSOR * dt);
    a.x += dx / d * step; a.y += dy / d * step;
    return d - step < 2;
  }

  function tick(now) {
    if (!S) return;
    var dt = Math.min(0.05, (now - S.last) / 1000);
    S.last = now;
    var vw = window.innerWidth, vh = window.innerHeight, n = S.agents.length, sp = SPEED;

    if (S.phase === "scan") {
      var p = (now - S.t0) / SCAN_MS;
      S.scan.style.transform = "translateY(" + (p * vh) + "px)";
      S.agents.forEach(function (a, i) {
        var ang = now / 420 + (i / n) * Math.PI * 2;
        moveTo(a, vw / 2 + Math.cos(ang) * 46, vh / 2 + Math.sin(ang) * 46, dt, 14);
      });
      if (p >= 1) { S.phase = "build"; S.scan.style.opacity = "0"; updateBar(); }
    } else if (S.phase === "build") {
      S.agents.forEach(function (a) {
        if (!a.job) {
          var L = nextLayer();
          if (L) { L.state = "fly"; a.job = L; a.phase = "fly"; }
        }
        if (a.job) {
          var L2 = a.job, r = L2.el.getBoundingClientRect();
          if (a.phase === "fly" && r.bottom <= 0) { finishLayer(L2); a.job = null; a.phase = "idle"; updateBar(); return; }
          if (a.phase === "fly") {
            if (moveTo(a, r.left, r.top, dt * sp, 7)) { a.phase = "work"; L2.state = "work"; beginReveal(L2, a); }
          } else {
            if (L2.frame) L2.frame.style.transform = "translate(" + r.left + "px," + r.top + "px)";
            var q = Math.min(1, (now - L2.start) / Math.max(MIN_REVEAL_MS, L2.dur / sp)); // rápido pero siempre visible
            if (L2.mode === "type") {
              var cut = Math.round(L2.text.length * q);
              L2.typed.textContent = L2.text.slice(0, cut);
              L2.rest.textContent = L2.text.slice(cut);
              // el cursor acompaña al texto que se escribe
              moveTo(a, r.left + Math.min(r.width, r.width * q), r.top + r.height * 0.5, dt * sp, 12);
            } else {
              moveTo(a, r.left + r.width * q, r.top + r.height * q, dt * sp, 10);
            }
            if (q >= 1) { finishLayer(L2); a.job = null; a.phase = "idle"; updateBar(); }
          }
        } else {
          idleMove(a, S.agents.indexOf(a), now, dt);
        }
      });
      if (S.tour) controlledScroll(dt);
      nextLayer(); // completa lo que el scroll dejó atrás aunque todos los cursores estén ocupados
      if (S.built >= S.layers.length) finishRun(now);
    } else if (S.phase === "done") {
      S.agents.forEach(function (a, i) { idleMove(a, i, now, dt); });
      if (S.tour) controlledScroll(dt);
    } else if (S.phase === "exit") {
      var gone = 0;
      S.agents.forEach(function (a) { if (moveTo(a, a.ex, a.ey, dt, 6)) gone++; });
      if (gone === n) { teardown(); return; }
    }

    S.agents.forEach(function (a) {
      // Solo gira la flecha; el nombre queda siempre derecho.
      a.el.style.transform = "translate(" + a.x.toFixed(1) + "px," + a.y.toFixed(1) + "px)";
      a.svg.style.transform = "rotate(" + a.rot.toFixed(3) + "rad)";
    });
    S.raf = requestAnimationFrame(tick);
  }

  function idleMove(a, i, now, dt) {
    var m = S.mouse, n = S.agents.length;
    if (now - m.moved > 2000) {
      // Ratón quieto 2 s: anillo alrededor con las puntas hacia él.
      var R = n * 4.4, ang = (i / n) * Math.PI * 2 + now / 9000;
      moveTo(a, m.x + Math.cos(ang) * R, m.y + Math.sin(ang) * R, dt, 5);
      // la flecha apunta arriba-izquierda (-135°); se gira para que la punta mire al ratón
      turnTo(a, ang + Math.PI + Math.PI * 0.75, dt);
    } else {
      var lead = i === 0 ? { x: m.x + 16, y: m.y + 18 } : S.agents[i - 1];
      moveTo(a, lead.x + 6, lead.y + 8, dt, 10);
      turnTo(a, 0, dt);
    }
  }

  function turnTo(a, target, dt) {
    var d = Math.atan2(Math.sin(target - a.rot), Math.cos(target - a.rot)); // camino más corto
    a.rot = Math.atan2(Math.sin(a.rot + d * Math.min(1, dt * 8)), Math.cos(a.rot + d * Math.min(1, dt * 8)));
  }

  function controlledScroll(dt) {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var limit = max;
    if (S.phase === "build") {
      var L = firstUnbuilt();
      if (L) limit = Math.min(max, window.scrollY + L.el.getBoundingClientRect().top - window.innerHeight * 0.6);
    }
    if (S.tour) S.desire = max;
    S.desire = Math.max(0, Math.min(S.desire, max));
    var target = Math.min(S.desire, Math.max(limit, window.scrollY));
    var y = window.scrollY, diff = target - y;
    if (Math.abs(diff) < 1) {
      // El Tour termina al llegar al final de una página ya construida.
      if (S.tour && S.phase === "done" && y >= max - 1) { S.tour = false; var b = S.bar && S.bar.querySelector('[data-k="tour"]'); if (b) b.classList.remove("on"); }
      return;
    }
    var step = Math.sign(diff) * Math.min(Math.abs(diff), SCROLL_SPEED * dt);
    window.scrollTo(0, y + step);
    if (!S.tour && S.phase === "build" && diff > 0 && limit <= y + 1) S.desire = y; // no acumular deseo contra el tope
  }

  function finishRun(now) {
    S.phase = "done";
    S.finishedAt = now || performance.now();
    root.classList.remove("sr-active");
    S.boxes.forEach(function (b) { b.classList.add("sr-box-done"); });
    updateBar();
  }

  function skipAll() {
    if (!S || S.phase === "done" || S.phase === "exit") return;
    S.layers.forEach(function (L) {
      if (L.state === "work" || L.state === "fly" || L.state === "todo") {
        if (L.state !== "work") L.mode = null;
        finishLayer(L);
      }
    });
    S.agents.forEach(function (a) { a.job = null; a.phase = "idle"; });
    if (S.scan) S.scan.style.opacity = "0";
    finishRun();
  }

  function exit() {
    if (!S) return;
    skipAll();
    var vw = window.innerWidth, vh = window.innerHeight;
    S.agents.forEach(function (a) {
      var d = [a.x, vw - a.x, a.y, vh - a.y], m = Math.min.apply(null, d);
      a.ex = m === d[0] ? -60 : m === d[1] ? vw + 60 : a.x;
      a.ey = m === d[2] ? -60 : m === d[3] ? vh + 60 : a.y;
    });
    S.phase = "exit";
    if (S.bar) S.bar.classList.add("sr-out");
  }

  function teardown() {
    cancelAnimationFrame(S.raf);
    unbindInput();
    if (S.ui && S.ui.parentNode) S.ui.parentNode.removeChild(S.ui);
    if (S.bar && S.bar.parentNode) S.bar.parentNode.removeChild(S.bar);
    S = null;
  }

  // ------------------------------------------------------------------ repetir
  function replay() {
    if (S) { cancelAnimationFrame(S.raf); unbindInput();
      if (S.ui && S.ui.parentNode) S.ui.parentNode.removeChild(S.ui);
      if (S.bar && S.bar.parentNode) S.bar.parentNode.removeChild(S.bar); S = null; }
    var scope = document.querySelector("[data-sr-root]") || document.body;
    Array.prototype.forEach.call(scope.querySelectorAll(".sr-done,.sr-box-done"), function (el) {
      el.classList.remove("sr-done", "sr-box-done", "sr-fade");
    });
    window.scrollTo(0, 0);
    hideNow();
    start();
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-sr-replay]");
    if (b) { e.preventDefault(); replay(); }
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  // Para pruebas: estado público mínimo.
  window.SwarmRebuild = { replay: replay, skip: function () { skipAll(); },
    state: function () { return S ? { phase: S.phase, built: S.built, total: S.layers.length } : null; } };
})();
