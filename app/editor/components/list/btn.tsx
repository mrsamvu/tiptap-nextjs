"use client";
import { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoTasklist, GoListUnordered, GoListOrdered } from "react-icons/go";
import './style.css';
import { PiCaretDownBold } from "react-icons/pi";

export default function ListBtn({ editor }: { editor: Editor }) {
    // const [canItalic, setCanItalic] = useState(false);
    // const [isItalic, setIsItalic] = useState(false);

    // useEffect(() => {
    //     if (!editor) return;

    //     const update = () => {
    //         setIsItalic(editor.isActive("italic"));
    //         setCanItalic(editor.can().toggleItalic());
    //     };

    //     // editor.on("selectionUpdate", update);
    //     editor.on("transaction", update); // mỗi khi doc thay đổi → update state

    //     return () => {
    //         editor.off("transaction", update);
    //         // editor.off("selectionUpdate", (update));
    //     };
    // }, [editor]);

    return (
        <div className="w-fit h-[30px] flex justify-center -ml-[5px] mr-1">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <p className="h-full flex gap-[3px]"><GoListUnordered className="my-auto w-6 h-6"/><PiCaretDownBold className="w-3 h-3 my-auto opacity-50"/></p>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-25" align="start">
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
                            <GoListUnordered className="my-auto !w-6 !h-6"/> Bullet
                            {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                            <GoListOrdered className="my-auto !w-6 !h-6"/> Order
                            {/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleTaskList().run()}>
                            <GoTasklist className="my-auto !w-6 !h-6"/> Task
                            {/* <DropdownMenuShortcut>⌘S</DropdownMenuShortcut> */}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
