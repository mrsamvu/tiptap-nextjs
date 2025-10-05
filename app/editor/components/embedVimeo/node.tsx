import { Node, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import { EmbedViewRender } from './embedViewRender';
import { Plugin } from 'prosemirror-state';

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        Vimeo: {
            /**
             * create a youtube node
             */
            insertVimeo: ({ src }: { src: string }) => ReturnType;
        };
    }
}

export function extractVimeoId(url: string): string | null {
    try {
        const u = new URL(url)

        // vimeo.com/<id>
        if (u.hostname === 'vimeo.com') {
            return u.pathname.split('/')[1]
        }

        // player.vimeo.com/video/<id>
        if (u.hostname === 'player.vimeo.com') {
            const parts = u.pathname.split('/')
            if (parts.length > 2 && parts[1] === 'video') {
                return parts[2]
            }
        }

        return null
    } catch {
        return null
    }
}

export const Vimeo = Node.create({
    name: 'vimeo',
    group: 'block',
    content: 'block*',
    atom: true, // Chặn chỉnh sửa bên trong node
    selectable: true,
    inline: false,
    addAttributes() {
        return {
            src: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-vimeo-embed]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-vimeo-embed': 'true' }),
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmbedViewRender);
    },

    addCommands() {
        return {
            insertVimeo:
                (options: { src: string }) =>
                    ({ chain }) => {
                        return chain().focus().insertContent({
                            type: this.name,
                            attrs: { src: options.src },
                        }).run();
                    },
        }
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste: (view, event) => {
                        const pasted = event.clipboardData?.getData('text/plain') || '';
                        if (!pasted) return false;

                        // detect Vimeo link
                        if (pasted.includes('vimeo.com')) {
                            const videoId = extractVimeoId(pasted)
                            if (!videoId) return false

                            const embedUrl = `https://player.vimeo.com/video/${videoId}`

                            // Node insertVimeo bạn tự định nghĩa
                            this.editor.chain().focus().insertVimeo({ src: embedUrl }).run()

                            return true
                        }

                        return false
                    },
                },
            }),
        ]
    },
})
