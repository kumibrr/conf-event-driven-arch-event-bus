# Night terminal presentation implementation plan

**Goal:** Complete the existing Slidev presentation from `script.md`, in Spanish, using the approved Night terminal direction.
**Spec:** The user's one-shot request, selected style 2, `script.md`, and `output/presentation-styles.html`.
**Architecture:** Keep Slidev as the deliverable. Store narrative and presenter notes in `slides.md`, visual tokens/layouts in `style.css`, and a shared page indicator in `global-bottom.vue`. Use the existing notification component with an opt-in compact display mode. Bundle the font and notification source image locally.
**Tech stack:** Existing Slidev/Vue setup, CSS, IBM Plex Mono.

## Constraints
- Dark green-black background, acid-green accent, monospaced type.
- Preserve the source's narrative and caveats, without invented performance metrics.
- Standardize the source's inconsistent 201/202 wording to HTTP 202 Accepted.
- Treat example endpoint names/code as explanatory, not undocumented production details.
- Source precedence: script.md; queue-flow.png is an auxiliary reference and differs in its retry semantics.
- Build and export checks replace unit tests for this content/styling task.
- Work inline in the user's existing repository; no commits or publishing requested.

## Tasks
- [x] Write the full main talk and technical appendix with presenter notes.
- [x] Apply the selected theme, native editable process layouts, and notification demo.
- [x] Install dependencies, build, export, inspect slides, and fix layout or content failures.

## Review focus
Check every slide for overflow at 16:9, local assets/font loading, readable technical diagrams, acknowledgement versus final resolution, and retained limitations around clocks, conflicts, and qualitative feedback.

## Verification
- `pnpm build`: passed.
- `pnpm export --output output/del-crud-al-tiempo-real.pdf`: passed, 37 pages.
- All 37 rendered slides: font loaded, no measured overflow or uncaught page errors.
- Visually inspected all PDF pages and mobile slide fitting.
- Independent source/content review: no actionable findings.
- Export selects the bundled full Chromium because its headless-shell stalled on this macOS machine.
