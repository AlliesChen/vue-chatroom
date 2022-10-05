import express from "express";
import http   from "http";
import cors from "cors";
import { Server } from "socket.io";

interface UserSentMessage {
    room: string
    author: string
    message: string
    time: string
}

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    })
    socket.on("send_message", (data: UserSentMessage) => {
        socket.to(data.room).emit("receive_message", data);
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    })
})

server.listen(3001, () => {
    console.log("SERVER RUNNING");
})