import { db_getGame } from "../database/games";
import { DB_Game, Position } from "../types/Game.type";

const ALL_BOARD_CELLS: Position[] = [];

for (let i = 0; i < 10; i++) {
  for (let k = 0; k < 10; k++) {
    ALL_BOARD_CELLS.push({ x: i, y: k });
  }
}

export function getKilledCells(killedShipCells: Position[]): {
  missedCells: Position[];
  killedCells: Position[];
} {
  const cellsAroundShip: Position[] = [];

  for (const { x, y } of killedShipCells) {
    cellsAroundShip.push({ x: x + 1, y: y });
    cellsAroundShip.push({ x: x - 1, y: y });

    cellsAroundShip.push({ x: x, y: y + 1 });
    cellsAroundShip.push({ x: x, y: y - 1 });

    cellsAroundShip.push({ x: x + 1, y: y - 1 });
    cellsAroundShip.push({ x: x + 1, y: y + 1 });

    cellsAroundShip.push({ x: x - 1, y: y - 1 });
    cellsAroundShip.push({ x: x - 1, y: y + 1 });
  }

  const filteredCells = cellsAroundShip
    .filter(({ x, y }) => {
      if (x < 0 || y < 0 || x > 9 || y > 9) {
        return false;
      }
      return true;
    })
    .filter(
      ({ x, y }) =>
        !killedShipCells.find((killed) => killed.x === x && killed.y === y)
    );

  const uniqMissedCells: Position[] = [];

  for (const { x, y } of filteredCells) {
    const exist = uniqMissedCells.find(
      (missed) => missed.x === x && missed.y === y
    );

    if (!exist) {
      uniqMissedCells.push({ x, y });
    }
  }

  return {
    killedCells: killedShipCells,
    missedCells: uniqMissedCells,
  };
}

export function getUnshottedCell(
  gameId: string,
  playerId: string
): Position | null {
  const game = db_getGame(gameId);

  if (game === null) return null;

  const player = game.players.find((player) => player.playerId === playerId);

  if (!player) return null;

  const unshotedCells = ALL_BOARD_CELLS.filter(
    ({ x, y }) => !player.shotCells.has(`${x}:${y}`)
  );

  return unshotedCells[Math.floor(Math.random() * unshotedCells.length)];
}
