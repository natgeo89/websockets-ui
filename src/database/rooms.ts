import crypto from "node:crypto";

import { DB_Room } from "../types/Room.type";
import { db_getUser } from "./users";

const ROOMS: DB_Room[] = [];

export function db_getRooms(): DB_Room[] {
  return ROOMS;
}

export function db_createRoom(): string {
  const roomId = crypto.randomUUID();

  ROOMS.push({ roomId, roomUsers: [] });

  return roomId;
}

export function db_getRoom(roomId: string): DB_Room | null {
  const existRoom = ROOMS.find((room) => roomId === room.roomId);

  if (existRoom) {
    return existRoom;
  }

  return null;
}

export function db_addToRoom(userId: string, roomId: string): void {
  const roomIndex = ROOMS.findIndex((room) => room.roomId === roomId);

  const user = db_getUser(userId);

  if (user === null) return;

  if (roomIndex === -1) {
    ROOMS.push({ roomId, roomUsers: [user] });
  } else {
    const updatedRoom = ROOMS[roomIndex];

    updatedRoom.roomUsers.push(user);

    ROOMS[roomIndex] = updatedRoom;
  }
}
