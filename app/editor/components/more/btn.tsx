"use client";
import { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoTasklist, GoListUnordered, GoListOrdered } from "react-icons/go";
import './style.css';
import { RxDividerHorizontal } from "react-icons/rx";
import { PiCaretDown, PiCaretDownBold } from "react-icons/pi";
import CustomButtonPopup from "./customButtonPopup";
import { useState } from "react";

export default function MoreBtn({ editor }: { editor: Editor }) {
    const [openCustomButtonPopup, setOpenCustomButtonPopup] = useState(false);

    return (
        <>
            { openCustomButtonPopup && <CustomButtonPopup setOpenCustomButtonPopup={setOpenCustomButtonPopup} editor={editor}/> }
            <div className="w-fit caret-transparent h-[30px] mx-0.5 flex justify-center text-sm cursor-pointer">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <p className="h-fit w-fit flex text-sm my-auto gap-[3px]">Add <PiCaretDownBold className="w-3 h-3 my-auto opacity-50"/></p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => editor.chain().focus().addDivider().run()}>
                                <RxDividerHorizontal className="my-auto !w-6 !h-6"/> Divider
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenCustomButtonPopup(true)}>
                                Custom button
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
