import { DB_User } from "./User.type";

export interface DB_Room {
  roomId: string;
  roomUsers: DB_User[];
}
