# juansgarciac.github.io

CV y portafolio de Juan Sebastián García Carrillo, en español (`/`) e inglés (`/en/`).

Sitio estático en HTML, CSS y JavaScript, sin dependencias ni build obligatorio. Cada vez que cargas la página,
un enjambre de cursores de colores **construye la página** delante de ti (efecto *Swarm Rebuild*).

## El efecto (`swarm-rebuild.js`)

1. **Escaneo (~1,2 s):** antes del primer pintado se ocultan los bloques (títulos, párrafos, listas, botones, imágenes)
   y se vacían el fondo y el borde de las tarjetas. Los cursores giran en el centro y una línea azul recorre la pantalla.
2. **Construcción al ritmo del scroll:** cada cursor toma el siguiente bloque *visible*, vuela hasta él, dibuja un marco
   de su color y lo revela; los textos se teclean sin mover el diseño. Velocidad fija (2×, mínimo 220 ms por bloque); los cursores no llevan nombre.
3. **Scroll libre:** el scroll nunca se bloquea ni se frena. Lo que entra en pantalla se construye; lo que dejas atrás
   sin construir aparece al instante (no falta nada al volver); lo de abajo espera a que llegues. Al final de la
   página se construye todo lo que queda.
4. **Reposo:** los cursores siguen al ratón; con el ratón quieto 2 s forman un anillo con las puntas hacia él.
5. **Fin:** «Construidas N capas en X s». `Esc` salta al final, `Tour` recorre la página sola (2200 px/s) y `✕` retira los cursores. El botón «Ver otra vez» del pie lo repite.

Se repite **en cada carga**. Con `prefers-reduced-motion` no hace nada, en pantallas de menos de 600 px usa
8 cursores en lugar de 14, solo anima `transform` y `opacity`, y sin JavaScript la página se ve completa.

## Distribución

Dos columnas en escritorio: a la izquierda, fija, la foto, el nombre, un índice que marca la sección activa y los
botones de contacto; a la derecha, lo que hace scroll (Sobre mí, Experiencia, Proyectos, Formación, Habilidades,
Contacto). En pantallas bajas la columna fija se compacta. Por debajo de 960 px es una sola columna sin índice.

## Efectos de acompañamiento (`styles.css` + `site.js`)

Tema oscuro, aurora de fondo (E8), luz que sigue al cursor en las tarjetas (D4), línea de tiempo que se dibuja al
bajar por Experiencia (C14) y barra de progreso de lectura (C2).
Todos se apagan con `prefers-reduced-motion`.

## Editar el contenido

El texto de las dos páginas vive en `build.py`. Después de cambiarlo:

```bash
python build.py   # regenera index.html y en/index.html
```

## Foto

Guarda tu foto como `img/foto.jpg` (o `.webp`/`.png`, cuadrada) y ejecuta `python build.py`: aparece en el hero.

## Privacidad

El correo no aparece entero en el HTML: `site.js` arma el enlace en el navegador y abre la ventana de redactar de Gmail. No se publican teléfonos.
