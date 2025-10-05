"use client";
import { Editor } from "@tiptap/react";
import { BsTypeBold } from "react-icons/bs";
import { useEffect, useState } from "react";

export default function BoldBtn({ editor }: { editor: Editor }) {
    const [canBold, setCanBold] = useState(false);
    const [isBold, setIsBold] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsBold(editor.isActive("bold"));
            setCanBold(editor.can().toggleBold());
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
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!canBold}
            className={`${!canBold ? 'cursor-not-allowed' : ''} flex justify-center w-fit px-2 -mr-1.5 h-[30px] rounded disabled:opacity-50
                ${
                    isBold ?
                    "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                    :
                    ""
                }`
            }
        >
            <p className="my-auto font-medium text-[20.5px]">B</p>
        </button>
    );
}
