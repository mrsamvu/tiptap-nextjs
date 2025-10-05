import TextAlign from "@tiptap/extension-text-align";

export const TextAlignNode = TextAlign.configure({
    types: ['heading', 'paragraph'], // áp dụng cho node nào
})