import { defineShikiSetup } from '@slidev/types'

const nightTerminal = {
  name: 'night-terminal',
  type: 'dark' as const,
  colors: {
    'editor.background': '#18251e',
    'editor.foreground': '#eaf2e9',
  },
  tokenColors: [
    { scope: ['comment'], settings: { foreground: '#b1c0b4' } },
    { scope: ['string'], settings: { foreground: '#c5f277' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#f5b478' } },
    { scope: ['keyword', 'storage'], settings: { foreground: '#c5f277' } },
    { scope: ['entity.name.function', 'entity.name.type'], settings: { foreground: '#eaf2e9' } },
    { scope: ['punctuation'], settings: { foreground: '#b1c0b4' } },
  ],
}

export default defineShikiSetup(() => ({
  themes: { dark: nightTerminal, light: nightTerminal },
}))
