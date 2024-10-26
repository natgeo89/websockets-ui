// import crypto from "node:crypto";
import { DB_User, UserCreds } from "../types/User.type";

const USERS: DB_User[] = [];

export function db_getUsers(): DB_User[] {
  return USERS;
}

export function db_getUserIds(): string[] {
  return USERS.map(({ index }) => index);
}

export function db_createUser(userId: string, newUser: UserCreds): DB_User {
  const createdUser = {
    name: newUser.name,
    index: userId,
  };

  USERS.push(createdUser);

  return createdUser;
}

export function db_getUser(userId: string): DB_User | null {
  const existUser = USERS.find(({ index }) => userId === index);

  if (existUser) {
    return existUser;
  }

  return null;
}
