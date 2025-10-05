import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        DividerNode: {
        /**
         * create a divider
         */
        addDivider: () => ReturnType;
      };
    }
}

export const DividerNode = Node.create({
    name: 'divider',
    content: 'block*',
    group: 'block', // block node
    atom: true,     // không chứa nội dung

    addAttributes() {
        return {
            class: {
                default: 'divider', // class mặc định
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'p',
            },
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(() => {
            return <NodeViewWrapper>
                <div className='w-full h-[26px] flex cursor-grab'>
                    <div className='w-full my-auto h-[1px] border-solid border-t-[1px] dark:border-t-white/50 border-t-black/50'></div>
                </div>
            </NodeViewWrapper>
        });
    },

    renderHTML({ HTMLAttributes }) {
        return ['p', mergeAttributes(HTMLAttributes)]
    },

    addCommands() {
        return {
            addDivider:
                () =>
                    ({ chain }) => {
                        return chain().insertContent({ type: this.name }).run()
                    },
        }
    },
})
