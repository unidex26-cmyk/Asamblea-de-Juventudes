# II Asamblea de Juventudes · sitio web

Sitio de una sola página, sin build ni dependencias: HTML + CSS + JS vanilla.
Todas las rutas son relativas → funciona en cualquier repositorio de GitHub Pages
sin configurar base, y también con doble clic en `index.html`.

## Estructura
| Ruta | Contenido |
|---|---|
| `index.html` | Todo el contenido y las secciones |
| `css/estilos.css` | Sistema visual completo (paleta, componentes, motion, print) |
| `js/config.js` | **Único archivo que editas para enlaces** (Forms, WhatsApp, Instagram) |
| `js/main.js` | Interacciones: carrusel, cuenta regresiva, menú, reveals, compartir |
| `assets/img/` | Logo, 3 ilustraciones del carrusel y marcas de organizaciones (SVG) |
| `assets/icons/` | Favicon |
| `assets/calendar/evento.ics` | Evento para Apple Calendar / Outlook (28 nov, 9:00–13:00 Perú) |

## Publicar gratis en GitHub Pages
1. `github.com/new` → repositorio **público** (ej. `asamblea-juventudes`) → Create.
2. Sube **todas las carpetas y archivos** respetando la estructura (Add file → Upload files).
3. Settings → Pages → Source: **Deploy from a branch** → `main` / `(root)` → Save.
4. En ~1 min: `https://TU-USUARIO.github.io/asamblea-juventudes/`. Cada cambio se publica solo.

## Activar el formulario de inscripción
Edita `js/config.js` y pega tu enlace de Google Forms en `formularioUrl`.
El botón «Ir al formulario oficial» se activa automáticamente en Inscripciones.

## WhatsApp / Instagram
En `js/config.js`: `whatsappGrupo` y `instagram`. Los botones de WhatsApp abren el
grupo configurado; los botones flotantes pueden abrir el grupo o el perfil. Sin
configurar, WhatsApp comparte la página.

## Reemplazar imágenes por las reales
- Logo oficial: sustituye `assets/img/logo.svg` (y `assets/icons/favicon.svg`).
- Fotos del evento: cambia los `src` de `assets/img/hero-*.svg` en `index.html`
  por tus `.jpg`/`.webp` (mismos nombres de clase; el carrusel funciona igual).
- Marcas de coorganizadores: sustituye `assets/img/org-*.svg`.

## Editar contenido
Textos, programa, concurso, FAQ y comité viven directamente en `index.html`.
La fecha/hora de la cuenta regresiva está en los atributos `data-inicio` / `data-fin`
(formato ISO con zona `-05:00`) y en `assets/calendar/evento.ics`.