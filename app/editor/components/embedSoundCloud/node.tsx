import { Node, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import { EmbedViewRender } from './embedViewRender';
import { Plugin } from 'prosemirror-state';

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        SoundCloud: {
            /**
             * create a SoundCloud node
             */
            insertSoundCloud: ({ src }: { src: string }) => ReturnType;
        };
    }
}

export const SoundCloud = Node.create({
    name: 'soundcloud',
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
                tag: 'div[data-soundcloud-embed]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-soundcloud-embed': 'true' }),
        ]
    },

    addCommands() {
        return {
            insertSoundCloud:
                (options: { src: string }) =>
                    ({ chain }) => {
                        return chain().focus().insertContent({
                            type: this.name,
                            attrs: { src: options.src },
                        }).run();
                    },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmbedViewRender);
    },

    // Khi paste link vào thì handlePaste ở đây
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handlePaste: (view, event) => {
                        const paste = event.clipboardData?.getData('text/plain') || '';
                        if (!paste) return false;

                        if (paste.includes('soundcloud.com')) {
                            event.preventDefault()

                            fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(paste)}&format=json`)
                                .then(res => res.json())
                                .then(data => {
                                    const html = data.html
                                    const srcMatch = html.match(/src="([^"]+)"/)
                                    if (!srcMatch) return
                                    const srcUrl = srcMatch[1]
                                    // console.log("srcUrl: ", srcUrl);
                                    const urlParams = new URL(srcUrl).searchParams
                                    urlParams.delete('visual')
                                    console.log("encoded: ", urlParams);
                                    this.editor.commands.insertSoundCloud({ src: "https://w.soundcloud.com/player/?" + urlParams });
                                })

                            return true
                        }

                        return false
                    },
                },
            }),
        ]
    },
})
