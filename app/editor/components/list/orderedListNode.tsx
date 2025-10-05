import OrderedList from '@tiptap/extension-ordered-list';

export const OrderedListNode = OrderedList.extend({
    addNodeView() {
        return () => {
            // tạo div wrapper
            const wrapper = document.createElement("div")
            wrapper.classList.add("list-wrapper")

            // tạo ol thật
            const ol = document.createElement("ol")
            ol.classList.add("ml-6", "list-decimal", "pl-6") // thêm class tailwind

            // append vào wrapper
            wrapper.appendChild(ol)

            return {
                dom: wrapper,     // div ngoài
                contentDOM: ol,   // li vẫn được render trực tiếp vào ol
            }
        }
    },
}).configure({
    HTMLAttributes: {
        class: 'list-decimal ml-6', // Tailwind
    },
})