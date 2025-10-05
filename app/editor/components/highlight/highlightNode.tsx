import Highlight from '@tiptap/extension-highlight';

export const HighlightNode = Highlight.extend({
    addAttributes() {
        return {
        color: {
            default: null,
            parseHTML: element => element.getAttribute('data-color'),
            renderHTML: attrs => {
            if (!attrs.color) return {}
            return {
                class: `${attrs.color}`,   // thay vì style
                'data-color': attrs.color,           // giữ lại để toggle được
            }
            },
        },
        }
    },
}).configure({
    multicolor: true, // nếu muốn nhiều màu
})