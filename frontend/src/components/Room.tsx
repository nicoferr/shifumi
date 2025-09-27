import { useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { NavLink, useLocation, useParams } from "react-router-dom";
import Game from "./Game";
import GameProvider from "../providers/GameProvider";

export default function Room() {

    const { roomName } = useParams();
    const vsComputer = roomName == 'vs-computer';

    const { state } = useLocation();
    
    const socket = useSocket();
    // const [ username, setUsername ] = useState<String | null>("Anonymous")
    const [ linkCopied, setLinkCopied ] = useState(false);
    const [ startGame, setStartGame ] = useState(false);
    const [ inviteLink, setInviteLink ] = useState("");
    const [ gameStyle, setGameStyle ] = useState("");
    const [ showRules, setShowRules ] = useState(false);

    // On récupère le style de jeu (standard / lizard-spock) dans le state
    useEffect(() => {
        if(vsComputer) {
            setGameStyle(state.gameStyle);
        }
    }, []);

    useEffect(() => {
        if(!vsComputer) {
            if(!socket) return;
    
            setInviteLink(`https://shifumi-rpc.com/room/${roomName}`)
    
            socket.on("startGame", ({ start, style }) => {
                setGameStyle(style);
                setStartGame(start);
            });

            if(roomName) {
                socket.emit("joinRoom", roomName);
            }
    
            // Leave room when reload or leave page
            const handleBeforeUnload = () => {
                if(roomName)
                    socket.emit("leaveRoom", roomName);
            };
    
            window.addEventListener("beforeunload", handleBeforeUnload);

            return () => {
                // Lors de la navigation vers une autre page
                if(roomName)
                    socket.emit("leaveRoom", roomName);
                window.removeEventListener("beforeunload", handleBeforeUnload);
                socket.off("startGame");
            };
        }
    }, [socket, roomName]);

    useEffect(() => {
        if(!vsComputer && linkCopied) {
            setTimeout(() => {
                setLinkCopied(false)
            }, 2000)
        }
    }, [linkCopied]);

    const copyInvite = async () => {
        await navigator.clipboard.writeText(inviteLink);
        setLinkCopied(true);
    }

    return (
        <div className="h-full flex flex-col items-center p-4">
            { showRules && 
                <div className="w-full flex justify-center items-center absolute top-0 h-full bg-gray-500/50" onClick={() => setShowRules(false)}>
                    <img src={`/images/rules/${gameStyle}.png`} alt="Rules" title="Rules" className="max-h-2/3 bg-white" />
                </div>
            }
            { linkCopied && 
                <div className="fixed w-full p-2 flex items-center justify-center">
                    <div className=" bg-green-400 text-white text-center p-2 rounded">Invite link saved in clipboard</div>
                </div>
            }
            <div className="flex flex-col md:flex-row justify-center gap-5 my-5">
                <NavLink to="/">
                    <button className="btn flex items-center gap-3 btn-nav">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                            <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                            <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                        </svg>
                        Homepage
                    </button>
                </NavLink>
            {
                !vsComputer &&
                <>
                    <input id="invite" className="hidden md:block px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500" readOnly value={inviteLink} onClick={copyInvite} />
                    <button className="btn btn-blue" onClick={copyInvite}>Copy to invite a friend</button>
                </>
            }
            </div>
            { startGame || vsComputer ? 
                <div>
                    <div className="flex w-full justify-center">
                        <button className="btn btn-blue gap-3" onClick={() => setShowRules(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z" clipRule="evenodd" />
                                <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
                            </svg>
                            Rules
                        </button>
                    </div>
                    <GameProvider>
                        <Game roomName={roomName} socket={socket} gameStyle={gameStyle} />
                    </GameProvider>
                </div>
                :
                <div className="mt-10">Waiting for opponent...</div>
            }
        </div>
    )
}