import { Message, Room } from "../db/models";
import { IMessage } from "../types";
import { findRoomPerName } from "./roomQuery";

export const createMessage = async (room: string, data: IMessage) => {
  const activeRoom = await findRoomPerName(room);
  if (!activeRoom) return;

  const message = new Message({ ...data });
  await Room.findByIdAndUpdate(
    activeRoom.id,
    {
      $push: { messages: message.id },
    },
    { new: true }
  ).exec();
  return message.save();
};

export const deleteMessage = async (
  name: string,
  id: string,
  deleteRoom = true
) => {
  try {
    await Message.findByIdAndDelete(id).exec();
    if (deleteRoom) {
      const activeRoom = await findRoomPerName(name);
      if (!activeRoom) return;
      activeRoom.messages = activeRoom.messages.filter(
        (messageId) => messageId.toString() !== id
      );
      activeRoom.save();
    }

    return true;
  } catch (error) {
    console.error("error deleteMessage: ", error);
    return false;
  }
};
