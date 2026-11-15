# Del CRUD al tiempo real

Presentación en español sobre una app de reparto que continúa trabajando sin cobertura. Basada en [script.md](./script.md), con el estilo **Night terminal**: fondo oscuro, verde ácido y tipografía IBM Plex Mono incluida localmente.

La charla tiene 34 diapositivas y 3 de apoyo para preguntas. Cada diapositiva incluye notas del presentador. El contenido editable está en [slides.md](./slides.md), el tema en [style.css](./style.css) y la paginación en [global-bottom.vue](./global-bottom.vue).

## Uso

Requiere Node.js 22.12 o posterior y pnpm.

```sh
pnpm install
pnpm dev
```

En la presentación, pulsa `p` para abrir la vista del presentador con las notas. Las flechas permiten avanzar y retroceder.

## Compilación y exportación

```sh
pnpm build
pnpm export --output output/del-crud-al-tiempo-real.pdf
```

`pnpm build` genera la web estática en `dist/`. La exportación PDF usa Playwright Chromium, incluido como dependencia de desarrollo. Las notificaciones se muestran con el componente Vue del repositorio.

La estructura sigue el razonamiento del guion: problema de producto, límites del flujo síncrono, decisiones de arquitectura, backend, cola móvil, experiencia de sincronización y resultados. El apéndice separa las garantías descritas de las que el guion no especifica.
