# juansgarciac.github.io

CV y portafolio de Juan Sebastián García Carrillo, en español (`/`) e inglés (`/en/`).

Sitio estático en HTML, CSS y JavaScript, sin dependencias ni build obligatorio. La primera vez que entras,
un enjambre de cursores de colores **construye la página** delante de ti (efecto *Swarm Rebuild*).

## El efecto (`swarm-rebuild.js`)

1. **Escaneo (~1,8 s):** antes del primer pintado se ocultan los bloques (títulos, párrafos, listas, botones, imágenes)
   y se vacían el fondo y el borde de las tarjetas. Los cursores giran en el centro y una línea azul recorre la pantalla.
2. **Construcción:** cada cursor toma el siguiente bloque visible en orden, vuela hasta él, dibuja un marco de su color
   con la etiqueta del bloque y lo revela. Los textos se teclean sin mover el diseño.
3. **Scroll controlado:** mientras construye, la rueda, el teclado y el dedo no saltan: el scroll avanza a 900 px/s y no
   pasa del primer bloque sin construir (al 60 % de la pantalla).
4. **Reposo:** los cursores siguen al ratón; con el ratón quieto 2 s forman un anillo con las puntas hacia él.
5. **Fin:** «Construidas N capas en X s». `Esc` salta al final, `Tour` recorre la página sola, `1×/4×` cambia la
   velocidad y `✕` retira los cursores. El botón «Ver otra vez» del pie lo repite.

Solo se ve **una vez por sesión**. Con `prefers-reduced-motion` no hace nada, en pantallas de menos de 600 px usa
8 cursores en lugar de 14, solo anima `transform` y `opacity`, y sin JavaScript la página se ve completa.

## Editar el contenido

El texto de las dos páginas vive en `build.py`. Después de cambiarlo:

```bash
python build.py   # regenera index.html y en/index.html
```

## Privacidad

El correo no aparece entero en el HTML: `site.js` arma el enlace en el navegador. No se publican teléfonos.
