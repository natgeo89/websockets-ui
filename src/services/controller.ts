import { db_getUserIds } from "../database/users";
// import { createGame } from "./game";
import { registUser } from "./register";
import { getRooms, createRoom, addToRoom } from "./room";
import { getWinners } from "./winners";

interface ProcessedReturn {
  // response: {
    type: string;
    data: unknown;
    clientIds: string[];
  // };
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
        addToRoom(userId, data.indexRoom),
        getRooms(),
      ];
      return add_user_to_room;
    }

    default:
      break;
  }

  return [{ type: "nothing", data: "", clientIds: db_getUserIds() }];
}

export { controller };
