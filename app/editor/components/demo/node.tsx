// extensions/TestNode.ts
import { Node, NodeViewRendererProps, NodeViewWrapper, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react'

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        TestNode: {
            /**
             * create a card node
             */
            myCommand: () => ReturnType;
        };
    }
}

// Định nghĩa Node
export const TestNode = Node.create({
    name: 'testNode', // tên node

    group: 'block',   // block-level node

    atom: true,       // không chứa nội dung con

    // HTML → Node
    parseHTML() {
        return [
            {
                tag: 'div[data-type="test-node"]',
            },
        ]
    },

    // Node → HTML
    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes({ 'data-type': 'test-node', class: 'p-2 bg-blue-100' }, HTMLAttributes),
            'Hello Custom Node',
        ]
    },

    // Command để insert node và tạo một paragraph mới và move caret vào paragraph
    // addCommands() {
    //     return {
    //       myCommand: () => ({ chain, state }) => {
    //         // vị trí hiện tại
    //         const { to } = state.selection
    
    //         return chain()
    //           // chèn node custom
    //           .insertContent([
    //             { type: this.name },
    //             { type: 'paragraph' },
    //           ])
    //           // di chuyển caret vào paragraph mới
    //           .setTextSelection(to + 2) // vị trí sau node custom + 1 paragraph
    //           .focus()
    //           .run()
    //       }
    //     }
    // },

    // Command để insert node
    addCommands() {
        return {
          myCommand: () => ({ commands }) => commands.insertContent({ type: this.name })
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(({
            node,
            editor,
            getPos,
            HTMLAttributes,
            // updateAttributes,
            // deleteNode,
        }: NodeViewRendererProps) => <NodeViewWrapper {...HTMLAttributes}><div>ok</div></NodeViewWrapper>)
    }
})

// ví dụ pros của nodeView
// import React from 'react'
// import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
// import type { NodeViewRendererProps } from '@tiptap/react'

// const TestNodeView: React.FC<NodeViewRendererProps> = ({
//   node,
//   editor,
//   HTMLAttributes,
//   getPos,
// }) => {
//   // Lấy attribute của node
//   const title = node.attrs.title || 'No title'

//   // Update attribute của node
//   const updateTitle = () => {
//     editor.commands.updateAttributes(node.type.name, { title: 'New title' })
//   }

//   return (
//     <NodeViewWrapper {...HTMLAttributes} className="p-2 bg-blue-100">
//       <div>{title}</div>
//       <button onClick={updateTitle}>Update title</button>

//       {/* Nếu node có content */}
//       <NodeViewContent className="inner-content" />
//     </NodeViewWrapper>
//   )
// }

// export default TestNodeView

