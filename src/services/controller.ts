import { db_getUserIds } from "../database/users";
import { addShips, attack } from "./game";
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

      return [];
    }
  }

  return [{ type: "nothing", data: "", clientIds: db_getUserIds() }];
}

export { controller };
