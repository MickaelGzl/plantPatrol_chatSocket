import * as http from "http";
import { Server } from "socket.io";
import { isPhoneNumberInMessage } from "./utils/filterUtilities";
import { createRoom, findRoomPerName, deleteRoom } from "./queries/roomQuery";
import { createMessage, deleteMessage } from "./queries/messageQuery";
import { connection } from "./db";
import { IMessage } from "./types";

const httpServer = http.createServer();

connection();

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("joinRoom", async (name: string, userId: string) => {
    let room = await findRoomPerName(name);
    if (!room) {
      room = await createRoom(name, userId);
    }
    socket.join(name);
    socket.emit("roomJoined", { room });
  });

  socket.on(
    "sendMessage",
    async (
      name: string,
      user: { id: string; username: string; avatar: string },
      content: string
    ) => {
      if (content.length > 320) {
        socket.emit("alert", {
          type: "error",
          code: "message too long",
          alert:
            "Votre message est trop long. La limite maximum de caractère autorisée est de 320.",
        });
      }

      const message = {
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        content,
      };

      if (isPhoneNumberInMessage(content)) {
        socket.emit("alert", {
          type: "warning",
          code: "sensitive data",
          alert:
            "Attention : Nous avons détecté un numéro de téléphone dans votre message. Pour protéger vos données personnelles, nous ne l'avons pas envoyé. Si vous êtes sûr de votre action, vous pouvez continuer.",
          data: message,
        });
      } else {
        const newMessage = await createMessage(name, message);
        io.to(name).emit("messageSended", {
          message: newMessage,
        });
      }
    }
  );

  socket.on("confirmAlert", async (name: string, data: IMessage) => {
    const newMessage = await createMessage(name, data);
    io.to(name).emit("messageSended", {
      message: newMessage,
    });
  });

  socket.on("deleteMessage", async (name: string, messageId: string) => {
    const deletion = await deleteMessage(name, messageId);
    if (!deletion) {
      socket.emit("alert", {
        type: "error",
        code: "error while deleting message",
        alert:
          "Votre message n'a pas pu être correctement supprimé. Merci de réessayer ultérieurement.",
      });
    }
    io.to(name).emit("messageDeleted", {
      messageId,
    });
  });

  socket.on("offerEnded", (name: string) => {
    deleteRoom(name);
    io.to(name).emit("roomDeleted", { name });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

httpServer.listen(3002, () => {
  console.log("listen 3002");
});
