import { TableCell } from "@tiptap/extension-table";
import { Editor } from "@tiptap/react";
import { cellAround, isInTable } from "@tiptap/pm/tables";

export const TableCellNode = TableCell.extend({
    content: '(paragraph|heading|bulletList|taskList|orderedList)+',
    renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any>}) {
        const colwidth = HTMLAttributes.colwidth?.[0] // prosemirror lưu dạng array
        if (colwidth) {
            return [
                'td',
                { ...HTMLAttributes, style: `width: ${colwidth}px;` },
                0,
            ]
        }
        return ['td', HTMLAttributes, 0]
    },
    addAttributes() {
        return {
        //@ts-ignore
        ...this.parent?.(),
        backgroundColor: {
            default: null,
            parseHTML: (element: { getAttribute: (arg0: string) => any; }) => element.getAttribute('data-background-color'),
            renderHTML: (attrs: { backgroundColor: any; }) => {
                if (!attrs.backgroundColor) return {}

                return {
                    'data-background-color': attrs.backgroundColor,
                    class: `${attrs.backgroundColor}`, // gán class css thay vì style
                }
            },
        },
        }
    },
    addKeyboardShortcuts() {
        return {
            'Mod-a': ({ editor }: { editor: Editor }) => {
                const state = editor.state
                const { selection } = state

                // Chỉ chạy nếu đang trong bảng
                if (!isInTable(state)) return false

                const $from = selection.$from
                const cell = cellAround($from)
                if (!cell) return false // Không tìm thấy cell → thoát

                // Dùng start & content.size thay vì nodeSize
                const cellNode = state.doc.nodeAt(cell.pos)
                if (!cellNode) return false
                const start = cell.pos + 1
                const end = cell.pos + cellNode.content.size

                // Double check
                if (start >= end || end > state.doc.nodeSize) return false

                // Đặt selection qua command Tiptap (đảm bảo focus)
                editor
                    .chain()
                    .focus()
                    .setTextSelection({ from: start, to: end })
                    .run()

                return true
            }
        }
    },
})