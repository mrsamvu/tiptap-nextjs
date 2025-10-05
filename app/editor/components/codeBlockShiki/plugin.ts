// CodeBlockHighlightPlugin.ts
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { createHighlighter } from 'shiki'
import { SHIKI_LANGUAGES, SHIKI_THEMES } from './config'

export const highlighterPromise = createHighlighter({
  themes: SHIKI_THEMES,
  langs: SHIKI_LANGUAGES,
});

export async function createCodeBlockHighlightPlugin() {
  const highlighter = await highlighterPromise;
  
  return new Plugin({
    props: {
      decorations(state) {
        const decos: Decoration[] = []

        state.doc.descendants((node, pos) => {
          if (node.type.name === 'codeBlock') {
            let language = node.attrs.language;
            let theme = node.attrs.theme;

            if (!SHIKI_LANGUAGES.includes(language)) {
              language = 'javascript';
            }

            if (!highlighter.getLoadedThemes().includes(theme)) return;

            // Lấy tokens
            const lines = highlighter.codeToTokens(node.textContent, {
              lang: SHIKI_LANGUAGES.includes(language) ? language : 'javascript',
              theme: theme || 'vitesse-dark',
            })

            decos.push(
              Decoration.node(pos, pos + node.nodeSize, {
                style: `background-color:${lines.bg}`,
              }),
            )

            for (const line of lines.tokens) {
              for (const token of line) {
                // token.offset tính từ đầu code block
                const from = pos + 1 + token.offset
                const to = from + token.content.length
                if (token.content.length > 0) {
                  decos.push(
                    Decoration.inline(from, to, {
                      style: `color: ${token.color ?? 'inherit'}`,
                    }),
                  )
                }
              }
            }
          }
        })

        return DecorationSet.create(state.doc, decos)
      },
    },
  })
}