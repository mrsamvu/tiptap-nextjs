"use client";
import { Editor } from "@tiptap/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GoTasklist, GoListUnordered, GoListOrdered } from "react-icons/go";
import './style.css';
import { RxDividerHorizontal } from "react-icons/rx";
import { PiCaretDown, PiCaretDownBold } from "react-icons/pi";
import EmbedYoutubePopup from "./components/embedYoutubePopup";
import { useState } from "react";
import EmbedSpotifyPopup from "./components/embedSpotifyPopup";
import EmbedSoundCloudPopup from "./components/embedSoundCloudPopup";
import EmbedVimeoPopup from "./components/embedVimeoPopup";

export default function EmbedBtn({ editor }: { editor: Editor }) {
    const [openYoutubePopup, setOpenYoutubePopup] = useState(false);
    const [openSpotifyPopup, setOpenSpotifyPopup] = useState(false);
    const [openSoundCloudPopup, setOpenSoundCloudPopup] = useState(false);
    const [openVimeoPopup, setOpenVimeoPopup] = useState(false);

    return (
        <>
            {
                openYoutubePopup && <EmbedYoutubePopup setOpenYoutubePopup={setOpenYoutubePopup} editor={editor}/>
            }

            {
                openSpotifyPopup && <EmbedSpotifyPopup setOpenSpotifyPopup={setOpenSpotifyPopup} editor={editor}/>
            }

            {
                openSoundCloudPopup && <EmbedSoundCloudPopup setOpenSoundCloudPopup={setOpenSoundCloudPopup} editor={editor}/>
            }

            {
                openVimeoPopup && <EmbedVimeoPopup setOpenVimeoPopup={setOpenVimeoPopup} editor={editor}/>
            }
            <div className="w-fit caret-transparent h-[30px] flex mx-0.5 justify-center text-sm cursor-pointer">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <p className="h-fit w-fit flex text-sm my-auto gap-[3px]">Embed <PiCaretDownBold className="w-3 h-3 my-auto opacity-50"/></p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36" align="start">
                        <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => setOpenYoutubePopup(true)}>
                                Youtube
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenSpotifyPopup(true)}>
                                Spotify
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenSoundCloudPopup(true)}>
                                SoundCloud
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenVimeoPopup(true)}>
                                Vimeo
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}
