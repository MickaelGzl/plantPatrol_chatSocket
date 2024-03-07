import { Types } from "mongoose";
import { Room } from "../db/models";
import { deleteMessage } from "./messageQuery";

export const findRoomPerName = (name: string) => {
  return Room.findOne({ name }).exec();
};

export const createRoom = async (name: string, userId: string) => {
  if (await findRoomPerName(name)) {
    return null;
  }
  const room = new Room({
    name,
    users: [userId],
  });
  return room.save();
};

export const deleteRoom = async (name: string) => {
  const room = await findRoomPerName(name);
  if (!room) return;
  await Promise.all(
    room.messages.map(async (messageId: Types.ObjectId) => {
      return await deleteMessage(name, messageId.toString(), false);
    })
  );
  return true;
};
