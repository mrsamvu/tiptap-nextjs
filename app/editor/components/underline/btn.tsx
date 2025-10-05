"use client";
import { Editor } from "@tiptap/react";
import { PiTextUnderlineBold } from "react-icons/pi";
import { useEffect, useState } from "react";

export default function UnderlineBtn({ editor }: { editor: Editor }) {
    const [canUnderline, setCanUnderline] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsUnderline(editor.isActive("underline"));
            setCanUnderline(editor.can().toggleUnderline());
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
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            disabled={!canUnderline}
            className={`${!canUnderline ? 'cursor-not-allowed' : ''} flex justify-center w-fit h-[30px] px-1 rounded disabled:opacity-50
                ${
                    isUnderline ?
                    "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                    :
                    ""
                }`
            }
        >
            <PiTextUnderlineBold className="my-auto w-5 h-5" />
        </button>
    );
}
