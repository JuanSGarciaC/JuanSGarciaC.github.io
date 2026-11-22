// El correo no aparece entero en el HTML (lo leen los bots que recolectan direcciones):
// se arma aquí. Sin JavaScript, el botón lleva a #contacto, donde <noscript> lo muestra ofuscado.
document.querySelectorAll("[data-mail]").forEach(function (a) {
  a.href = "mailto:" + a.dataset.u + "@" + a.dataset.d;
});
