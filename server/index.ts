import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.ts";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

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


io.on("connection", (socket) => {
    console.log("Client connected :", socket.id);

    socket.on("createRoom", () => {
        const roomName = uuidv4()

        socket.join(roomName);
        socket.emit("roomCreated", roomName);

        console.log(`New room created : ${roomName}`);
    });

    socket.on("leaveRoom", (roomName) => {
        socket.leave(roomName);
        console.log("Room left :", roomName)
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected :", socket.id);
    });
})

const PORT = 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
