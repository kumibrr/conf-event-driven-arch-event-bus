<template>
  <div class="deck-pagination" aria-hidden="true">
    <span>sync<span class="cursor">_</span></span>
    <span>{{ String($slidev.nav.currentPage).padStart(2, '0') }}</span>
  </div>
</template>

<style scoped>
.deck-pagination {
  position: absolute;
  bottom: 20px;
  left: 58px;
  right: 58px;
  display: flex;
  justify-content: space-between;
  color: #b1c0b4;
  font: 13px 'IBM Plex Mono', monospace;
  pointer-events: none;
  z-index: 10;
}
.cursor { color: #c5f277; }
</style>
