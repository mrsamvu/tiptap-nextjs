"use client";
import React, { useEffect, useRef } from "react";

export default function GistEmbed({ gistId, file }: { gistId: string; file?: string }) {
  const gistContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gistContainerRef.current) return;

    // clear trước khi chèn script
    gistContainerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = `https://gist.github.com/hung-vu281199/48245ce3a29858f28ddca9f5107d3852`;
    script.async = true;

    gistContainerRef.current.appendChild(script);
  }, [gistId, file]);

  return <div ref={gistContainerRef}></div>;
}
