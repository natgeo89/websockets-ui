import { db_getGames } from "../database/games";
import { getUnshottedCell } from "../utils/utils";

import WebSocket from "ws";

export function createBot(botId: string): void {
  const BOT = new WebSocket(`ws://localhost:3000/?bot=${botId}`);

  BOT.on("message", (data) => {
    const parsedMessage = JSON.parse(data.toString());
    const parsedData = JSON.parse(parsedMessage.data);

    const game = db_getGames().find((game) => game.gameId === botId);

    if (!game) {
      return;
    }

    const unshotCell = getUnshottedCell(game.gameId, botId);

    if (unshotCell === null) {
      return [];
    }

    if (parsedMessage.type === "turn" && parsedData.currentPlayer === botId) {
      setTimeout(() => {
        BOT.send(
          JSON.stringify({
            type: "attack",
            data: JSON.stringify({
              gameId: game.gameId,
              indexPlayer: botId,
              x: unshotCell.x,
              y: unshotCell.y,
            }),
          })
        );
      }, 2000);
    }
  });
}
