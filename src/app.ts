import * as http from "http";
import { Server } from "socket.io";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", (name: string) => {});

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

httpServer.listen(3002, () => {
  console.log("listen 3002");
});
