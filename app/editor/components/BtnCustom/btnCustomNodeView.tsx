"use client";

import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { useCallback } from "react";

export default function BtnCustomNodeView({ node, editor, getPos, selected }: NodeViewProps) {
    const { text, url, btnColor, textColor } = node.attrs;
    const isEditable = editor.isEditable;

    // Khi click wrapper: chọn node
    const onWrapperClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if (!selected) {
            const pos = getPos()
            if (pos != undefined) {
                editor.chain().setNodeSelection(pos).run()
            }
        }
    }, [selected, editor]);

    return (
        <NodeViewWrapper contentEditable={false} as="div" className="w-full h-fit flex justify-center relative">
            { !selected && isEditable && <div onClick={onWrapperClick} className='absolute z-20 w-full h-full hover:bg-gray-600/20'></div> }
            <a
                contentEditable={false}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 w-fit max-w-full cursor-pointer rounded-lg min-h-[40px] text-center break-words whitespace-normal ${selected ? 'outline outline-2 outline-purple-600 outline-offset-[-2px]' : ''}`}
                style={{
                    backgroundColor: btnColor,
                    color: textColor,
                    textDecoration: "none",
                }}
            >
                {text}
            </a>
        </NodeViewWrapper>
    );
}
