"use client";
import { Editor } from "@tiptap/react";
import { BsTypeBold } from "react-icons/bs";
import { useEffect, useState } from "react";
import { PiTextStrikethroughBold } from "react-icons/pi";

export default function StrikeBtn({ editor }: { editor: Editor }) {
    const [canStrike, setCanStrike] = useState(false);
    const [isStrike, setIsStrike] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsStrike(editor.isActive("strike"));
            setCanStrike(editor.can().toggleStrike());
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
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!canStrike}
            className={`${!canStrike ? 'cursor-not-allowed' : ''} flex justify-center w-fit -mr-1.5 h-[30px] px-1 rounded disabled:opacity-50 
                ${
                    isStrike ?
                    "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                    :
                    ""

                }`
            }
        >
            <PiTextStrikethroughBold className="my-auto w-5 h-5" />
        </button>
    );
}
