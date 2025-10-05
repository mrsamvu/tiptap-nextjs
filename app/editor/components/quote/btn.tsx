"use client";
import { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaQuoteRight } from "react-icons/fa6";
import './style.css';
import { BsBlockquoteLeft } from "react-icons/bs";
import { GoQuote } from "react-icons/go";
import { useEffect, useState } from "react";


export default function QuoteBtn({ editor }: { editor: Editor }) {
    const [canQuote, setCanQuote] = useState(false);

    useEffect(() => {
        const update = () => {
            setCanQuote(editor.can().togglePullquote() || editor.can().toggleBlockquote());
        };

        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
        };
    }, [editor]);

    return (
        <div className="w-fit h-[30px] flex justify-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={!canQuote} className={`${!canQuote ? 'opacity-50 cursor-not-allowed' : ''} my-auto`}>
                    <p className="h-full flex"><FaQuoteRight className="my-auto w-6 h-6"/></p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-25" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                            <GoQuote className="my-auto !w-6 !h-6"/> Block
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().togglePullquote().run()}>
                            <BsBlockquoteLeft className="my-auto !w-6 !h-6"/> Pull
                            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
