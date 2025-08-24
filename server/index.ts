import express from "express";
import cors from "cors";
import apiRoutes from "./routes/api.ts";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*" // Change in PROD
    }
});

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);


io.on("connection", (socket) => {
    console.log("Client connected :", socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected :", socket.id);
    });
})

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
