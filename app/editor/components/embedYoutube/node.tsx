import { Node, NodeViewProps, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import { EmbedViewRender } from './embedViewRender';
import { Plugin } from 'prosemirror-state';
import './style.css';

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        YouTube: {
            /**
             * create a youtube node
             */
            insertYouTube: ({ src }: { src: string }) => ReturnType;
        };
    }
}

export function extractYouTubeId(url: string): string | null {
    try {
        const u = new URL(url)

        // youtube.com/watch?v=...
        if (u.searchParams.get('v')) {
            return u.searchParams.get('v')
        }

        // youtu.be/<id>
        if (u.hostname === 'youtu.be') {
            return u.pathname.slice(1)
        }

        // youtube.com/shorts/<id>
        if (u.pathname.startsWith('/shorts/')) {
            return u.pathname.split('/')[2] // lấy <id>
        }

        return null
    } catch {
        return null
    }
}

export const YouTube = Node.create({
    name: 'youtube',
    group: 'block',
    content: 'block*',
    atom: true, // Chặn chỉnh sửa bên trong node
    selectable: true,
    inline: false,
    isolating: true,

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
                tag: 'div[data-youtube-embed]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-youtube-embed': 'true' }),
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmbedViewRender);
    },


    addCommands() {
        return {
            insertYouTube:
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

                        if (pasted.includes('youtube.com') || pasted.includes('youtu.be') || pasted.includes('youtube.com/shorts')) {
                            const videoId = extractYouTubeId(pasted)
                            if (!videoId) return false

                            const embedUrl = `https://www.youtube.com/embed/${videoId}`

                            this.editor.chain().focus().insertYouTube({ src: embedUrl }).run();

                            return true;
                        }

                        return false
                    },
                },
            }),
        ]
    }
})
