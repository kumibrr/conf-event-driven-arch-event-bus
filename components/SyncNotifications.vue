<!--
Lucide icons: https://lucide.dev

ISC License

Copyright (c) 2026 Lucide Icons and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

The following Lucide icons are derived from the Feather project:

airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out

The MIT License (MIT) (for the icons listed above)

Copyright (c) 2013-present Cole Bemis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
-->

<template>
  <main class="demo">
    <div class="notification notification--offline" role="status">
      <span class="notification__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h.01" />
          <path d="M8.5 16.429a5 5 0 0 1 7 0" />
          <path d="M5 12.859a10 10 0 0 1 5.17-2.69" />
          <path d="M19 12.859a10 10 0 0 0-2.007-1.523" />
          <path d="M2 8.82a15 15 0 0 1 4.177-2.643" />
          <path d="M22 8.82a15 15 0 0 0-11.288-3.764" />
          <path d="m2 2 20 20" />
        </svg>
      </span>
      <div class="notification__text">
        <p class="notification__title">No hay conexión</p>
        <p class="notification__message">5 cambios por subir</p>
      </div>
      <span class="notification__right-icon" aria-hidden="true"></span>
    </div>

    <div class="notification notification--syncing" role="status">
      <span class="notification__icon" aria-hidden="true">
        <span class="spinner">
          <span style="--i: 0"></span><span style="--i: 1"></span>
          <span style="--i: 2"></span><span style="--i: 3"></span>
          <span style="--i: 4"></span><span style="--i: 5"></span>
          <span style="--i: 6"></span><span style="--i: 7"></span>
          <span style="--i: 8"></span><span style="--i: 9"></span>
          <span style="--i: 10"></span><span style="--i: 11"></span>
        </span>
      </span>
      <div class="notification__text">
        <p class="notification__title">Sincronizando</p>
        <p class="notification__message">2 de 5 cambios subidos</p>
      </div>
      <span class="notification__right-icon" aria-hidden="true"></span>
    </div>

    <div class="notification notification--error" role="status">
      <span class="notification__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      </span>
      <div class="notification__text">
        <p class="notification__title">2 cambios han salido mal</p>
        <p class="notification__message">Toca para solucionarlo</p>
      </div>
      <span class="notification__right-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </div>

    <div class="notification notification--success" role="status">
      <span class="notification__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m16 9-5.5 5.5L8 12" />
        </svg>
      </span>
      <div class="notification__text">
        <p class="notification__title">Sincronizado</p>
        <p class="notification__message">Toda la información está subida</p>
      </div>
      <span class="notification__right-icon" aria-hidden="true"></span>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

/* Demo backdrop; the notification can be used on any background. */
.demo {
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 100svh;
  align-content: center;
  justify-items: center;
  gap: 20px;
  padding: 24px;
  background: #e9ad45;
}

.notification {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 28px;
  align-items: center;
  gap: 12px;
  width: min(440px, 100%);
  max-width: 100%;
  min-height: 86px;
  padding: 14px 24px;
  border-radius: 999px;
  background: #f7f7f7;
  box-shadow: 0 4px 14px rgb(101 65 13 / 8%);
}

.notification__icon,
.notification__right-icon {
  display: grid;
  height: 40px;
  place-items: center;
}

.notification__icon > :is(img, svg),
.notification__right-icon > :is(img, svg) {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.notification--offline .notification__icon {
  color: #e5423a;
}

.notification--error .notification__icon {
  color: #ed921d;
}

.notification--success .notification__icon {
  color: #29a85b;
}

.notification__right-icon {
  color: #202020;
}

.notification__text {
  min-width: 0;
  text-align: center;
}

.notification__title,
.notification__message {
  margin: 0;
  overflow: hidden;
  font-size: 22px;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification__title {
  color: #202020;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.notification__message {
  color: #858583;
  font-weight: 500;
  white-space: normal;
}

/* Twelve fading spokes recreate the iOS activity indicator. */
.spinner {
  position: relative;
  width: 32px;
  height: 32px;
  color: #858583;
}

.spinner > span {
  position: absolute;
  top: 0;
  left: calc(50% - 1.5px);
  width: 3px;
  height: 9px;
  border-radius: 2px;
  background: currentColor;
  transform: rotate(calc(var(--i) * 30deg));
  transform-origin: 1.5px 16px;
  animation: spinner-fade 1s linear infinite;
  animation-delay: calc(var(--i) * 1s / 12 - 1s);
}

@keyframes spinner-fade {
  from { opacity: 1; }
  to { opacity: 0.15; }
}

@media (prefers-reduced-motion: reduce) {
  .spinner > span {
    animation: none;
    opacity: calc(1 - var(--i) * 0.07);
  }
}

@media (max-width: 420px) {
  .demo {
    padding: 16px;
  }

  .notification {
    grid-template-columns: 32px minmax(0, 1fr) 24px;
    gap: 8px;
    min-height: 78px;
    padding: 12px 16px;
  }

  .notification__title,
  .notification__message {
    font-size: clamp(14px, 4.3vw, 18px);
  }
}
</style>
