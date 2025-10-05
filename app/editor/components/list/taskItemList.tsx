import TaskItem from "@tiptap/extension-task-item";

export const TaskItemListNode = TaskItem.configure({
    nested: true, // cho phép lồng tasklist
    HTMLAttributes: {
        class: 'pl-1 list-none flex gap-2 text-base', // bỏ dấu chấm
    }
})