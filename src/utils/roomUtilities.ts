import { IMessage, IRoom } from "../types";

const rooms: IRoom[] = [];

export function addRoom(name: number) {
  if (!findRoom(name)) {
    const room: IRoom = { name, messages: [] };
    rooms.push(room);
    return room;
  }
}

export function findRoom(name: number) {
  return rooms.find((r) => r.name === name);
}

export function addMessageRoom(name: number, message: IMessage) {
  const room = findRoom(name);
  if (!room) {
    console.log("no room find for name " + name);
    return [];
  }
  room.messages.push(message);
  return room.messages;
}

export function deleteMessageRoom(name: number, id: string) {
  const room = findRoom(name);
  if (!room) {
    console.log("no room find for name " + name);
    return [];
  }
  room.messages = room.messages.filter((message) => message.id !== id);
  return room.messages;
}

export function deleteRoom(name: number) {
  const roomIndex = rooms.findIndex((r) => r.name === name);
  if (roomIndex < 0) return;
  rooms.splice(roomIndex, 1);
}
