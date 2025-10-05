"use client";

import { Editor } from "@tiptap/react";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { HEADING_LEVEL_TYPE, HEADING_TITLE_LEVEL_TYPE } from "./config";
import './style.css';

export default function HeadingBtn({ editor }: { editor: Editor }) {
    const [label, setLabel] = useState<string>('Normal');

    const dataHeading: Record<Exclude<HEADING_TITLE_LEVEL_TYPE, 'Normal'>, HEADING_LEVEL_TYPE> = {
        H1: 1, H2: 2, H3: 3, H4: 4, H5: 5, H6: 6
    }

    useEffect(() => {
        // hàm xử lý mỗi khi selection thay đổi
        const handler = () => {
            const { state } = editor;
            const { $from } = state.selection;
            const node = $from.node($from.depth);

            if (node.type.name == 'heading') {
                // setCodeBlockActive(true);
                setLabel(`H${node.attrs.level}`);
            } else {
                setLabel(`Normal`)
            }
        };
    
        // Đăng ký listener
        // editor.on("selectionUpdate", handler);
        editor.on('transaction', handler);
        // cleanup khi unmount
        return () => {
            // editor.off("selectionUpdate", handler);
            editor.off("transaction", handler);
        };
    }, [editor]);

    return (
        <>
            <div onSelect={(e) => e.preventDefault()} className={`caret-transparent mr-1.5 flex justify-center pl-1 ${label != "Normal" ? 'dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]' : ''} w-fit h-[30px] rounded`}>
                <Select value={label} onValueChange={(value: HEADING_TITLE_LEVEL_TYPE) => {
                    setLabel(value);
                    if (value == 'Normal') {
                        editor.chain().focus().setParagraph().run();
                    } else {
                        editor.chain().focus().setHeading({ level: dataHeading[value] }).run()
                    }
                }}>
                    <SelectTrigger className="w-fit border-none outline-none !shadow-none focus:ring-0 p-0 h-fit my-auto gap-[2px]">
                        <SelectValue placeholder="H" />
                    </SelectTrigger>
                    <SelectContent className="-ml-2">
                        {
                            ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map(i => <SelectItem key={i} value={i as any}>{i}</SelectItem>)
                        }
                    </SelectContent>
                </Select>
            </div>
        </>
    );
}
