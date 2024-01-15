import * as http from "http";
import { Server } from "socket.io";
import { IMessage } from "./types";
import { dateMaker } from "./utils/dateUtilities";
import { v4 as uuidv4 } from "uuid";
import {
  addMessageRoom,
  addRoom,
  deleteMessageRoom,
  findRoom,
} from "./utils/roomUtilities";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (name: number) => {
    let room = findRoom(name);
    if (!room) {
      room = addRoom(name);
    }
    socket.join(name.toString());
    socket.emit("roomJoined", { room });
  });

  socket.on(
    "sendMessage",
    (
      name: number,
      user: { username: string; avatar: string },
      content: string
    ) => {
      const message: IMessage = {
        id: uuidv4(),
        userId: socket.id,
        username: user.username,
        avatar: user.avatar,
        content,
        date: dateMaker(),
      };
      const roomMessages = addMessageRoom(name, message);
      io.to(name.toString()).emit("messageSended", { messages: roomMessages });
    }
  );

  socket.on("deleteMessage", (name, id: string) => {
    const messagesRoomLeft = deleteMessageRoom(name, id);
    io.to(name).emit("messageDeleted", { messages: messagesRoomLeft });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

httpServer.listen(3002, () => {
  console.log("listen 3002");
});
