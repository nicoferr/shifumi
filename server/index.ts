import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { join } from "path";

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Change in PROD
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

const joinRoom = (socket, roomName) => {
    socket.join(roomName)

    console.log(socket.id, "joined room:", roomName);

    // Check number of players
    const room = io.sockets.adapter.rooms.get(roomName);
    console.log("room:", room);
    // console.log("room size:", room?.size);
    if(room && room.size == 2) {
        io.to(roomName).emit("startGame", true);
    }
}

let newGameRequests = []; // Array of Number of player asking for new game PER ROOM
const initNewGameRequests = (roomName: string) => {
    newGameRequests[roomName] = 0;
}


io.on("connection", (socket) => {
    console.log("Client connected :", socket.id);

    socket.on("createRoom", () => {
        const roomName = uuidv4()

        joinRoom(socket, roomName);
        socket.emit("roomCreated", roomName);
        console.log(`New room created : ${roomName}`);
    });

    socket.on("joinRoom", (roomName) => {
        console.log("join room requested");
        joinRoom(socket, roomName);
        initNewGameRequests(roomName);
    });

    socket.on("leaveRoom", (roomName) => {
        socket.leave(roomName);
        console.log(socket.id, "left room:", roomName);
        
        const room = io.sockets.adapter.rooms.get(roomName);
        if(!room || room.size < 2) {
            io.to(roomName).emit("startGame", false);
        }        

    });

    socket.on("playerChoice", ({ roomName, choice}) => {
        socket.to(roomName).emit("opponentChoice", choice);
    });

    socket.on("newGameAsked", ({ roomName }) => {
        const nbRequests = newGameRequests[roomName] + 1;
        
        if( nbRequests == 2) {
            initNewGameRequests(roomName);
            io.to(roomName).emit("newGame");
        } else {
            newGameRequests[roomName]++;
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected :", socket.id);
    });
})

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
