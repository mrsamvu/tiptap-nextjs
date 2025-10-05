"use client";
import React, { useState, useRef, useEffect } from "react";

export default function ImageResizable() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [originalRatio, setOriginalRatio] = useState<number>(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // y=0 vì container sẽ cao đúng ảnh

  const resizing = useRef<{
    active: boolean;
    side: "left" | "right" | null;
    startX: number;
    startWidth: number;
  }>({ active: false, side: null, startX: 0, startWidth: 0 });

  const imgSrc = "/uploads/Screenshot from 2025-09-25 13-07-14.png";

  const handleImageLoad = (img: HTMLImageElement) => {
    const realW = img.naturalWidth;
    const realH = img.naturalHeight;
    if (realW === 0 || realH === 0) return;

    setOriginalRatio(realH / realW);

    const cw = window.innerWidth; // container cha ban đầu = full width màn hình
    const initWidth = realW > cw ? cw : realW;
    const initHeight = initWidth * (realH / realW);
    const initX = (cw - initWidth) / 2;

    setSize({ width: initWidth, height: initHeight });
    setPos({ x: initX, y: 0 });
    resizing.current.startWidth = initWidth;
  };

  useEffect(() => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => handleImageLoad(img);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizing.current.active || !size) return;

      const containerWidth = window.innerWidth; // vì container full width
      const deltaX = e.clientX - resizing.current.startX;

      let newWidth =
        resizing.current.side === "right"
          ? resizing.current.startWidth + deltaX * 2
          : resizing.current.startWidth - deltaX * 2;

      if (newWidth < 50) newWidth = 50;

      let newHeight = newWidth * originalRatio;
      const newY = 0;

      let newX = (containerWidth - newWidth) / 2;

      // Bound theo container
      if (newX < 0) newX = 0;
      if (newX + newWidth > containerWidth) {
        newWidth = containerWidth;
        newHeight = newWidth * originalRatio;
        newX = 0;
      }

      setSize({ width: newWidth, height: newHeight });
      setPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      resizing.current.active = false;
      resizing.current.side = null;
      if (size) resizing.current.startWidth = size.width;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [pos, size, originalRatio]);

  const startResize = (side: "left" | "right", e: React.MouseEvent) => {
    e.preventDefault();
    if (!size) return;
    resizing.current.active = true;
    resizing.current.side = side;
    resizing.current.startX = e.clientX;
    resizing.current.startWidth = size.width;
  };

  return (
    <div
      ref={containerRef}
      // Container cao đúng bằng ảnh (nếu có size)
      style={{
        width: "100%",
        height: size ? size.height : "auto",
        background: "#e2e8f0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {size && (
        <div
          style={{
            position: "absolute",
            left: Math.round(pos.x),
            top: Math.round(pos.y),
            width: size.width,
            height: size.height,
            boxSizing: "border-box",
            userSelect: "none",
          }}
        >
          <img
            src={imgSrc}
            alt="demo"
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              // objectFit: "contain",
              display: "block",
              pointerEvents: "none",
              border: "2px solid #3b82f6",
              borderRadius: "6px",
            }}
          />
          {/* Handle trái */}
          <div
            onMouseDown={(e) => startResize("left", e)}
            style={{
              position: "absolute",
              left: -4,
              top: 0,
              width: 8,
              height: "100%",
              background: "rgba(255,255,255,0.35)",
              cursor: "ew-resize",
            }}
          />
          {/* Handle phải */}
          <div
            onMouseDown={(e) => startResize("right", e)}
            style={{
              position: "absolute",
              right: -4,
              top: 0,
              width: 8,
              height: "100%",
              background: "rgba(255,255,255,0.35)",
              cursor: "ew-resize",
            }}
          />
        </div>
      )}
    </div>
  );
}
