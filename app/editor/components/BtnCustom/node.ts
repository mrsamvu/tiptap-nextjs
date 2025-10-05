import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import BtnCustomNodeView from "./btnCustomNodeView";

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        ButtonCustomNode: {
            setButtonCustom: (options: {
                text: string;
                url?: string;
                btnColor?: string;
                textColor?: string;
            }) => ReturnType;
        }
    }
}

const ButtonCustomNode = Node.create({
    name: "customButton",
    group: 'block',
    content: 'block*',
    atom: true, // Chặn chỉnh sửa bên trong node
    selectable: true,
    inline: false,

    addAttributes() {
        return {
            text: { default: "Button custom" },
            url: { default: "#" },
            btnColor: { default: "#3b82f6" }, // mặc định xanh Tailwind
            textColor: { default: "#ffffff" },
        };
    },

    parseHTML() {
        return [{ tag: "a[data-type='custom-button']" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["a", mergeAttributes(HTMLAttributes, { "data-type": "custom-button" }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(BtnCustomNodeView);
    },

    addCommands() {
        return {
            setButtonCustom:
                (options) =>
                    ({ chain }) => {
                        return chain()
                            .insertContent({
                                type: this.name,
                                attrs: options,
                            })
                            .run();
                    },
        };
    },
});

export default ButtonCustomNode;
