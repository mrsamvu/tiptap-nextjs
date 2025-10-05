import { Node, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import { EmbedViewRender } from './embedViewRender';
import { Plugin } from 'prosemirror-state';

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        Spotify: {
            /**
             * create a Spotify node
             */
            insertSpotify: ({ src }: { src: string }) => ReturnType;
        };
    }
}


export function convertSpotifyToEmbed(url: string, defaultTheme: string = '0'): string | null {
    try {
        const parsedUrl = new URL(url.trim());

        if (!parsedUrl.hostname.includes('spotify.com')) return null;

        // lấy path sau domain, vd: /track/xxxxxx
        const path = parsedUrl.pathname;

        // Tạo URL embed mới
        const embedUrl = new URL(`https://open.spotify.com/embed${path}`);

        // Lấy theme từ link gốc (nếu có)
        const theme = parsedUrl.searchParams.get('theme') || defaultTheme;

        // Luôn set utm_source=generator
        embedUrl.searchParams.set('utm_source', 'generator');
        // Set theme (từ gốc hoặc default)
        embedUrl.searchParams.set('theme', theme);

        return embedUrl.toString();
    } catch (err) {
        return null;
    }
}

export const Spotify = Node.create({
    name: 'spotify',
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
                tag: 'div[data-spotify-embed]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-spotify-embed': 'true' }),
        ]
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmbedViewRender);
    },

    addCommands() {
        return {
            insertSpotify:
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

                        if (pasted.includes('spotify.com')) {
                            const embedUrl = convertSpotifyToEmbed(pasted, '0');
                            if (!embedUrl) return false;

                            this.editor.commands.insertSpotify({ src: embedUrl });
                            return true;
                        }

                        return false
                    },
                },
            }),
        ]
    },
})
