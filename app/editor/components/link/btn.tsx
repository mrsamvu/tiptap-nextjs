"use client";
import { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { LegacyRef, useCallback, useEffect, useRef, useState } from "react";
import { PiLink, PiX } from "react-icons/pi";
import { sanitizeUrl } from 'strict-url-sanitise';
import { validateUrl } from "./validator";

export default function LinkBtn({ editor }: { editor: Editor }) {
    const [canLink, setCanLink] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");
    const [invalidText, setInvalidText] = useState<string | null>(null);
    const [invalidUrl, setInvalidUrl] = useState<string | null>(null);
    const [linkAttributes, setLinkAttributes] = useState<Record<string, any>>();
    const [hasCopy, setHasCopy] = useState(false);
    const btnLinkRef = useRef(null);

    useEffect(() => {
        if (!editor) return;

        const update = () => {
            setIsLink(editor.isActive("link"));
            setCanLink(editor.can().toggleLink());
            // console.log("editor: ", editor.getAttributes('link'));
        };

        // editor.on("selectionUpdate", update);
        editor.on("transaction", update); // mỗi khi doc thay đổi → update state

        return () => {
            editor.off("transaction", update);
            // editor.off("selectionUpdate", (update));
        };
    }, [editor]);

    const addLink = useCallback(() => {
        if (text.trim() == "") {
            setInvalidText("Require");
            return;
        };

        // try {
        //     sanitizeUrl(url);
        // } catch(e) {
        //     setInvalidUrl("Invalid Url");
        //     return;
        // }


        if (!url || !text) return;

        const safeHref = validateUrl({ url });
        
        if (!safeHref) {
            setInvalidUrl("Invalid!");
            return;
        }

        if (!isLink) {
            editor
            .chain()
            .focus()
            .insertContent(`<a href="${url}" target="_blank">${text}</a>`) // khi tạo link có sẵn space
            .run()
        } else {
            // 1. Extend selection ra toàn bộ link
            editor.chain().focus().extendMarkRange('link').run();

            // 2. Lấy vùng selection mới
            const { from, to } = editor.state.selection;

            // 3. Thay text cũ bằng text mới
            // (insertContentAt chỉ thay nội dung, không inject HTML)
            editor
                .chain()
                .focus()
                .insertContentAt(
                { from, to },
                text,
                { parseOptions: { preserveWhitespace: true } }
                )
                // 4. Chọn lại text mới để áp lại link
                .setTextSelection({ from, to: from + text.length })
                // 5. Áp lại mark link với href mới
                //@ts-ignore
                .setLink({ href: url, target: '_blank', text })
                .run();
        }
        clear();
        setOpenPopup(false);
    }, [text, url, isLink]);

    const clear = () => {
        setText("");
        setUrl("");
        setInvalidText(null);
        setInvalidUrl(null);
    }


    useEffect(() => {
        if (!editor) return;
        const onUpdate = () => {
            if (editor.isActive('link')) {
                setLinkAttributes(editor.getAttributes('link'));
            } else {
                setLinkAttributes({});
            }
        };
        editor.on('transaction', onUpdate);
        return () => {
            editor.off('transaction', onUpdate);
        };
    }, [editor]);

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).catch(err => {
            console.error('Copy thất bại: ', err);
        });
        setHasCopy(true);
        setTimeout(() => {
            setHasCopy(false);
        }, 2000);
    }, []);


    return (
        <>
            
            {
                openPopup && 
                    <>
                        <div className="top-0 left-0 bg-black w-full h-full z-[150] fixed bg-white-1 opacity-65" onClick={() => { clear(); setOpenPopup(false) }}/>
                        <div className="bg-[#171717] fixed text-white-1 top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-fit max-sm:w-[95dvw] max-w-[300px] max-sm:rounded-none rounded z-[200]">
                            <div className="w-[300px] max-sm:w-full h-fit p-2 flex flex-col gap-2">
                                <div className="w-full h-fit flex justify-between">
                                    <p className="text-sm text-white">Create link</p><PiX onClick={() => { clear(); setOpenPopup(false) }} className="cursor-pointer w-5 h-5 text-white"/>
                                </div>
                                <div className="px-2 py-1 bg-[#212121] rounded">
                                    <input value={text} onChange={(value) => { setInvalidText(null); setText(value.target.value) }} type="text" className="text-white text-sm w-full outline-none bg-[#212121]" placeholder="Text"/>
                                </div>
                                { invalidText && <p className="text-red-500 text-xs pl-2 -mt-1">{invalidText}</p> }
                                <div className="px-2 py-1 bg-[#212121] rounded">
                                    <input value={url} onChange={(value) => { setInvalidUrl(null); setUrl(value.target.value) }} type="text" className="text-white text-sm w-full outline-none bg-[#212121]" placeholder="URL"/>
                                </div>
                                { invalidUrl && <p className="text-red-500 text-xs pl-2 -mt-1">{invalidUrl}</p> }
                                <div className="w-full flex justify-end text-sm gap-2 mt-2">
                                    <div className="text-white my-auto  cursor-pointer" onClick={() => { clear(); setOpenPopup(false) }}>cancel</div><div className="px-2 py-0.5 rounded bg-white text-black cursor-pointer" onClick={() => addLink()}>Link</div>
                                </div>
                            </div>
                        </div>
                    </>
            }

            <BubbleMenu 
                editor={editor} 
                shouldShow={() => editor.isActive('link')}
                options={{
                    placement: 'bottom'
                }}
            >
                {(
                    linkAttributes && btnLinkRef.current && <div className="bg-black text-white border rounded px-3 py-1 text-sm flex gap-2 max-w-[30dvw]">
                        <p className="truncate my-auto">{linkAttributes.href}</p> <div className="h-5 my-auto w-[0.5px] border-solid border-l-[0.5px] border-l-white/65"></div> <p className="my-auto text-white text-sm cursor-pointer" onClick={() => (btnLinkRef.current as any).click()}>Change</p> <div className="h-5 my-auto w-[0.5px] border-solid border-l-[0.5px] border-l-white/65"> </div><p className="my-auto text-white text-sm cursor-pointer" onClick={() => hasCopy ? () => {} : copyToClipboard(linkAttributes.href)}>{hasCopy ? 'Copied!' : 'Copy'}</p>
                    </div>
                )}
            </BubbleMenu>
            

            <button
                ref={btnLinkRef}
                onClick={() => {
                    // editor.chain().focus().toggleLink({href: "https://ok.com"}).run()
                    // openPopupAtCaret();
                    if (editor.isActive("link")) {
                        setText(editor.getAttributes('link').text || "");
                        setUrl(editor.getAttributes('link').href || "");
                    }
                    const { from, to } = editor.state.selection;
                    const selectedText = editor.state.doc.textBetween(from, to, ' ');
                    if (selectedText) {
                        setText(selectedText || "");
                    }
                    setOpenPopup(true);
                }}
                disabled={!canLink}
                className={`${!canLink ? 'cursor-not-allowed' : ''} px-1 mx-0.5 flex justify-center w-fit h-[30px] rounded disabled:opacity-50
                    ${
                        isLink ?
                        "dark:bg-[#151515] bg-[#e7e7e7] dark:outline-white/10 outline-black/10 outline outline-1 outline-offset-[-1px]"
                        :
                        ""
                    }`
                }
            >
                <PiLink className="my-auto w-[22px] h-6" />
            </button>
        </>
    );
}
