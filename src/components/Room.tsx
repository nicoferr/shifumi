import { useEffect } from "react";
import { useSocket } from "../providers/SocketProvider";
import { NavLink, useParams } from "react-router-dom";

export default function Room() {

    const { roomName } = useParams();
    const socket = useSocket();

    useEffect(() => {
        console.log("socket id", socket?.id);
        const handleBeforeUnload = () => {
            if(roomName)
                socket?.emit("leaveRoom", roomName);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            // Lors de la navigation vers une autre page
            if(roomName)
            socket?.emit("leaveRoom", roomName);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <>
            <NavLink to="/"><button className="btn">Homepage</button></NavLink>
            <input disabled value={`http://localhost:5173/room/${roomName}`}/>
        </>
    )
}