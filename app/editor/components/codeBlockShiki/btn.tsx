"use client";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { PiCodeSimpleBold } from "react-icons/pi";

export default function CodeBlockShikiBtn({ editor }: { editor: Editor }) {
    const [codeBlockActive, setCodeBlockActive] = useState<boolean>(false);
    const [enableCodeBlock, setEnableCodeBlock] = useState<boolean>(false);

    useEffect(() => {
        // hàm xử lý mỗi khi selection thay đổi
        const handler = () => {
            const { state } = editor;
            const { $from } = state.selection;
            const node = $from.node($from.depth);
            
            if (node.type.name == 'codeBlock') {
                setCodeBlockActive(true);
            } else {
                setCodeBlockActive(false);
            }

            setEnableCodeBlock(editor.can().toggleCodeBlockShiki());
        };
    
        // Đăng ký listener
        editor.on("transaction", handler);
    
        // cleanup khi unmount
        return () => {
            editor.off("transaction", handler);
        };
    }, [editor]);
    return <>
        <div onClick={enableCodeBlock ? () => { editor.chain().focus().toggleCodeBlockShiki().run(); setCodeBlockActive(pre => !pre); } : () => {}} className={`px-1 pr-1.5 ${!enableCodeBlock ? 'opacity-50 cursor-not-allowed' : ''} flex cursor-pointer justify-center ${codeBlockActive ? 'dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]' : ''} w-fit h-[30px] rounded`}>
            <PiCodeSimpleBold className="my-auto w-5 h-5"/>
        </div>
    </>
}