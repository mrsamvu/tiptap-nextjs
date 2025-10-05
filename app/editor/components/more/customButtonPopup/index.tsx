import { Editor } from "@tiptap/react";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { PiX } from "react-icons/pi";
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';
// import { TwitterPicker } from "react-color";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import './style.css';
import { validateUrl } from "../../link/validator";
// import Block from "@uiw/react-color-block";
import Colorful from "@uiw/react-color-colorful";
// import { convertSpotifyToEmbed } from "../../../embedSpotify/node";

export default function CustomButtonPopup({
    setOpenCustomButtonPopup, editor
}: {
    setOpenCustomButtonPopup: Dispatch<SetStateAction<boolean>>, editor: Editor
}) {
    const [url, setUrl] = useState("");
    const [text, setText] = useState("😍️ Donate me");
    const [urlIsValid, setUrlIsvalid] = useState(true);
    const [textIsValid, setTextIsvalid] = useState(true);
    const [colorText, setColorText] = useState({"h":0,"s":0,"v":100,"a":1});
    const [colorBtn, setColorBtn] = useState({"h":228.6,"s":60,"v":64,"a":1});

    const createBtnHandle = useCallback(() => {
        if (!text.trim().length) {
            setTextIsvalid(false);
            return;
        }

        if (!url.trim().length) {
            setUrlIsvalid(false);
            return;
        }

        const safeHref = validateUrl({ url });

        if (!safeHref) {
            setUrlIsvalid(false);
            return;
        }

        editor.commands.setButtonCustom({
            text,
            url,
            btnColor: hsvaToHex(colorBtn),
            textColor: hsvaToHex(colorText),
        });
        setOpenCustomButtonPopup(false);
    }, [url, text, colorText, colorBtn, editor]);

    return <>
        <div className="top-0 left-0 bg-black w-full h-full z-[150] fixed bg-white-1 opacity-65" onClick={() => { setOpenCustomButtonPopup(false) }}/>
        <div className="bg-[#171717] fixed text-white-1 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit h-fit max-sm:rounded-none rounded z-[200]">
            <div className="sm:w-[300px] max-sm:w-[90dvw] h-fit p-2 flex flex-col gap-5">
                <div className="w-full h-fit flex justify-between">
                    <p className="text-sm text-white">Button custom</p><PiX onClick={() => { setOpenCustomButtonPopup(false) }} className="cursor-pointer w-5 h-5 text-white"/>
                </div>
                <div className="w-full flex justify-center h-fit">
                    <p className={`font-semibold cursor-pointer p-2 w-fit max-w-full rounded-lg min-h-[40px] text-center text-white break-words whitespace-normal`} style={{backgroundColor: `${hsvaToHex(colorBtn)}`, color: `${hsvaToHex(colorText)}`}}>
                        {text}
                    </p>
                </div>
                <div className="px-2 py-1 bg-[#212121] rounded">
                    <input value={text} onChange={(value) => { setTextIsvalid(true); setText(value.target.value) }} type="text" className="text-white text-sm w-full outline-none bg-[#212121]" placeholder="Button text"/>
                </div>
                { !textIsValid && <p className="text-xs text-red-500 pl-2 -my-3">Require!</p> }
                <div className="px-2 py-1 bg-[#212121] rounded">
                    <input value={url} onChange={(value) => { setUrlIsvalid(true); setUrl(value.target.value) }} type="text" className="text-white text-sm w-full outline-none bg-[#212121]" placeholder="Button link"/>
                </div>
                { !urlIsValid && <p className="text-xs text-red-500 pl-2 -my-3">Link invalid!</p> }
                <Tabs defaultValue="colortext" className="tablist">
                    <TabsList className="!bg-none">
                        <TabsTrigger value="colortext">Text</TabsTrigger>
                        <TabsTrigger value="colorbtn">Background</TabsTrigger>
                    </TabsList>
                    <TabsContent value="colortext">
                        <Colorful
                            disableAlpha={true}
                            color={colorText}
                            onChange={(color) => {
                                setColorText(color.hsva);
                            }}
                        />
                        {/* <Block
                            colors={["#FFFFFF", "#FFFFFF", "#000000", "#F78DA7", "#F47373", "#FAD0C3", "#FCE77D", "#37D67A", "#2CCCE4", "#555555", "#DCE775", "#FF8A65", "#BA68C8"]}
                            color={colorText}
                            showTriangle={false}
                            onChange={(color) => setColorText(color.hex)}
                        /> */}
                    </TabsContent>
                    <TabsContent value="colorbtn">
                        <Colorful
                            disableAlpha={true}
                            color={colorBtn}
                            onChange={(color) => {
                                setColorBtn(color.hsva);
                            }}
                        />
                        {/* <Block
                            colors={["#FFFFFF", "#FFFFFF", "#000000", "#F78DA7", "#F47373", "#FAD0C3", "#FCE77D", "#37D67A", "#2CCCE4", "#555555", "#DCE775", "#FF8A65", "#BA68C8"]}
                            color={colorBtn}
                            showTriangle={false}
                            onChange={(color) => setColorBtn(color.hex)}
                        /> */}
                    </TabsContent>
                </Tabs>
                <div className="w-full flex justify-end text-sm gap-2 mt-2">
                    <div className="text-white my-auto cursor-pointer" onClick={() => { setOpenCustomButtonPopup(false) }}>cancel</div><div className="px-2 py-0.5 rounded bg-white text-black cursor-pointer" onClick={() => createBtnHandle()}>Create button</div>
                </div>
            </div>
        </div>
    </>
}