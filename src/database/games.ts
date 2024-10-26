import { DB_Game } from "../types/Game.type";

const GAMES: DB_Game[] = [];

export function db_getGames(): DB_Game[] {
  return GAMES;
}

export function db_addGame(newGame: DB_Game): void {
   GAMES.push(newGame);
}

