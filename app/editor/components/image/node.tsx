import { ReactNodeViewRenderer } from "@tiptap/react";
import { Image } from '@tiptap/extension-image';
import ImageNodeView from "./imageNodeView";

export const ImageNode = Image.extend({
    draggable: false,
    inline: false,
    content: 'block*', 
    group: 'block',
    atom: true,
    addAttributes() {
        return {
            //@ts-ignore
            ...this.parent?.(), // giữ nguyên attribute gốc src, alt…
            align: {
                default: 'center', // 'left' | 'center' | 'right'
                parseHTML: (element: { getAttribute: (arg0: string) => any; }) => element.getAttribute('data-align') || 'center',
                renderHTML: (attributes: { align: string; }) => {
                    return {
                        'data-align': attributes.align,
                        style: `text-align:${attributes.align}; display:block; margin:${attributes.align === 'center' ? '0 auto' : attributes.align === 'right' ? '0 0 0 auto' : '0'};`
                    }
                },
            },
            widthPercent: {
                default: 100, // mặc định 100%
                parseHTML: (element: HTMLElement) => {
                    const attr = element.getAttribute('data-width-percent');
                    return attr ? parseFloat(attr) : 100;
                },
                renderHTML: (attributes: { widthPercent: number }) => {
                    return {
                        'data-width-percent': attributes.widthPercent
                    };
                },
            },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer((props) => (<ImageNodeView {...props}/>));
    },
})