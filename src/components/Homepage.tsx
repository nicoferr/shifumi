import { useNavigate } from "react-router-dom"
import { useSocket } from "../providers/SocketProvider";

export default function Homepage() {

    const navigate = useNavigate();
    const socket = useSocket();

    const createRoom = () => {
        socket?.emit("createRoom");

        socket?.on("roomCreated", (roomName) => {
            navigate(`/room/${roomName}`);
        })
    }

    return (
        <>
            <button className="btn" onClick={createRoom}>Create a room</button>
            <button className="btn">Solo against Computer</button>
        </>
    );
}