import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TableSizePicker from "./components/tableSizePicker";
import { CiViewTable } from "react-icons/ci";
import { Editor } from "@tiptap/react";
import './style.css';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CellSelection } from '@tiptap/pm/tables';

export default function TableBtn({ editor }: { editor: Editor }) {
    const [canTable, setCanTable] = useState(false);
    useEffect(() => {
        if (!editor) return;

        const update = () => {
            // console.log(editor.getAttributes('table')); 
            // const cellNode = editor.state.selection.$anchor.node(-1); 
            // // node(-1) lùi ra cha → tableCell
            // if (cellNode) {
            //     console.log(cellNode.attrs);
            // } 

            const state = editor.state;
            if (state.selection instanceof CellSelection) {
                // đang select nhiều ô
                // console.log('Đang chọn nhiều ô')
                setCanTable(false);
                // setShowTableToolBar(true);
            } else if (editor.isActive('tableCell')) {
                // đang ở trong 1 ô
                // console.log('Đang ở trong một ô')
                setCanTable(false);
                // setShowTableToolBar(true);
            } else {
                // setShowTableToolBar(false);
                // console.log('Không ở trong cell nào')
                setCanTable(true);
            }
            // setIsLink(editor.isActive("link"));
            // setCanLink(editor.can().toggleLink());
            // console.log("editor: ", editor.getAttributes('link'));

            editor.isActive('tableCell')
        };

        // editor.on("selectionUpdate", update);
        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
            // editor.off("selectionUpdate", (update));
        };
    }, [editor]);


    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={!canTable} className={`mr-1 ${canTable ? '' : 'opacity-50'}`}>
                <div className="my-auto"><CiViewTable className="my-auto w-6 h-6" /></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="center" >
                <DropdownMenuGroup className="flex">
                    <DropdownMenuItem>
                        <TableSizePicker
                            maxRows={10}
                            maxCols={10}
                            onSelect={(rows, cols) => {
                                console.log(`Bạn chọn bảng: ${rows} x ${cols}`);
                                // tạo bảng ở đây theo rows & cols
                                editor.commands.insertTable({ rows, cols, withHeaderRow: false })
                                console.log(editor.getAttributes('table'));
                            }}
                        />
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}