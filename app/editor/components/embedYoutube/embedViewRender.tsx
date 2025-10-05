import { NodeViewWrapper, NodeViewProps, useEditor, NodeViewContent } from '@tiptap/react'
import React, { useState, useEffect, useCallback } from 'react'

export const EmbedViewRender = ({ node, editor, getPos, selected }: NodeViewProps) => {
    const { isEditable } = editor;

    return (
        <NodeViewWrapper
            onSelect={(e: { preventDefault: () => any; }) => e.preventDefault()}
            draggable={true}
            contentEditable={false}
        >
            <div contentEditable={false} className={`relative w-full pb-[56.25%] h-0`} onSelect={e => e.preventDefault()}>
                { !selected && isEditable && <div className='absolute z-20 w-full h-full hover:bg-gray-600/20'></div> }
                <iframe
                    src={node.attrs.src}
                    className={`absolute z-10 top-0 left-0 w-full h-full ${selected ? 'outline outline-2 outline-purple-600 outline-offset-[-2px]' : ''}`}
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        </NodeViewWrapper>
    )
}
