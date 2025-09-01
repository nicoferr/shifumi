import { useNavigate } from "react-router-dom"
import { useSocket } from "../providers/SocketProvider";

export default function Homepage() {

    const navigate = useNavigate();
    const socket = useSocket();

    const createRoom = (vsComputer: boolean) => {

        if(vsComputer) {
            navigate(`/room/vs-computer`);
        } else {
            socket?.emit("createRoom");
    
            socket?.on("roomCreated", (roomName) => {
                navigate(`/room/${roomName}`);
            })
        }
    }

    return (
        <div className="p-4 flex flex-col w-full mt-30 items-center justify-center">
            <div className="flex flex-col items-stretch gap-5">
                <button className="btn btn-nav gap-3" onClick={() => createRoom(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                    </svg>
                    vs Player
                </button>
                <button className="btn btn-nav gap-3" onClick={() => createRoom(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clipRule="evenodd" />
                    </svg>
                    vs Computer
                </button>
            </div>
        </div>
    );
}