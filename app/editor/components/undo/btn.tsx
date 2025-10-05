"use client";
import { Editor } from "@tiptap/react";
import { LuUndo2 } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function UndoBtn({ editor }: { editor: Editor }) {
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCanUndo(editor.can().undo());
    };

    // gọi ban đầu
    update();

    editor.on("transaction", update); // mỗi khi doc thay đổi → update state

    return () => {
      editor.off("transaction", update);
    };
  }, [editor]);

  return (
    <button
      onClick={() => editor.chain().focus().undo().run()}
      disabled={!canUndo}
      className={`flex justify-center w-fit h-[30px] rounded disabled:opacity-50`}
    >
      <LuUndo2 className="my-auto w-5 h-5" />
    </button>
  );
}
