import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Typage des événements si tu veux être strict
interface ServerToClientEvents {
  message: (msg: string) => void;
  roomCreated: (roomId: string) => void;
  startGame: (params : { start: boolean , style: string }) => void;
}
interface ClientToServerEvents {
  message: (msg: string) => void;
  createRoom: (gameStyle: string) => void;
  joinRoom: (roomName: string) => void;
  leaveRoom: (roomName: string) => void;
}

type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>;

export const SocketContext = createContext<SocketType | null>(null);

export default function SocketProvider(props:any) {
    
    const [socket, setSocket] = useState<SocketType | null>(null);

    useEffect(() => {
        // const newSocket:SocketType = io('http://localhost:4000'); // DEV
        const newSocket:SocketType = io('https://shifumi-rpc.com/socket-io/'); // Prod

        newSocket.on("connect", () => {
          setSocket(newSocket)
        })

        return () => {
            newSocket.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

// Hook pratique pour utiliser le socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    // throw new Error("useSocket must be used inside a SocketProvider");
  }
  return socket;
};