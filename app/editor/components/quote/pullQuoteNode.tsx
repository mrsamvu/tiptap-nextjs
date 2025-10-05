import { CommandProps, Node, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        PullquoteNode: {
            /**
             * create a card node
             */
            togglePullquote: () => ReturnType;
        };
    }
}

const PullquoteNode = Node.create({
    name: "pullquote",
    group: "block",
    content: "(paragraph | pullquote)+", // <-- cho phép nhiều block-level element
    defining: true,

    parseHTML() {
        return [
            {
                tag: "pullquote[data-type='pullquote']",
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "pullquote",
            mergeAttributes(HTMLAttributes, {
                "data-type": "pullquote",
                class: "pullquote",
            }),
            0,
        ]
    },

    addCommands() {
        return {
            togglePullquote:
                () =>
                ({ state, commands, editor, chain }) => {
                    // Nếu đang trong blockquote → lift rồi set pullquote
                    if (editor.isActive('blockquote')) {
                        return chain().focus().lift('blockquote').wrapIn('pullquote').run()
                    }
        
                    // Ngược lại thêm pullquote
                    return commands.toggleWrap(this.name);
                }
        }
    }
})

export default PullquoteNode
