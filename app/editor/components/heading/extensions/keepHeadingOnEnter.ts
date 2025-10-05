import { Extension } from "@tiptap/react"

export const KeepHeadingOnEnterExtension = Extension.create({
    name: 'keepHeadingOnEnter',

    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                const { state, dispatch } = editor.view
                const { $from } = state.selection
                const node = $from.parent

                // Nếu đang ở heading thì giữ heading khi xuống dòng
                if (node.type.name === 'heading') {
                    const { tr } = state;
                    if (dispatch) {
                        // tách block
                        tr.split(state.selection.from)

                        // ép node sau vẫn là heading cùng level
                        const newPos = tr.selection.from
                        tr.setNodeMarkup(newPos - 1, node.type, node.attrs)

                        dispatch(tr.scrollIntoView())
                    }
                    return true
                }

                return false
            }
        }
    },
});