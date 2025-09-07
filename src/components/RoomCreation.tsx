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
        <div className="p-4 flex flex-col w-full md:mt-30 items-center justify-center">
            <div className="flex flex-col md:flex-row items-stretch gap-5">
                <button className="btn btn-nav gap-3 flex-col" onClick={() => createRoom("standard")}>
                    <img src="/images/rules/standard.png" alt="Standard rules" title="Standard rules" className="w-100 bg-white" />
                    Standard Rock / Paper / Scissors
                </button>
                <button className="btn btn-nav gap-3 flex-col" onClick={() => createRoom("lizard-spock")}>
                    <img src="/images/rules/lizard-spock.png" alt="Lizard Spock rules" title="Lizard Spock rules" className="w-100 bg-white" />
                    Rock / Paper / Scissors / Lizard / Spock
                </button>
            </div>
        </div>
    )
}