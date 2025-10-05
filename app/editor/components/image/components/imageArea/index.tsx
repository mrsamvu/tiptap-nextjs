"use client";

import { supabase } from "@/app/services/supabase";
import { Editor } from "@tiptap/react";
import { useState, DragEvent, ChangeEvent, useEffect, useRef, useCallback, SetStateAction, Dispatch } from "react";
import { LuCloudUpload, LuLink } from "react-icons/lu";
import { PiTrash } from "react-icons/pi";


export default function UploadArea({ editor, setOpenPopup }: { editor: Editor, setOpenPopup: Dispatch<SetStateAction<boolean>> }) {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    // const [uploadedUrl, setUploadedUrl] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Hủy timeout trước đó
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        // Đặt timeout mới
        typingTimeoutRef.current = setTimeout(() => {
            setImageUrl(value);
        }, 500); // 500ms sau mới update state
    };

    const replaceOrInsertImage = useCallback((newSrc: string) => {
        const { state } = editor;
        const { selection } = state;
        const node = state.doc.nodeAt(selection.from);

        // Nếu đang chọn 1 ảnh
        if (node?.type?.name === 'image') {
            const currentSrc = node.attrs.src;

            // Nếu src trùng → bỏ qua, không update
            if (currentSrc === newSrc) {
                setOpenPopup(false);
                return;
            }

            // Ngược lại → update src
            editor.chain().focus().updateAttributes('image', { src: newSrc }).run();
        } else {
            // Nếu không phải ảnh → chèn ảnh mới
            editor.chain().focus().setImage({ src: newSrc }).run();
        }
        setOpenPopup(false);
    }, [editor]);


    const handleUpload = useCallback(async () => {
        if (file) {

            setIsUploading(true);
            const fileName = file.name;
            const { data, error } = await supabase.storage
                .from("uploads") // tên bucket
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: true,
                });

                if (error) {
                    console.error(error);
                    alert("Upload lỗi: " + error.message);
                    return;
                }

                // Lấy URL public
                const { data: publicUrl } = supabase.storage
                    .from("uploads")
                    .getPublicUrl(fileName);
                console.log("ok upload: ", publicUrl);
                // editor.chain().focus().setImage({ src: publicUrl.publicUrl }).run();
                // setOpenPopup(false);
                replaceOrInsertImage(publicUrl.publicUrl)
            // const formData = new FormData();
            // formData.append("file", file);

            // const res = await fetch("/api/upload", {
            //     method: "POST",
            //     body: formData,
            // });

            // const data = await res.json();
            // setIsUploading(false);

            // if (res.ok) {
            //     // setUploadedUrl(data.url);
            //     editor.chain().focus().setImage({ src: data.url }).run();
            //     setOpenPopup(false);
                
            // } else {
            //     alert("Upload failed");
            // }
        } else if (imageUrl) {
            // editor.chain().focus().setImage({ src: imageUrl }).run();
            replaceOrInsertImage(imageUrl)
            
        }
    }, [file, imageUrl]);

    useEffect(() => {
        console.log("imageUrl: ", imageUrl);
    }, [imageUrl]);

    const handleFile = (selectedFiles: FileList | null) => {
        if (!selectedFiles || selectedFiles.length === 0) return;
        const f = selectedFiles[0];
        // Giới hạn 5MB
        if (f.size <= 5 * 1024 * 1024) {
            setFile(f);
        } else {
            alert("File is too large. Maximum size is 5MB.");
        }
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        handleFile(e.dataTransfer.files);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        handleFile(e.target.files);
    };

    return (
        <>
            { 
                !file ? 
                    <div className="flex flex-col justify-center w-full">
                        {
                            !imageUrl.trim().length ? <div
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                className={`flex flex-col items-center justify-center border-2 border-dashed border-white/50 rounded p-6 cursor-pointer transition ${isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300"}`}
                                style={{ minHeight: "200px" }}
                            >
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp, image/svg+xml"
                                    className="hidden"
                                    id="fileInput"
                                    onChange={onChange}
                                />

                                <label
                                    htmlFor="fileInput"
                                    className="flex flex-col items-center gap-2 text-center"
                                >
                                    <LuCloudUpload className="w-10 h-10 text-purple-500" />
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold text-purple-600">Click to upload</span>{" "}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-400">Maximum 1 file, 5MB.</p>
                                </label>
                            </div>
                            :
                            <img
                                src={imageUrl}
                                className="object-cover w-full max-h-[50dvh] mx-auto"
                            />
                        }
                        <div className="flex gap-2 w-full p-2.5 bg-[#151515] border-solid border-white/50 border-[1px] rounded mt-5">
                            <LuLink className="w-5 h-5 my-auto text-white"/> <input onChange={handleChange} placeholder="Type or paste image URL" className="w-full text-sm bg-[#151515] outline-none"/>
                        </div>
                    </div>
                    :
                    <div className="relative w-fit mx-auto h-fit flex">
                        <div className="absolute top-1 right-1 p-2 cursor-pointer border-solid rounded-md bg-[#171717]"><PiTrash onClick={() => setFile(null)} className="w-6 h-6 text-white"/></div>
                        <img
                            src={URL.createObjectURL(file) || imageUrl}
                            alt={file.name}
                            className="object-cover w-full max-h-[50dvh]"
                        />
                    </div>
            }
            <div className="w-full flex justify-end text-sm gap-2 mt-5">
                <div className="text-white my-auto cursor-pointer" onClick={() => { setOpenPopup(false) }}>cancel</div><div className="px-2 py-0.5 rounded bg-white text-black cursor-pointer" onClick={() => handleUpload()}>Add image</div>
            </div>
        </>
    );
}
