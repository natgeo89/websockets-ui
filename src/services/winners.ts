import { db_getUser, db_getUserIds } from "../database/users";
import { db_addWinner, db_getWinners } from "../database/winners";
import { DB_Winner } from "../types/Winner.type";

export interface UpdateWinnersReturn {
  type: "update_winners";
  data: DB_Winner[];
  clientIds: string[];
}

export function getWinners(): UpdateWinnersReturn {
  // const usersInGame = db_getRooms()
  //   .filter(({ roomUsers }) => roomUsers.length === 2)
  //   .flatMap(({ roomUsers }) => roomUsers)
  //   .map(({ index }) => index);

  return {
    type: "update_winners",
    data: db_getWinners(),
    clientIds: db_getUserIds()
    // .filter(
    //   (userId) => !usersInGame.includes(userId)
    // ),
  };
}

export function updateWinners(winnerId: string): UpdateWinnersReturn {
  const winner = db_getUser(winnerId);

  if (winner) {
    db_addWinner(winner.name);

    return getWinners();
  }
}
