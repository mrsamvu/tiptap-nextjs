"use client";
import { Editor } from "@tiptap/react";
import { LuRedo2 } from "react-icons/lu";
import { useEffect, useState } from "react";

export default function RedoBtn({ editor }: { editor: Editor }) {
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const update = () => {
      setCanRedo(editor.can().redo());
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
      onClick={() => editor.chain().focus().redo().run()}
      disabled={!canRedo}
      className={`flex justify-center w-fit h-[30px] rounded disabled:opacity-50`}
    >
      <LuRedo2 className="my-auto w-5 h-5" />
    </button>
  );
}
