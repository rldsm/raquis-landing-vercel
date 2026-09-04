# Landing campaña Raquis · 40% OFF

Landing estática y embebible como Web Component. No usa React, librerías externas ni build step.

## 1. Vista directa en Vercel

El archivo `index.html` permite abrir la landing directamente como una página independiente.

La URL de agendamiento de Dentalink ya está configurada en `index.html` y también como fallback del componente.

## 2. Insertarla dentro de raquischile.cl mediante JS

Una vez desplegado el proyecto en Vercel, inserta esto en la página de campaña de Raquis:

```html
<raquis-landing
  hide-brand
  booking-url="https://93acf75076f8628c4a58b409561c93d08b7866c7.agenda.softwaredentalink.com/agenda/especialidad?modalidad=1&amp;id_especialidad=13"
  logo-src="https://raquischile.cl/assets/themes/clinica%20raquis/img/logo_header.png"
  regular-price="35000"
  promo-price="21000"
  discount="40%"
  campaign-label="TODOS LOS MARTES DE SEPTIEMBRE">
</raquis-landing>

<script src="https://TU-PROYECTO.vercel.app/raquis-landing.js" defer></script>
```

El componente usa Shadow DOM, por lo que los estilos del sitio principal no deberían romper la landing ni viceversa.

Además, por defecto el host se expande en modo **full-bleed** para escapar de contenedores del sitio con `max-width`. Si alguna vez quieres que respete el ancho del contenedor padre, agrega el atributo `contained`.

Cuando la landing se inserta debajo del header normal de Raquis, usa `hide-brand` para no repetir el logo dentro de la campaña.

## 3. Tracking

Cada CTA:

- conserva automáticamente parámetros `utm_*`, `fbclid`, `gclid` y `msclkid` al ir a la agenda;
- hace `dataLayer.push({ event: 'raquis_landing_cta', ... })` si GTM está presente;
- envía `fbq('trackCustom', 'RaquisLandingCTA', ...)` si Meta Pixel ya está cargado en raquischile.cl;
- emite el evento DOM `raquis:cta` para integraciones personalizadas.

## 4. Assets

El logo principal se carga desde la URL oficial de Raquis:
`https://raquischile.cl/assets/themes/clinica%20raquis/img/logo_header.png`

`assets/logo.png` queda como respaldo local.

- `assets/logo.png`
- `assets/hero.webp`
- `assets/primera-sesion.mp4`
- `assets/video-poster.jpg`

## 5. Recomendación de publicación

Para una campaña pagada, la opción preferida es crear una página mínima en `raquischile.cl` sin header/footer del sitio y montar allí este componente. Así la URL de los anuncios sigue siendo del dominio Raquis y la landing se mantiene desacoplada del CMS.
