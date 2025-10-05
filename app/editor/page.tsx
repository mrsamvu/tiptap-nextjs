"use client";

import { CommandProps, Editor as EditorTiptap, EditorContent, ReactNodeViewRenderer, useEditor, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import './style.css';
import { Image } from '@tiptap/extension-image';
import { isMobile, isBrowser } from 'react-device-detect';
import { createCodeBlockHighlightPlugin } from "./components/codeBlockShiki/plugin";
import { CodeBlockShikiNode } from "./components/codeBlockShiki/node";
import Heading from "@tiptap/extension-heading";
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import PullquoteNode from "./components/quote/pullQuoteNode";
import BlockQuote from '@tiptap/extension-blockquote';
import DragHandle from '@tiptap/extension-drag-handle-react';
import { MdOutlineDragIndicator } from "react-icons/md";
import { DividerNode } from "./components/divider/node";
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { Table, TableKit } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TaleToolBar from "./components/tableToolBar/btn";
import { cellAround, isInTable } from "@tiptap/pm/tables";
import { BubbleMenu } from "@tiptap/react/menus";
import { CgToolbarLeft } from "react-icons/cg";
import ImageBtn from "./components/image/btn";
import ImageNodeView from "./components/image/imageNodeView";
import { YouTube } from "./components/embedYoutube/node";
import { Vimeo } from "./components/embedVimeo/node";
import { Spotify } from "./components/embedSpotify/node";
import { SoundCloud } from "./components/embedSoundCloud/node";

import ButtonCustomNode from "./components/BtnCustom/node";
import { validateUrl } from "./components/link/validator";
import { supabase } from "../services/supabase";
import { NodeSelection, Plugin } from 'prosemirror-state';
import ThemeToggle from "@/components/themeMode";
import EmbedBtn from "./components/embed/btn";
import MoreBtn from "./components/more/btn";
import TextAlignBtn from "./components/textAlign/btn";
import QuoteBtn from "./components/quote/btn";
import ListBtn from "./components/list/btn";
import HeadingBtn from "./components/heading/btn";
import CodeBlockShikiBtn from "./components/codeBlockShiki/btn";
import TableBtn from "./components/table/btn";
import LinkBtn from "./components/link/btn";
import HighlightBtn from "./components/highlight/btn";
import UnderlineBtn from "./components/underline/btn";
import StrikeBtn from "./components/strike/btn";
import ItalicBtn from "./components/italic/btn";
import BoldBtn from "./components/bold/btn";
import RedoBtn from "./components/redo/btn";
import UndoBtn from "./components/undo/btn";
import { MoveNode } from "./components/moveNode/node";
import { BsArrowBarDown, BsArrowBarUp } from "react-icons/bs";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { KeepHeadingOnEnterExtension } from "./components/heading/extensions/keepHeadingOnEnter";
import { ImageNode } from "./components/image/node";
import { TableNode } from "./components/table/tableNode";
import { TableKitNode } from "./components/table/tableKitNode";
import { TableCellNode } from "./components/table/tableCellNode";
import { HeadingNode } from "./components/heading/headingNode";
import { BulletListNode } from "./components/list/bulletListNode";
import { OrderedListNode } from "./components/list/orderedListNode";
import { TaskItemListNode } from "./components/list/taskItemList";
import { BlockQuoteNode } from "./components/quote/blockQuoteNode";
import { TextAlignNode } from "./components/textAlign/textAlignNode";
import { HighlightNode } from "./components/highlight/highlightNode";
import { LinkNode } from "./components/link/linkNode";
import { StarterKitNode } from "./components/startKit/starterKitNode";



export default function Editor() {
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const editorRef = useRef(null);
    const [showTableToolBarMobile, setShowTableToolBarMobile] = useState(false);
    const router = useRouter();

    const editor = useEditor({
        extensions: [
            MoveNode,
            KeepHeadingOnEnterExtension,
            // TestNode,
            YouTube,
            Vimeo,
            Spotify,
            SoundCloud,
            // Gist,
            ButtonCustomNode,
            ImageNode,
            TableNode,
            TableKitNode,
            TableCellNode,
            StarterKitNode,
            CodeBlockShikiNode,
            HeadingNode,
            BulletListNode,
            OrderedListNode,
            TaskList,
            TaskItemListNode,
            PullquoteNode,
            BlockQuoteNode,
            TextAlignNode,
            DividerNode,
            HighlightNode,
            LinkNode
        ],
        onCreate: async () => {
            // register plugin sau khi editor ready
            editor!.registerPlugin(await createCodeBlockHighlightPlugin())
            
        },
        editorProps: {
            scrollThreshold: 120,
            scrollMargin: 120,
            handlePaste(view, event, node) {
                // test handle paste global
                return false;
            }
        },
        content: "",
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        autofocus: true,
    });

    useEffect(() => {
        if (!editor) return;

        const updatePlaceholder = () => {
            setShowPlaceholder(editor.isEmpty);
        };

        // Gọi lần đầu
        updatePlaceholder();

        // Lắng nghe content thay đổi
        editor.on('update', updatePlaceholder);

        // Cleanup
        return () => {
            editor.off('update', updatePlaceholder);
        };
    }, [editor]);

    if (!editor) {
        return null;
    }

    editor.on('contentError', ({ editor, error, disableCollaboration }) => {
        // Your error handling logic here
        console.log("contentError: ", error);
    })

    const handleSave = async () => {
        if (!editor) return;

        const json = editor.getJSON();
        // console.log("Tiptap JSON:", json);

        const { data, error } = await supabase
            .from("documents")
            .upsert(
                { id: 1, content: json },   // nếu id=2 đã tồn tại → update content, nếu chưa có → insert
                { onConflict: "id" }        // quan trọng: dùng cột id để quyết định update hay insert
            )
            .select();

        if (error) {
            console.error("Upsert error:", error);
        } else {
            console.log("Upsert success:", data);
        }

        if (error) {
            console.error("Insert error:", error.message);
            toast("Save error!", {
                position: 'top-center',
                duration: 5000
            })
        } else {
            console.log("Lưu thành công:", data);
            toast("Save success!", {
                position: 'top-center',
                duration: 5000,
                // description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "View",
                    onClick: () => router.push('/posts'),
                },
            })
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center w-full">
            <div contentEditable={false} className="mx-auto w-full flex py-2 px-2 flex-wrap text-nowrap gap-[10px] border-b-solid border-b-[0.5px]">
                {/* <div onClick={() => {editor.chain().focus().myCommand().run()}} className="my-auto">demo</div> */}
                <div className="flex-1 max-md:hidden"></div>
                <UndoBtn editor={editor}/>
                <RedoBtn editor={editor}/>
                <BoldBtn editor={editor}/>
                <ItalicBtn editor={editor}/>
                <StrikeBtn editor={editor}/>
                <UnderlineBtn editor={editor}/>
                <HighlightBtn editor={editor}/>
                <LinkBtn editor={editor}/>
                <TableBtn editor={editor}/>
                <ImageBtn editor={editor}/>
                <CodeBlockShikiBtn editor={editor}/>
                <HeadingBtn editor={editor}/>
                <ListBtn editor={editor}/>
                <QuoteBtn editor={editor}/>
                <TextAlignBtn editor={editor}/>
                <MoreBtn editor={editor}/>
                <EmbedBtn editor={editor}/>
                <ThemeToggle/>
                <button onClick={() => handleSave()} className="text-sm dark:border-white border-black px-2 py-0.5 border rounded hover:dark:bg-white hover:bg-black hover:dark:text-black hover:text-white">Save</button>
                <div className="flex-1 max-md:hidden"></div>
            </div>
            <TaleToolBar editor={editor} showTableToolBarMobile={showTableToolBarMobile} setShowTableToolBarMobile={setShowTableToolBarMobile}/>
               
            {
                isBrowser &&
                    <DragHandle 
                        editor={editor} 
                        className="h-full cursor-grab transition-all"
                    >
                        <MdOutlineDragIndicator className="text-white/65 w-auto h-6"/>
                    </DragHandle>
            }
            
            <BubbleMenu
                editor={editor}
                shouldShow={({ editor, state, view, from, to }) => {
                    return editor.isActive('tableCell');
                }}
            >
                <div className="sm:!hidden flex gap-2 shadow rounded bg-[#151515] border-[1px] border-white/10 border-solid">
                    <button
                        onClick={() => setShowTableToolBarMobile(pre => !pre)}
                        className="px-2 py-1 bg-[#151515] rounded"
                    >
                        <CgToolbarLeft className="my-auto w-6 h-6"/>
                    </button>
                </div>
            </BubbleMenu>
            { isMobile && 
                <BubbleMenu
                    editor={editor}
                    shouldShow={({ editor, state }) => {
                        const { selection } = state
                        const { $from } = selection
                        
                        // Kiểm tra editor có thể edit không
                        if (!editor.isEditable) return false
                        
                        // Hiện khi có NodeSelection (atom nodes như Image)
                        if (selection instanceof NodeSelection) {
                            return true
                        }
                        
                        // Hiện khi cursor đang trong một block node (paragraph, heading, etc.)
                        // và không phải đang select text
                        // if (selection.empty && $from.parent.type.isBlock) {
                        if ($from.parent.type.isBlock) {
                            return true
                        }
                        
                        return false;
                    }}
                    options={{
                        placement: "bottom"
                    }}
                >
                    <div className="flex gap-2 shadow rounded bg-[#151515] border-[1px] border-white/10 border-solid">
                        <button
                            onClick={() => editor.commands.moveNodeDown()}
                            className="px-2 py-1 bg-[#151515] rounded"
                        >
                            <BsArrowBarDown className="my-auto w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => editor.commands.moveNodeUp()}
                            className="px-2 py-1 bg-[#151515] rounded"
                        >
                            <BsArrowBarUp className="my-auto w-5 h-5"/>
                        </button>
                    </div>
                </BubbleMenu>
            }
            <EditorContent
                ref={editorRef}
                spellCheck={false} 
                // onClick={() => editor.chain().focus()} 
                editor={editor} 
                className={`relative mt-[25px] pb-[50dvh] w-[700px] max-w-[95dvw] overflow-y-auto max-sm:max-w-[95dvw] ${isMobile ? '' : 'max-md:pl-3'} mx-auto flex-1 focus:outline-none`}
            >
                {
                    showPlaceholder && (
                        <div className="absolute top-0 text-gray-400 pointer-events-none select-none">
                            Write something...
                        </div>)
                }
            </EditorContent>
        </div>
    );
};
