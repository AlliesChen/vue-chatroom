import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

interface UserSentMessage {
  room: string;
  author: string;
  message: string;
  time: string;
}

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.static("client/dist"));
app.get("*", (req, res) => {
  res.sendFile("./client/dist/index.html");
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // TODO: Change back to https://vue-chatroom.fly.dev
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });
  socket.on("send_message", (data: UserSentMessage) => {
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
