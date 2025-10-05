import { Node, ReactNodeViewRenderer, mergeAttributes } from '@tiptap/react';
import { EmbedViewRender } from './embedViewRender';
import { Plugin } from 'prosemirror-state';

declare module "@tiptap/core" {
    interface Commands<ReturnType> {
        Gist: {
            /**
             * create a Gist node
             */
            insertGist: ({ gistId, fileName }: { gistId: string, fileName?: string }) => ReturnType;
        };
    }
}

export const Gist = Node.create({
    name: 'gist',
    group: 'block',
    content: 'block*',
    atom: true, // Chặn chỉnh sửa bên trong node
    selectable: true,
    inline: false,

    addAttributes() {
        return {
            gistId: {
                default: null,
            },
            fileName: {
                default: null,
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-gist-embed]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(HTMLAttributes, { 'data-gist-embed': 'true' }),
        ]
    },

    addCommands() {
        return {
            insertGist:
                (options: { gistId: string, fileName?: string }) =>
                    ({ chain }) => {
                        return chain().focus().insertContent({
                            type: this.name,
                            attrs: { gistId: options.gistId, fileName: options.fileName },
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
                        const paste = event.clipboardData?.getData("text/plain") || "";
                        if (!paste) return false;

                        // Check if paste is a GitHub Gist URL
                        const gistRegex = /^https:\/\/gist\.github\.com\/([^\/]+)\/([a-f0-9]+)(?:\/.*)?$/;
                        const match = paste.match(gistRegex);

                        if (match) {
                            event.preventDefault();

                            // const username = match[1];
                            const gistId = match[2];
                            console.log("gistId: ", gistId);
                            // Call your editor command to insert Gist
                            this.editor.commands.insertGist({ gistId: gistId });

                            return true;
                        }

                        return false
                    },
                },
            }),
        ]
    },
})
