// El correo no aparece entero en el HTML (lo leen los bots que recolectan direcciones):
// se arma aquí y abre la ventana de redactar de Gmail. Sin JavaScript, el botón lleva a #contacto,
// donde <noscript> lo muestra ofuscado.
document.querySelectorAll("[data-mail]").forEach(function (a) {
  a.href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(a.dataset.u + "@" + a.dataset.d);
  a.target = "_blank";
  a.rel = "noopener";
});

// C2 progreso de lectura, G5 cabecera que se oculta al bajar, C14 línea de tiempo que se dibuja.
(function () {
  var bar = document.createElement("div");
  bar.id = "progress";
  document.body.appendChild(bar);
  var top = document.querySelector(".top"), tl = document.querySelector(".timeline");
  var lastY = window.scrollY, ticking = false;
  function update() {
    ticking = false;
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    if (top) top.classList.toggle("nav-hidden", y > lastY && y > 120);
    lastY = y;
    if (tl) {
      var r = tl.getBoundingClientRect(); // se dibuja mientras la línea cruza el 70 % de la pantalla
      tl.style.setProperty("--tl", Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height)).toFixed(3));
    }
  }
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener("resize", update);
  update();
})();

// D4 spotlight: la luz de la tarjeta sigue al cursor.
document.querySelectorAll(".card").forEach(function (card) {
  card.addEventListener("pointermove", function (e) {
    var r = card.getBoundingClientRect();
    card.style.setProperty("--mx", e.clientX - r.left + "px");
    card.style.setProperty("--my", e.clientY - r.top + "px");
  });
});
