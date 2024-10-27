import { getUnshottedCell } from "../utils/utils";
import { createBot } from "./bot";
import { addShips, attack, createGame } from "./game";
import { registUser } from "./register";
import { getRooms, createRoom, addToRoom } from "./room";
import { getWinners } from "./winners";

interface ProcessedReturn {
  type: string;
  data: unknown;
  clientIds: string[];
}

function controller(userId: string, clientData: string): ProcessedReturn[] {
  const parsedClientData = JSON.parse(clientData);

  switch (parsedClientData.type) {
    case "reg": {
      const data = JSON.parse(parsedClientData.data);

      return [registUser(userId, data), getRooms(), getWinners()];
    }

    case "create_room": {
      return [createRoom(userId)];
    }

    case "add_user_to_room": {
      const data = JSON.parse(parsedClientData.data);
      const add_user_to_room = [
        ...addToRoom(userId, data.indexRoom),
        getRooms(),
      ];
      return add_user_to_room;
    }

    case "add_ships": {
      const data = JSON.parse(parsedClientData.data);

      return addShips({
        gameId: data.gameId,
        playerId: data.indexPlayer,
        ships: data.ships,
      });
    }

    case "attack": {
      const { gameId, indexPlayer, x, y } = JSON.parse(parsedClientData.data);

      return attack({ fromPlayerId: indexPlayer, gameId: gameId, x, y });
    }

    case "randomAttack": {
      const { gameId, indexPlayer } = JSON.parse(parsedClientData.data);

      const unshotCell = getUnshottedCell(gameId, indexPlayer);

      if (unshotCell === null) {
        return [];
      }

      return attack({
        fromPlayerId: indexPlayer,
        gameId: gameId,
        x: unshotCell.x,
        y: unshotCell.y,
      });
    }

    case "single_play": {
      const gameId = `bot::${userId}`;
      createBot(gameId);

      return [createGame(gameId, userId)];
    }
  }
  return [];
}

export { controller };
