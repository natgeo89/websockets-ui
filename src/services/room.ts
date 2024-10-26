import { DB_Room } from "../types/Room.type";
import {
  db_addToRoom,
  db_createRoom,
  db_getRoom,
  db_getRooms,
} from "../database/rooms";
import { db_getUserIds } from "../database/users";
import { createGame, CreateGameReturn } from "./game";

interface UpdateRoomReturn {
  type: "update_room";
  data: DB_Room[];
  clientIds: string[];
}

export function getRooms(): UpdateRoomReturn {
  const usersInGame = db_getRooms()
    .filter(({ roomUsers }) => roomUsers.length === 2)
    .flatMap(({ roomUsers }) => roomUsers)
    .map(({ index }) => index);

  const freeRooms = db_getRooms().filter(
    ({ roomUsers }) =>
      roomUsers.length < 2 &&
      !roomUsers.find(({ index }) => usersInGame.includes(index))
  );

  return {
    type: "update_room",
    data: freeRooms,
    clientIds: db_getUserIds().filter(
      (userId) => !usersInGame.includes(userId)
    ),
  };
}

export function createRoom(userId: string): UpdateRoomReturn {
  // Check if this user already created room
  const roomWithThisUser = db_getRooms().find(({ roomUsers }) =>
    roomUsers.find(({ index }) => index === userId)
  );

  if (roomWithThisUser) {
    return undefined;
  }

  const newRoomId = db_createRoom();
  db_addToRoom(userId, newRoomId);

  return {
    type: "update_room",
    data: db_getRooms().filter(({ roomUsers }) => roomUsers.length < 2),
    clientIds: db_getUserIds(),
  };
}

export function addToRoom(
  userId: string,
  roomId: string
): UpdateRoomReturn | CreateGameReturn {
  // Check if this user already inside this room
  const roomWithThisUser = db_getRooms().find(
    (room) =>
      roomId === room.roomId &&
      room.roomUsers.find(({ index }) => index === userId)
  );

  if (roomWithThisUser) {
    return undefined;
  }

  db_addToRoom(userId, roomId);

  const updatedRoom = db_getRoom(roomId);

  if (updatedRoom.roomUsers.length === 2) {
    return createGame(userId, updatedRoom);
  }

  return {
    type: "update_room",
    data: db_getRooms().filter(({ roomUsers }) => roomUsers.length < 2),
    clientIds: db_getUserIds().filter(
      (userId) => !updatedRoom.roomUsers.find(({ index }) => index === userId)
    ),
  };
}
