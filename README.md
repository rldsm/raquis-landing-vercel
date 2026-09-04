# Landing campaña Raquis · 40% OFF

Landing estática y embebible como Web Component. No usa React, librerías externas ni build step.

## Estado actual

El repositorio contiene el código de la landing optimizada y full-width (`index.html`, `raquis-landing.js` y `vercel.json`).

Por ahora los assets pesados (hero, poster y video vertical de Paz) siguen siendo servidos desde el deployment original de Vercel:

`https://raquis-landing-vercel.vercel.app/assets/`

Esto permite actualizar el código desde GitHub sin volver a subir el video de más de 5 MB al repositorio.

## Insertar en raquischile.cl

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

<script src="https://URL-DEL-NUEVO-PROYECTO.vercel.app/raquis-landing.js" defer></script>
```

El componente usa Shadow DOM y además se expande en modo full-bleed para escapar de contenedores del sitio con `max-width`. Para desactivar ese comportamiento se puede agregar el atributo `contained`.

## Tracking

Cada CTA conserva `utm_*`, `fbclid`, `gclid` y `msclkid`, hace `dataLayer.push` si GTM está disponible, dispara un evento custom de Meta Pixel si `fbq` existe y emite `raquis:cta`.

## Importante al conectar Vercel

Mientras los assets sigan alojados en `https://raquis-landing-vercel.vercel.app/assets/`, no reemplazar ese deployment original con este repositorio. Crear un segundo proyecto Vercel conectado a GitHub para servir el código actualizado. Después podemos migrar los assets al CDN de Raquis y consolidar todo en un solo proyecto.
