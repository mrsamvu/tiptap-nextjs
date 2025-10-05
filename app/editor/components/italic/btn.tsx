"use client";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { PiTextItalicBold } from "react-icons/pi";

export default function ItalicBtn({ editor }: { editor: Editor }) {
    const [canItalic, setCanItalic] = useState(false);
    const [isItalic, setIsItalic] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsItalic(editor.isActive("italic"));
            setCanItalic(editor.can().toggleItalic());
        };

        // editor.on("selectionUpdate", update);
        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
            // editor.off("selectionUpdate", (update));
        };
    }, [editor]);

    return (
        <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!canItalic}
            className={`${!canItalic ? 'cursor-not-allowed' : ''} flex justify-center -mr-1.5 w-fit h-[30px] px-1 rounded disabled:opacity-50
                ${
                    isItalic ?
                    "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                    :
                    ""
                }`
            }
        >
            <PiTextItalicBold className="my-auto w-5 h-5" />
        </button>
    );
}
