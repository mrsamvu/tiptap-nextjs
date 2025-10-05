import { Table } from "@tiptap/extension-table"

export const TableNode = Table.extend({
    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            { class: "tableWrapper" },
            ["table", HTMLAttributes, 0]
        ]
    }
}).configure({
    resizable: true
})