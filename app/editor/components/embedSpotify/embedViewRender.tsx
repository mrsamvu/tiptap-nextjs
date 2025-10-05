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
            <div contentEditable={false} className={`relative w-full h-[152px]`} onSelect={e => e.preventDefault()}>
                { !selected && isEditable && <div className='absolute z-20 w-full h-full hover:bg-gray-600/20'></div> }
                <iframe 
                    className={`rounded-2xl bg-black ${selected ? 'outline outline-2 outline-purple-600 outline-offset-[-2px]' : ''}`}
                    src={node.attrs.src}
                    width="100%" 
                    height="152px" 
                    style={{border:'none', overflow:'hidden'}}
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                >
                </iframe>
            </div>
        </NodeViewWrapper>
    )
}
