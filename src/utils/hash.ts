import crypto from "node:crypto";

import { DB_User, UserCreds } from "../types/User.type";
import { db_getUsers } from "../database/users";

const cryptoSHA256 = crypto.createHash("sha256");

export function createUserHash(newUser: UserCreds): string {
  return cryptoSHA256
    .update(`${newUser.name}${newUser.password}`)
    .digest("hex");
}


export function getUsersInGames(): DB_User[]{
  const allUsers = db_getUsers();
  // const allGames = db_

  return []
}