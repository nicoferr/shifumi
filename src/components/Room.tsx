import { useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";

export default function Room(props: any) {

    const { roomName } = props;
    const socket = useSocket();

    const [room, setRoom] = useState("");

    useEffect(() => {

        socket.on("roomCreated", (roomName) => {
            setRoom(roomName);
        });

        socket.emit("createRoom", roomName);

        return () => {
            socket.emit("leaveRoom", roomName)
        }
    }, []);

    return (
        <>
        </>
    )
}