import BlockQuote from '@tiptap/extension-blockquote';
import { CommandProps } from '@tiptap/react';

export const BlockQuoteNode = BlockQuote.extend({
    content: '(blockquote | paragraph | heading)+',
    addCommands() {
        return {
            toggleBlockquote:
                () =>
                ({ commands, editor, chain }: CommandProps) => {
                    // Nếu đang trong pullquote → lift rồi set blockquote
                    if (editor.isActive('pullquote')) {
                        return chain().focus().lift('pullquote').wrapIn('blockquote').run()
                    }
                    // Ngược lại thêm blockquote
                    return commands.toggleWrap(this.name);
                }
        }
    }
})