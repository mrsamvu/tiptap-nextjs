import { Editor } from "@tiptap/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { PiX } from "react-icons/pi";
import { extractVimeoId } from "../../../embedVimeo/node";

export default function EmbedVimeoPopup({
    setOpenVimeoPopup, editor
}: {
    setOpenVimeoPopup: Dispatch<SetStateAction<boolean>>, editor: Editor
}) {
    const [url, setUrl] = useState("");
    const [urlIsValid, setIsvalid] = useState(true);

    const embedHandle = useCallback(() => {
        if (!url.includes('vimeo.com')) {
            setIsvalid(false);
            return;
        }
        const videoId = extractVimeoId(url)
        if (!videoId) {
            setIsvalid(false);
            return;
        }

        const embedUrl = `https://player.vimeo.com/video/${videoId}`

        // Node insertVimeo bạn tự định nghĩa
        editor.chain().focus().insertVimeo({ src: embedUrl }).run();
        setOpenVimeoPopup(false);
    }, [url, editor]);

    return <>
        <div className="top-0 left-0 bg-black w-full h-full z-[150] fixed bg-white-1 opacity-65" onClick={() => { setOpenVimeoPopup(false) }}/>
        <div className="bg-[#171717] fixed text-white-1 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit max-sm:rounded-none rounded z-[200]">
            <div className="w-[350px] max-sm:w-[95dvw] h-fit p-2 flex flex-col gap-2">
                <div className="w-full h-fit flex justify-between">
                    <p className="text-sm text-white">Embed Vimeo</p><PiX onClick={() => { setOpenVimeoPopup(false) }} className="cursor-pointer w-5 h-5 text-white"/>
                </div>
                <div className="px-2 py-1 bg-[#212121] rounded">
                    <input value={url} onChange={(value) => { setIsvalid(true); setUrl(value.target.value) }} type="text" className="text-sm w-full outline-none bg-[#212121]" placeholder="Video link"/>
                </div>
                { !urlIsValid && <p className="text-xs text-red-500 pl-2">Link invalid!</p> }
                <div className="w-full flex justify-end text-sm gap-2 mt-2">
                    <div className="text-white my-auto cursor-pointer" onClick={() => { setOpenVimeoPopup(false) }}>cancel</div><div className="px-2 py-0.5 rounded bg-white text-black cursor-pointer" onClick={() => embedHandle()}>Embed</div>
                </div>
            </div>
        </div>
    </>
}