import { Dispatch, SetStateAction, useState } from "react"
import { PiX } from "react-icons/pi"

export default function EditCaptionOrAltPopup({
    setOpenEditCaptionOrAltPopup, updateAttributes, type, valueInit
}: {
    setOpenEditCaptionOrAltPopup: Dispatch<SetStateAction<boolean>>, updateAttributes: (attributes: Record<string, any>) => void, type: 'caption' | 'alt', valueInit: string
}) {
    const [value, setValue] = useState(valueInit);

    return <>
        <div className="top-0 left-0 bg-black w-full h-full z-[150] fixed bg-white-1 opacity-65" onClick={() => { setOpenEditCaptionOrAltPopup(false) }}/>
        <div className="bg-[#171717] fixed text-white-1 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit max-sm:rounded-none rounded z-[200]">
            <div className="w-[500px] max-w-[95dvw] h-fit p-2 flex flex-col gap-2">
                <div className="w-full h-fit flex justify-between">
                    <p className="text-sm text-white">Edit {type == 'caption' ? 'caption' : 'alt'}</p><PiX onClick={() => { setOpenEditCaptionOrAltPopup(false) }} className="cursor-pointer w-5 h-5 text-white"/>
                </div>
                <div className="w-full h-fit">
                    <div className="flex gap-2 w-full p-2.5 bg-[#151515] border-solid border-white/50 border-[1px] rounded mt-5">
                        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={`Type ${type == 'caption' ? 'caption' : 'alt text'} for this image`} className="w-full text-white text-sm bg-[#151515] outline-none"/>
                    </div>
                </div>
                <div className="w-full flex justify-end text-sm gap-2 mt-5">
                    <div className="text-white my-auto cursor-pointer" onClick={() => { setOpenEditCaptionOrAltPopup(false) }}>cancel</div><div className="px-2 py-0.5 rounded bg-white text-black cursor-pointer" onClick={() => { (type == 'caption' ? updateAttributes({title: value}) : updateAttributes({alt: value})); setOpenEditCaptionOrAltPopup(false) }}>Apply</div>
                </div>
            </div>
        </div>
    </>
}