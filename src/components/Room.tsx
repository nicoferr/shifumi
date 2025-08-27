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
    const [ inviteLink, setInviteLink ] = useState("");

    useEffect(() => {
        if(!socket) return;
        console.log("socket id", socket.id);

        setInviteLink(`http://localhost:5173/room/${roomName}`)

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

    const copyInvite = async () => {
        await navigator.clipboard.writeText(inviteLink);
        setLinkCopied(true);
    }

    return (
        <div className="p-4">
            { linkCopied && 
                <div className="fixed w-full p-2 flex items-center justify-center">
                    <div className=" bg-green-400 text-white text-center p-2 rounded">Invite link saved in clipboard</div>
                </div>
            }
            <NavLink to="/"><button className="btn">Homepage</button></NavLink>
            <div className="flex items-center w-full gap-4">
                <label htmlFor="invite">Invite a friend by giving him this url :</label>
                <input id="invite" className="w-1/2 px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-500" readOnly value={inviteLink} onClick={copyInvite} />
                <button className="bg-blue-400 text-white py-2 px-4 rounded cursor-pointer" onClick={copyInvite}>Copy</button>
            </div>
            { startGame ? 
                <div>
                    <Game roomName={roomName} socket={socket} />
                </div>
                :
                <div>Waiting for opponent...</div>
            }
        </div>
    )
}