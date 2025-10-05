"use client";

import React, { useState, useRef, useEffect } from "react";
import { NodeViewWrapper, NodeViewProps, NodeViewContent } from "@tiptap/react";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditCaptionOrAltPopup from "./components/editCaptionOrAltPopup";

export default function ImageNodeView({
  node,
  updateAttributes,
  selected,
  deleteNode,
  editor,
}: NodeViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [openEditCaptionOrAltPopup, setOpenEditCaptionOrAltPopup] = useState(false);
  const [typePopup, setTypePopup] = useState<"caption" | "alt">("caption");

  const [widthPercent, setWidthPercent] = useState<number | null>(null);
  const [originalRatio, setOriginalRatio] = useState<number>(1);

  const resizing = useRef<{
    active: boolean;
    side: "left" | "right" | null;
    startX: number;
    startPercent: number;
  }>({ active: false, side: null, startX: 0, startPercent: 100 });

  const imgSrc = node.attrs.src;
  const caption = node.attrs.title;
  const alt = node.attrs.alt;

  const { isEditable } = editor;

  // Load ảnh thật để lấy kích thước ban đầu
  const handleImageLoad = (img: HTMLImageElement) => {
    const realW = img.naturalWidth;
    const realH = img.naturalHeight;
    if (realW === 0 || realH === 0) return;

    setOriginalRatio(realH / realW);
    if (!isEditable) {
      setWidthPercent(node.attrs.widthPercent);
      return;
    };

    const cw = containerRef.current?.offsetWidth ?? window.innerWidth;
    let initPercent = (realW / cw) * 100;
    if (initPercent > 100) initPercent = 100;

    setWidthPercent(initPercent);
    resizing.current.startPercent = initPercent;

    updateAttributes({ widthPercent: initPercent }); // lưu lại %
  };

  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => handleImageLoad(img);
  }, [imgSrc]);

  // Resize theo %
  useEffect(() => {
    if (!isEditable) return;
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing.current.active || widthPercent === null) return;

      const cw = containerRef.current?.offsetWidth ?? window.innerWidth;
      const deltaX = e.clientX - resizing.current.startX;

      const deltaPercent = (deltaX / cw) * 100;
      let newPercent =
        resizing.current.side === "right"
          ? resizing.current.startPercent + deltaPercent * 2
          : resizing.current.startPercent - deltaPercent * 2;

      if (newPercent < 5) newPercent = 5;
      if (newPercent > 100) newPercent = 100;

      setWidthPercent(newPercent);
      updateAttributes({ widthPercent: newPercent });
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!resizing.current.active || widthPercent === null) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;

      const cw = containerRef.current?.offsetWidth ?? window.innerWidth;
      const deltaX = clientX - resizing.current.startX;

      let newPercent =
        resizing.current.side === "right"
          ? resizing.current.startPercent + (deltaX / cw) * 100
          : resizing.current.startPercent - (deltaX / cw) * 100;

      if (newPercent < 5) newPercent = 5;
      if (newPercent > 100) newPercent = 100;

      setWidthPercent(newPercent);
      updateAttributes({ widthPercent: newPercent });
    };

    const handleMouseUp = () => {
      resizing.current.active = false;
      resizing.current.side = null;
      if (widthPercent !== null) resizing.current.startPercent = widthPercent;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [widthPercent]);

  const startResize = (side: "left" | "right", e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (widthPercent === null) return;

    // lấy clientX cho cả mouse và touch
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;

    resizing.current.active = true;
    resizing.current.side = side;
    resizing.current.startX = clientX;
    resizing.current.startPercent = widthPercent;
  };


  return (
    <NodeViewWrapper
      data-type="moveableBlock"
      draggable={false}
      onDragStart={(e: { preventDefault: () => any; }) => e.preventDefault()}
      contentEditable={false}
      ref={containerRef}
      className="flex flex-col gap-2 w-full relative overflow-hidden justify-center"
    >
      {widthPercent && (
        <>
          <div
            className="mx-auto relative"
            style={{
              width: `${widthPercent}%`,
              aspectRatio: `${1 / originalRatio}`, // giữ tỉ lệ
            }}
          >
            <img
              src={imgSrc}
              alt={alt || "image"}
              draggable={false}
              className={`w-full h-full object-contain block pointer-events-none ${
                selected && isEditable
                  ? "outline outline-[3px] outline-purple-600 outline-offset-[-3px]"
                  : ""
              } rounded-md`}
            />

            {/* Handle trái */}
            {isEditable && (
              <div
                onMouseDown={(e) => startResize("left", e)}
                onTouchStart={(e) => startResize("left", e)}
                className={`absolute left-0 top-0 w-2 h-full cursor-ew-resize ${
                  selected ? "bg-blue-500" : ""
                }`}
              />
            )}

            {/* Handle phải */}
            {isEditable && (
              <div
                onMouseDown={(e) => startResize("right", e)}
                onTouchStart={(e) => startResize("right", e)}
                className={`absolute right-0 top-0 w-2 h-full cursor-ew-resize ${
                  selected ? "bg-blue-500" : ""
                }`}
              />
            )}

            {/* Menu */}
            {selected && isEditable && (
              <div className="absolute top-2 right-2 rounded cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="bg-[#171717] p-2 rounded-md">
                    <p className="h-full flex">
                      <HiDotsHorizontal className="w-5 h-5 text-white" />
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          setTypePopup("caption");
                          setOpenEditCaptionOrAltPopup(true);
                        }}
                      >
                        <p className="text-sm">Edit caption</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setTypePopup("alt");
                          setOpenEditCaptionOrAltPopup(true);
                        }}
                      >
                        <p className="text-sm">Edit alt text</p>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteNode()}>
                        <p className="text-red-500 text-sm">Delete image</p>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {caption && caption.length > 0 && (
            <p className="mx-auto text-sm w-full text-center cursor-pointer">{caption}</p>
          )}
        </>
      )}

      <NodeViewContent />

      {openEditCaptionOrAltPopup && isEditable && (
        <EditCaptionOrAltPopup
          valueInit={typePopup === "caption" ? caption : alt}
          setOpenEditCaptionOrAltPopup={setOpenEditCaptionOrAltPopup}
          updateAttributes={updateAttributes}
          type={typePopup}
        />
      )}
    </NodeViewWrapper>
  );
}
