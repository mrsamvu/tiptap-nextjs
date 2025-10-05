import BulletList from '@tiptap/extension-bullet-list';

export const BulletListNode = BulletList.extend({
    addNodeView() {
        return () => {
            // wrapper ngoài
            const wrapper = document.createElement("div")
            wrapper.classList.add("list-wrapper")

            // ul thật bên trong
            const ul = document.createElement("ul")
            ul.classList.add("list-disc", "ml-6") // tailwind class

            wrapper.appendChild(ul)

            return {
                dom: wrapper,     // div ngoài
                contentDOM: ul,   // li vẫn cắm thẳng vào ul
            }
        }
    },
}).configure({
    HTMLAttributes: {
        class: 'list-disc ml-6', // dấu chấm + lề trái
    },
})