"use client";
import './css';
import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { supabase } from "../services/supabase";
import { YouTube } from "../editor/components/embedYoutube/node";
import { Vimeo } from "../editor/components/embedVimeo/node";
import { Spotify } from "../editor/components/embedSpotify/node";
import { SoundCloud } from "../editor/components/embedSoundCloud/node";
import ButtonCustomNode from "../editor/components/BtnCustom/node";
import { CodeBlockShikiNode } from "../editor/components/codeBlockShiki/node";
import TaskList from '@tiptap/extension-task-list';
import PullquoteNode from "../editor/components/quote/pullQuoteNode";
import { DividerNode } from "../editor/components/divider/node";
import ThemeToggle from '@/components/themeMode';
import { ImageNode } from '../editor/components/image/node';
import { TableNode } from '../editor/components/table/tableNode';
import { TableCellNode } from '../editor/components/table/tableCellNode';
import { BulletListNode } from '../editor/components/list/bulletListNode';
import { OrderedListNode } from '../editor/components/list/orderedListNode';
import { TableKitNode } from '../editor/components/table/tableKitNode';
import { HeadingNode } from '../editor/components/heading/headingNode';
import { TaskItemListNode } from '../editor/components/list/taskItemList';
import { BlockQuoteNode } from '../editor/components/quote/blockQuoteNode';
import { TextAlignNode } from '../editor/components/textAlign/textAlignNode';
import { HighlightNode } from '../editor/components/highlight/highlightNode';
import { LinkNode } from '../editor/components/link/linkNode';
import { StarterKitNode } from '../editor/components/startKit/starterKitNode';


export default function Viewer() {
  const [doc, setDoc] = useState(null);

  // Fetch từ Supabase
  useEffect(() => {
    const fetchDoc = async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("content")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Fetch error:", error.message);
      } else {
        setDoc(data.content); // content chính là JSON đã lưu
        console.log("Fetched JSON:", data.content);
      }
    };

    fetchDoc();
  }, []);

    // Tạo editor readonly
    const editor = useEditor({
        extensions: [
            YouTube,
            Vimeo,
            Spotify,
            SoundCloud,
            ButtonCustomNode,
            ImageNode,
            TableNode,
            TableCellNode,
            TableKitNode,
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
            // Underline,
            HighlightNode,
            LinkNode
        ],
        editable: false,
        immediatelyRender: false
    });

  // Khi doc thay đổi thì set lại content
  useEffect(() => {
    if (editor && doc) {
        queueMicrotask(() => {
            editor.commands.setContent(doc)
        })
    }
  }, [editor, doc]);

  return <>
    <div className="h-screen flex flex-col justify-center w-full">
        <div className='p-1 w-fit h-fit mx-auto'><ThemeToggle/></div>
        <EditorContent editor={editor} className="mt-5 w-[700px] max-w-[95dvw] overflow-y-auto max-sm:max-w-[95dvw] mx-auto flex-1 focus:outline-none" />
    </div>
  </>
}
