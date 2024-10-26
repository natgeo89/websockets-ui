import { db_addGame, db_getGames } from "../database/games";
import { Ship } from "../types/Game.type";
import { DB_Room } from "../types/Room.type";

export interface CreateGameReturn {
  type: "create_game";
  data: {
    idGame: number | string;
    idPlayer: number | string;
  };
  clientIds: string[];
}

export function createGame(idGame: string, userId: string): CreateGameReturn {
  return {
    type: "create_game",
    data: { idGame, idPlayer: userId },
    clientIds: [userId],
  };
}

export function addShips({
  gameId,
  playerId,
  ships,
}: {
  gameId: string;
  ships: [];
  playerId: string;
}): StartGameReturn[] {
  const games = db_getGames();
  const game = games.find((game) => game.gameId === gameId);

  if (!game) {
    db_addGame({ gameId, players: [{ playerId, ships }] });

    return [];
  }

  game.players.push({ playerId, ships });

  return game.players.map((player) => startGame(player.playerId, player.ships));
}

interface StartGameReturn {
  type: "start_game";
  data: {
    ships: Ship[];
    currentPlayerIndex: number | string;
  };
  clientIds: string[];
}

function startGame(playerId: string, ships: Ship[]): StartGameReturn {
  return {
    type: "start_game",
    data: { ships, currentPlayerIndex: playerId },
    clientIds: [playerId],
  };
}

// {
//   type: "start_game",
//   data:
//       {
//           ships: /* player's ships, not enemy's */
//               [
//                   {
//                       position: {
//                           x: <number>,
//                           y: <number>,
//                       },
//                       direction: <boolean>,
//                       length: <number>,
//                       type: "small"|"medium"|"large"|"huge",
//                   }
//               ],
//           currentPlayerIndex: <number | string>, /* id of the player in the current game session, who have sent his ships */
//       },
//   id: 0,
// }
