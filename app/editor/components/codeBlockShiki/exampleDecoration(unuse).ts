// CodeBlockHighlightPlugin.ts
// import { Plugin } from 'prosemirror-state'
// import { Decoration, DecorationSet } from 'prosemirror-view'
// import hljs from 'highlight.js/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// import typescript from 'highlight.js/lib/languages/typescript'

// hljs.registerLanguage('javascript', javascript)
// hljs.registerLanguage('typescript', typescript)

// function htmlToTokens(html: string) {
//   const doc = new DOMParser().parseFromString(html, 'text/html')
//   const result: { content: string; className: string }[] = []
//   function walk(node: ChildNode) {
//     if (node.nodeType === Node.TEXT_NODE && node.textContent) {
//       result.push({ content: node.textContent, className: '' })
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       const el = node as HTMLElement
//       const cls = el.className
//       el.childNodes.forEach((c) => {
//         if (c.nodeType === Node.TEXT_NODE && c.textContent) {
//           result.push({ content: c.textContent, className: cls })
//         } else {
//           walk(c)
//         }
//       })
//     }
//   }
//   doc.body.childNodes.forEach(walk)
//   return result
// }

// export function CodeBlockHighlightPlugin() {
//   return new Plugin({
//     props: {
//       decorations: (state) => {
//         const decos: Decoration[] = []

//         state.doc.descendants((node, pos) => {
//           if (node.type.name === 'codeBlock') {
//             const lang = node.attrs.language || 'javascript'
//             const text = node.textContent

//             // highlight.js highlight ra html
//             const { value: html } = hljs.highlight(text, {
//               language: lang,
//               ignoreIllegals: true,
//             })
//             const tokens = htmlToTokens(html)
//             console.log("tokens: ", tokens);
//             // map từng token sang Decoration.inline
//             let offset = 0
//             for (const token of tokens) {
//               const from = pos + 1 + offset
//               const to = from + token.content.length
//               if (token.content.length > 0) {
//                 decos.push(
//                   Decoration.inline(from, to, {
//                     class: token.className, // ví dụ "hljs-keyword"
//                   }),
//                 )
//               }
//               offset += token.content.length
//             }
//           }
//         })
//         console.log("ok")
//         return DecorationSet.create(state.doc, decos)
//       },
//     },
//   })
// }


// ví dụ dùng decorate
// import { Plugin } from 'prosemirror-state'
// import { Decoration, DecorationSet } from 'prosemirror-view'

// // Plugin highlight chữ "TODO" trong codeBlock
// export function TodoHighlightPlugin() {
//   return new Plugin({
//     props: {
//       decorations(state) {
//         const decos: Decoration[] = []

//         state.doc.descendants((node, pos) => {
//           // chỉ highlight trong node codeBlock
//           if (node.type.name === 'codeBlock') {
//             const text = node.textContent
//             const regex = /TODO/g
//             let match

//             while ((match = regex.exec(text)) !== null) {
//               const start = pos + 1 + match.index // +1 bỏ qua start token
//               const end = start + match[0].length
//               decos.push(
//                 Decoration.inline(start, end, {
//                   style: 'background-color: yellow; color: black;',
//                 }),
//               )
//             }
//           }
//         })

//         return DecorationSet.create(state.doc, decos)
//       },
//     },
//   })
// }
