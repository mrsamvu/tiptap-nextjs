"use client";
import { Editor } from "@tiptap/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { PiRowsPlusBottom, PiRowsPlusTop, PiXCircle } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxValueNone } from "react-icons/rx";
import { IoColorFillOutline } from "react-icons/io5";
import { AiOutlineMergeCells } from "react-icons/ai";
import { AiOutlineSplitCells } from "react-icons/ai";
import { TbColumnInsertLeft, TbColumnInsertRight } from "react-icons/tb";
import { TbColumnRemove } from "react-icons/tb";
import { TbRowRemove } from "react-icons/tb";
import { CellSelection } from '@tiptap/pm/tables';
import { TABLE_BACKGROUND_CLASSES } from "./config";


export default function TaleToolBar({ editor, showTableToolBarMobile, setShowTableToolBarMobile }: { editor: Editor, showTableToolBarMobile: boolean, setShowTableToolBarMobile: Dispatch<SetStateAction<boolean>> }) {
    const [showTableToolBar, setShowTableToolBar] = useState(false);
    // const [canHighlight, setCanHighlight] = useState(false);
    // const [isHighlight, setIsHighlight] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            const state = editor.state;
            if (state.selection instanceof CellSelection) {
                // đang select nhiều ô
                console.log('Đang chọn nhiều ô')
                setShowTableToolBar(true);
            } else if (editor.isActive('tableCell')) {
                // đang ở trong 1 ô
                console.log('Đang ở trong một ô')
                setShowTableToolBar(true);
            } else {
                console.log('Không ở trong cell nào')
                setShowTableToolBar(false);
            }
        };

        // editor.on("selectionUpdate", update);
        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
            // editor.off("selectionUpdate", (update));
        };
    }, [editor]);

    // ${showTableToolBar ? '' : 'hidden'}
    return (
        <>
            <div className={`${showTableToolBarMobile ? '' : 'hidden'} sm:!hidden top-0 left-0 bg-black w-full h-full z-[50] fixed bg-white-1 opacity-25`} onClick={() => setShowTableToolBarMobile(false)}/>
            <div className={` ${showTableToolBar ? 'translate-x-0' : '-translate-x-full'} ${showTableToolBarMobile ? 'max-sm:!translate-x-0' : 'max-sm:!-translate-x-full'} absolute sm:top-[46px] flex flex-col dark:bg-black z-[51] h-full overflow-y-auto transform transition-transform duration-300`}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={false} className={`${true ? '' : 'text-white/65'} cursor-pointer px-2 py-[6px]  border-[1px] dark:border-white/10 border-solid`}>
                        <div className="flex gap-2"><IoColorFillOutline className="my-auto w-6 h-6" /><p className="text-sm my-auto">Background color</p></div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className="!w-fit min-w-0 !z-[210] sm:mt-12" align="center" >
                        <DropdownMenuGroup className="flex flex-col">
                            <div className="flex flex-wrap w-[80px]">
                            {
                                TABLE_BACKGROUND_CLASSES.map(i => 
                                    <DropdownMenuItem key={i} onClick={() => editor.chain().updateAttributes('tableCell', { backgroundColor: i }).run()}>
                                        <div className={`w-6 h-6 rounded-full ${i}`}></div>
                                    </DropdownMenuItem>
                                )
                            }
                            </div>
                            <DropdownMenuItem className="w-full flex" disabled>
                                <div className="h-[1px] w-6 border-t-white/65 border-t-[1px] mx-auto"></div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="w-full flex" onClick={() => editor.chain().updateAttributes('tableCell', { backgroundColor: null }).run()}>
                                <div className="w-6 h-6 mx-auto"><RxValueNone className="w-full h-full"/></div>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <button
                    onClick={() => editor.chain().mergeCells().run()}
                    className={`flex justify-left h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid w-full`}
                >
                    <AiOutlineMergeCells className="my-auto w-5 h-5" /><p className="text-sm my-auto">Merge cells</p>
                </button>

                <button
                    onClick={() => editor.chain().splitCell().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <AiOutlineSplitCells className="my-auto w-5 h-5" /><p className="text-sm my-auto">Split cells</p>
                </button>

                <button
                    onClick={() => editor.chain().deleteTable().run()}
                    className={`flex justify-left h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid w-full`}
                >
                    <PiXCircle className="my-auto w-5 h-5" /><p className="text-sm my-auto">Delete table</p>
                </button>

                <p className="w-full text-sm px-2 mt-3 dark:text-white/50 text-black/50">Columns</p>
                <button
                    onClick={() => editor.chain().addColumnBefore().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <TbColumnInsertLeft className="my-auto w-5 h-5" /><p className="text-sm  my-auto">Add columns left</p>
                </button>

                <button
                    onClick={() => editor.chain().addColumnAfter().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <TbColumnInsertRight className="my-auto w-5 h-5" /><p className="text-sm  my-auto">Add columns right</p>
                </button>

                <button
                    onClick={() => editor.chain().deleteColumn().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <TbColumnRemove className="my-auto w-5 h-5" /><p className="text-sm  my-auto">Remove columns</p>
                </button>
                <p className=" w-full text-sm px-2 mt-3 dark:text-white/50 text-black/50">Rows</p>
                <button
                    onClick={() => editor.chain().addRowBefore().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <PiRowsPlusTop className="my-auto w-5 h-5" /><p className="text-sm my-auto">Add rows top</p>
                </button>

                <button
                    onClick={() => editor.chain().addRowAfter().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <PiRowsPlusBottom className="my-auto w-5 h-5" /><p className="text-sm my-auto">Add rows bottom</p>
                </button>

                <button
                    onClick={() => editor.chain().deleteRow().run()}
                    className={`flex justify-left w-full h-fit disabled:opacity-50 gap-2 p-2 border-[1px] dark:border-white/10 border-solid`}
                >
                    <TbRowRemove className="my-auto w-5 h-5" /><p className="text-sm my-auto">Remove rows</p>
                </button>
            </div>
        </>
    );
}
