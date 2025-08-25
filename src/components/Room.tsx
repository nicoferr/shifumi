import { useEffect } from "react";
import { useSocket } from "../providers/SocketProvider";

export default function Room(props: any) {

    const { roomName } = props;
    const socket = useSocket();

    useEffect(() => {

        socket.on("roomCreated", () => {

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