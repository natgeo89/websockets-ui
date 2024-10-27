import { DB_User } from "../types/User.type";
import { DB_Winner } from "../types/Winner.type";

const WINNERS: DB_Winner[] = [];

export function db_getWinners(): DB_Winner[] {
  return WINNERS;
}

export function db_addWinner(winnerName: DB_User['name']): void {
  const winnerIndex = WINNERS.findIndex(({ name }) => winnerName === name);

  if (winnerIndex === -1) {
    WINNERS.push({ name: winnerName, wins: 1 });
  } else {
    WINNERS[winnerIndex] = {
      ...WINNERS[winnerIndex],
      wins: WINNERS[winnerIndex].wins + 1,
    };
  }
}
