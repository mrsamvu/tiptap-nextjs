"use client";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { RiAlignCenter, RiAlignLeft, RiAlignRight } from "react-icons/ri";

export default function TextAlignBtn({ editor }: { editor: Editor }) {
    const [canAlignRight, setCanAlignRight] = useState(false);
    const [isAlignRight, setIsAlignRight] = useState(false);

    const [canAlignLeft, setCanAlignLeft] = useState(false);
    const [isAlignLeft, setIsAlignLeft] = useState(false);

    const [canAlignCenter, setCanAlignCenter] = useState(false);
    const [isAlignCenter, setIsAlignCenter] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsAlignLeft(editor.isActive({ textAlign: 'left' }));
            setCanAlignLeft(editor.can().setTextAlign('left') && !editor.isActive('codeBlock'));

            setIsAlignRight(editor.isActive({ textAlign: 'right' }));
            setCanAlignRight(editor.can().setTextAlign('right') && !editor.isActive('codeBlock'));

            setIsAlignCenter(editor.isActive({ textAlign: 'center' }));
            setCanAlignCenter(editor.can().setTextAlign('center') && !editor.isActive('codeBlock'));
        };

        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
        };
    }, [editor]);

    return (
        <div className={`flex my-auto gap-[10px]`}>
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                disabled={!canAlignLeft}
                className={`${!canAlignLeft ? 'cursor-not-allowed' : ''} px-1 flex justify-center w-fit h-[30px] rounded disabled:opacity-50
                    ${
                        isAlignLeft ?
                        "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                        :
                        ""
                    }`
                }
            >
                <RiAlignLeft className={`my-auto w-5 h-6`} />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                disabled={!canAlignCenter}
                className={`${!canAlignCenter ? 'cursor-not-allowed' : ''} px-1 flex justify-center w-fit h-[30px] rounded disabled:opacity-50
                    ${
                        isAlignCenter ?
                        "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                        :
                        ""
                    }`
                }
            >
                <RiAlignCenter className="my-auto w-5 h-6" />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                disabled={!canAlignRight}
                className={`${!canAlignRight ? 'cursor-not-allowed' : ''} px-1 flex justify-center w-fit h-[30px] rounded disabled:opacity-50
                    ${
                        isAlignRight ?
                        "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                        :
                        ""
                    }`
                }
            >
                <RiAlignRight className="my-auto w-5 h-6" />
            </button>
        </div>
    );
}
