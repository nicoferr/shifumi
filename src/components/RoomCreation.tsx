import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../providers/SocketProvider";

export default function RoomCreation() {

    const { state } = useLocation();
    const vsComputer = state.vsComputer;

    const navigate = useNavigate();
    const socket = useSocket();

    const createRoom = (gameStyle: string) => {

        if(vsComputer) {
            navigate("/room/vs-computer", { state: { gameStyle } });
        } else {
            socket?.emit("createRoom", gameStyle);
    
            socket?.on("roomCreated", (roomName) => {
                navigate(`/room/${roomName}`);
            })
        }
    }

    return (
        <div className="p-4 flex flex-col w-full mt-30 items-center justify-center">
            <div className="flex flex-col items-stretch gap-5">
                <button className="btn btn-nav gap-3" onClick={() => createRoom("standard")}>
                    Standard Rock / Paper / Scissors
                </button>
                <button className="btn btn-nav gap-3" onClick={() => createRoom("lizard-spock")}>
                    Rock / Paper / Scissors / Lizard / Spock
                </button>
            </div>
        </div>
    )
}