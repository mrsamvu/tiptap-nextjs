"use client";
import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import { PiHighlighter } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RxValueNone } from "react-icons/rx";
import { HIGHLIGHT_CLASSES } from "./config";


export default function HighlightBtn({ editor }: { editor: Editor }) {
    const [canHighlight, setCanHighlight] = useState(false);
    const [isHighlight, setIsHighlight] = useState(false);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsHighlight(editor.isActive("highlight"));
            setCanHighlight(editor.can().toggleHighlight());
        };

        // editor.on("selectionUpdate", update);
        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
            // editor.off("selectionUpdate", (update));
        };
    }, [editor]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!canHighlight} className={`${canHighlight ? '' : 'dark:text-white/50 text-black/50 cursor-not-allowed'}`}>
                <div className="my-auto"><PiHighlighter className="my-auto w-5 h-5 mt-1" /></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="center" >
                <DropdownMenuGroup className="flex">
                    <div className="flex flex-wrap w-[200px]">
                    {
                        HIGHLIGHT_CLASSES.map(i => 
                            <DropdownMenuItem key={i} onClick={() => editor.chain().focus().toggleHighlight({ color: i }).run()}>
                                <div className={`w-6 h-6 rounded-full ${i}`}></div>
                            </DropdownMenuItem>
                        )
                    }
                    </div>
                    <DropdownMenuItem disabled>
                        <div className="w-[1px] h-6 cursor-none dark:border-l-white/65 border-l-black/65 border-l-[1px]"></div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editor.chain().focus().unsetHighlight().run()}>
                        <div className="w-6 h-6"><RxValueNone className="w-full h-full"/></div>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
