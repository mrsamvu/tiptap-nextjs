"use client";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { GoImage } from "react-icons/go";
import { PiX } from "react-icons/pi";
import UploadArea from "./components/imageArea";


export default function ImageBtn({ editor }: { editor: Editor }) {
    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            // setIsBold(editor.isActive("bold"));
            // setCanBold(editor.can().toggleBold());
        };

        // editor.on("selectionUpdate", update);
        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
            // editor.off("selectionUpdate", (update));
        };
    }, [editor]);

    return (
        <>
            {
                openPopup && 
                    <>
                        <div className="top-0 left-0 bg-black w-full h-full z-[150] fixed bg-white-1 opacity-65" onClick={() => { setOpenPopup(false) }}/>
                        <div className="bg-[#171717] fixed text-white-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit max-sm:w-[98dvw] max-sm:rounded-none rounded z-[200]">
                            <div className="w-[500px] max-sm:w-full h-fit p-2 flex flex-col gap-2">
                                <div className="w-full h-fit flex justify-between">
                                    <p className="text-sm text-white">Add image</p><PiX onClick={() => { setOpenPopup(false) }} className="cursor-pointer w-5 h-5 text-white"/>
                                </div>
                                <div className="w-full max-h-[90dvh] overflow-y-auto">
                                    <UploadArea setOpenPopup={setOpenPopup} editor={editor}/>
                                </div>
                            </div>
                        </div>
                    </>
            }

            <button
                onClick={() => setOpenPopup(true)}
                disabled={false}
                className={`${false ? 'cursor-not-allowed' : ''} flex justify-center w-fit h-[30px] rounded disabled:opacity-50
                    ${
                        false ?
                        "bg-[#151515] border-[1px] border-white/10 border-solid"
                        :
                        ""
                    }`
                }
            >
                <GoImage className="my-auto w-6 h-6" />
            </button>
        </>
    );
}
