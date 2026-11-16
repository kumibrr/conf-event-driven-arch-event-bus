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
  includeExplanation: true,
  transformers: [{
    name: 'syntax-token-classes',
    tokens(lines) {
      return lines.map(line => line.flatMap(token => {
        let offset = token.offset
        let cursor = 0
        const fragments = token.explanation?.map(part => {
          const end = token.content.indexOf(part.content, cursor) + part.content.length
          const content = token.content.slice(cursor, end)
          const fragment = { ...token, content, offset, explanation: [part] }
          cursor = end
          offset += content.length
          return fragment
        })
        if (!fragments?.length) return [token]
        fragments[fragments.length - 1].content += token.content.slice(cursor)
        return fragments
      }))
    },
    span(node, _line, _column, _lineElement, token) {
      const scopes = token.explanation?.flatMap(part =>
        part.scopes.map(scope => scope.scopeName)
      ) ?? []
      const categories = {
        function: ['entity.name.function', 'support.function'],
        string: ['string'],
        keyword: ['keyword', 'storage'],
        number: ['constant.numeric'],
        parameter: ['variable.parameter'],
      }

      for (const [category, prefixes] of Object.entries(categories)) {
        if (scopes.some(scope => prefixes.some(prefix => scope.startsWith(`${prefix}.`)))) {
          this.addClassToHast(node, `syntax-${category}`)
        }
      }
    },
  }],
}))
