import { DB_User } from "./User.type";

export interface DB_Room {
  roomId: number | string;
  roomUsers: DB_User[];
}
