"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var cors_1 = require("cors");
var socket_io_1 = require("socket.io");
var app = (0, express_1["default"])();
var port = process.env.PORT || 3001;
app.use((0, cors_1["default"])());
app.use(express_1["default"].static("client/dist"));
app.get("*", function (req, res) {
    res.sendFile("./client/dist/index.html");
});
var server = http_1["default"].createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "https://vue-chatroom.fly.dev",
        methods: ["GET", "POST"]
    }
});
io.on("connection", function (socket) {
    console.log("User Connected: ".concat(socket.id));
    socket.on("join_room", function (data) {
        socket.join(data);
        console.log("User with ID: ".concat(socket.id, " joined room: ").concat(data));
    });
    socket.on("send_message", function (data) {
        socket.to(data.room).emit("receive_message", data);
    });
    socket.on("disconnect", function () {
        console.log("User Disconnected", socket.id);
    });
});
server.listen(port, function () {
    console.log("SERVER RUNNING ON PORT ".concat(port));
});
