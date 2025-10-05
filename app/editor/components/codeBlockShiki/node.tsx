// CodeBlockNode.ts
import CodeBlock from '@tiptap/extension-code-block'
import { CommandProps, mergeAttributes, NodeConfig, NodePos } from '@tiptap/core'
import { ReactNodeViewRenderer, Node } from '@tiptap/react'
import { CodeBlockShikiComponent } from './component'
import { TextSelection } from '@tiptap/pm/state';
import { SHIKI_LANGUAGES } from './config';
import { Node as ProseMirrorNode } from 'prosemirror-model';
// import { toggleNode } from '@tiptap/core';

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    CodeBlockShikiNode: {
      /**
       * create a card node
       */
      toggleCodeBlockShiki: () => ReturnType;
    };
  }
}

export const CodeBlockShikiNode = CodeBlock.extend({
  group: 'block',

  addAttributes() {
    return {
      // @ts-ignore
      ...this.parent?.(),
      language: {
        default: 'javascript',
        
        parseHTML: (element: { getAttribute: (arg0: string) => any; }) => element.getAttribute('data-language') || 'javascript',
        renderHTML: (attributes: { language: any; }) => {
          return {
            'data-language': attributes.language || 'javascript',
          }
        },
      },
      theme: {
        default: 'vitesse-dark',
        parseHTML: (element: { getAttribute: (arg0: string) => any; }) => element.getAttribute('data-theme') || 'vitesse-dark',
        renderHTML: (attributes: { theme: any; }) => {
          return {
            'data-theme': attributes.theme || 'vitesse-dark',
          }
        },
      }
    }
  },

  renderHTML({ node, HTMLAttributes }: { node: ProseMirrorNode, HTMLAttributes: Record<string, any> }) {
    // Bạn có thể tuỳ chỉnh renderHTML
    return [
      'pre',
      mergeAttributes(HTMLAttributes),
      [
        'code',
        {
          'data-language': SHIKI_LANGUAGES.includes(node.attrs.language) ? node.attrs.language : 'javascript',
          'data-theme': node.attrs.theme || 'vitesse-dark'
        },
        0,
      ],
    ]
  },

  addKeyboardShortcuts() {
    return {
      // @ts-ignore
      ...this.parent?.(),
      'Mod-Alt-c': () => {
        if (!this.editor.can().toggleCodeBlockShiki()) return false;
        this.editor.commands.toggleNode(this.name, 'paragraph')
      },

      'Mod-a': () => {
        const { state, dispatch } = this.editor.view;
        const { $from } = state.selection;
        const node = $from.node($from.depth);

        // nếu đang ở trong tableCell
        if (node.type.name === this.name) {
          const pos = $from.before($from.depth);
          const start = pos + 1; // skip open token
          const end = pos + node.nodeSize - 1; // skip closing token
          const tr = state.tr.setSelection(
            TextSelection.create(state.doc, start, end)
          );
          dispatch(tr);
          return true;
        }
        // nếu không phải codeblock → cho default
        return false
      },

      Tab: () => {
        if (!this.editor.isActive('codeBlock')) return false

        const { from, to } = this.editor.state.selection
        const text = this.editor.state.doc.textBetween(from, to, '\n', '\n')

        // Nếu chỉ có caret → chèn 2 space bình thường
        if (from === to) {
          this.editor.chain().insertContent('  ').run()
          return true
        }

        // thêm indent từng dòng
        const lines = text.split('\n')
        const formatted = lines.map(line => '  ' + line).join('\n')

        // Chèn nội dung mới
        this.editor
          .chain()
          .focus()
          .insertContentAt({ from, to }, formatted)
          // giữ selection (thêm 2 space mỗi dòng → tăng độ dài selection)
          .setTextSelection({
            from,
            to: to + lines.length * 2, // mỗi dòng thêm 2 space
          })
          .run()

        return true
      },

      // SHIFT+TAB: bỏ 2 space đầu mỗi dòng selection và giữ selection
      'Shift-Tab': () => {
        if (!this.editor.isActive('codeBlock')) return false

        const { from, to } = this.editor.state.selection
        const text = this.editor.state.doc.textBetween(from, to, '\n', '\n')

        // bỏ indent từng dòng
        const lines = text.split('\n')
        const formatted = lines.map(line => line.startsWith('  ') ? line.slice(2) : line).join('\n')
        const removedSpaces = lines.reduce((sum, line) => sum + (line.startsWith('  ') ? 2 : 0), 0)
        const avgRemoved = removedSpaces / lines.length

        this.editor
          .chain()
          .focus()
          .insertContentAt({ from, to }, formatted)
          // giảm độ dài selection do xóa 2 space mỗi dòng
          .setTextSelection({
            from,
            to: to - avgRemoved * lines.length,
          })
          .run()

        return true;
      }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockShikiComponent);
  },

  addCommands() {
    return {
      // @ts-ignore
      ...this.parent?.(),
      toggleCodeBlockShiki:
      () =>
        ({ commands }: CommandProps) => {
          try {
            return commands.toggleNode(this.name, 'paragraph');
          } catch (e) {
            return false;
          }
        },
    }
  },
})
