import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "PUT"]
    }
})

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("joinRoom", (data) => {
        socket.join(data);
        console.log(`User ID:- ${socket.id} with room no ${data}`)
    })

    socket.on("sendMessage", (data) => {
        console.log("send message data", data)
        socket.to(data.room).emit("receiveMessage", data)
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
});

app.use(cors());

server.listen(1000, () => console.log("Server is running on port 1000"));
