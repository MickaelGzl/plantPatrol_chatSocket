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
  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

httpServer.listen(3000, () => {
  console.log("listen 3000");
});
