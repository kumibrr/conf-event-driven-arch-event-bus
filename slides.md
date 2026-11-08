---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev
# some information about your slides (markdown enabled)
title: Welcome to Slidev
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# apply UnoCSS classes to the current slide
class: text-start 
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
# transition: slide-left
# enable Comark Syntax: https://comark.dev/syntax/markdown
comark: true
# duration of the presentation
duration: 35min
---

# Del CRUD al real-time con Event-Driven architecture
Caso práctico en un proyecto con cinco años de historia

---
background: #fff
---
# Teníamos varios problemas
- Los repartidores solo podían completar una entrega offline.
- Cuando hay downtime, no hay entregas.
- Estados inconsistentes
- Repartos poco fluídos
- Poca auditabilidad

---

# Qué opciones hay?

