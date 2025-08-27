import { useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { NavLink, useParams } from "react-router-dom";
import Game from "./Game";

export default function Room() {

    const { roomName } = useParams();
    const socket = useSocket();
    // const [ username, setUsername ] = useState<String | null>("Anonymous")
    const [ linkCopied, setLinkCopied ] = useState(false);
    const [ startGame, setStartGame ] = useState(false);

    useEffect(() => {
        if(!socket) return;
        console.log("socket id", socket.id);

        socket.on("startGame", (startGame) => {
            setStartGame(startGame);
        })

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
    }, [socket, roomName]);

    useEffect(() => {
        if(linkCopied) {
            setTimeout(() => {
                setLinkCopied(false)
            }, 2000)
        }
    }, [linkCopied]);

    const copyInvite = async (e: any) => {
        const link = e.target.value;

        console.log("link", link);
        
        await navigator.clipboard.writeText(link);
        setLinkCopied(true);
    }

    return (
        <>
            { linkCopied && 
                <div className="absolute m-2 w-full flex items-center justify-center">
                    <div className=" bg-green-400 text-white text-center p-2 rounded">Invite link saved in clipboard</div>
                </div>
            }
            <NavLink to="/"><button className="btn">Homepage</button></NavLink>
            <div className="flex items-center">
                <label htmlFor="invite">Invite a friend by giving him this url :</label>
                <input id="invite" readOnly value={`http://localhost:5173/room/${roomName}`} onClickCapture={copyInvite} />
            </div>
            { startGame && 
                <div>
                    <Game roomName={roomName} socket={socket} />
                </div>
            }
        </>
    )
}