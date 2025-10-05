"use client";
import { NodeViewWrapper, NodeViewProps, useEditor, NodeViewContent } from '@tiptap/react'
import React, { useCallback } from 'react';

export const EmbedViewRender = ({ node, editor, getPos, selected }: NodeViewProps) => {

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
    }, [selected]);

    return (
        <NodeViewWrapper
            onSelect={(e: { preventDefault: () => any; }) => e.preventDefault()}
            draggable={true}
            contentEditable={false}
        >
            <div contentEditable={false} className={`relative w-fit h-auto`} onSelect={e => e.preventDefault()}>
                { !selected && <div onClick={onWrapperClick} className='absolute z-20 w-full h-full hover:bg-gray-600/20'></div> }
                <div className={`w-fit h-auto ${selected ? 'outline outline-2 outline-purple-600 outline-offset-[-2px]' : ''}`}>
                    <a href="https://www.buymeacoffee.com/hung2811" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee nha haha&emoji=&slug=hung2811&button_colour=40DCA5&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"/></a>
                </div>
            </div>
        </NodeViewWrapper>
    )
}
