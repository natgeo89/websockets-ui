import { db_addGame, db_getGame, db_getGames } from "../database/games";
import { Ship } from "../types/Game.type";

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
}): (StartGameReturn | TurnReturn)[] {
  const games = db_getGames();
  const game = games.find((game) => game.gameId === gameId);

  if (!game) {
    db_addGame({ gameId, players: [{ playerId, ships, shotCells: [] }] });

    return [];
  }

  game.players.push({ playerId, ships, shotCells: [] });

  const playersIds = game.players.map(({ playerId }) => playerId);

  return [
    ...game.players.map((player) => startGame(player.playerId, player.ships)),
    turn(playersIds, playersIds[0]),
  ];
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

interface TurnReturn {
  type: "turn";
  data: {
    currentPlayer: string;
  };
  clientIds: string[];
}

function turn(playerIds: string[], turnPlayerId: string): TurnReturn {
  return {
    type: "turn",
    data: {
      currentPlayer: turnPlayerId,
    },
    clientIds: playerIds,
  };
}

interface AttackReturn {
  type: "attack";
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: string /* id of the player in the current game session */;
    status: "miss" | "killed" | "shot";
  };
  clientIds: string[];
}

export function attack({
  gameId,
  fromPlayerId,
  x,
  y,
}: {
  gameId: string;
  fromPlayerId: string;
  x: number;
  y: number;
}): (AttackReturn | TurnReturn)[] {
  const game = db_getGame(gameId);

  if (game === null) return [];

  if (game.turnId !== undefined && game.turnId !== fromPlayerId) return [];

  const gamePlayerIds = game.players.map(({ playerId }) => playerId);
  const player = game.players.find(({ playerId }) => playerId === fromPlayerId);

  const isCellAlreadyShoted = player.shotCells.find(
    (shotted) => shotted.x === x && shotted.y === y
  );

  if (isCellAlreadyShoted) {
    return [turn(gamePlayerIds, fromPlayerId)];
  }

  player.shotCells.push({ x, y });

  const enemy = game.players.find(({ playerId }) => playerId !== fromPlayerId);

  const enemyShipsPositions = enemy.ships.map(
    ({ direction, position, length }) =>
      Array.from(Array(length)).map((_, index) => ({
        x: direction ? position.x : position.x + index,
        y: direction ? position.y + index : position.y,
      }))
  );

  const shottedShip = enemyShipsPositions.find((shipPositions) =>
    shipPositions.find(
      (shipPosition) => shipPosition.x === x && shipPosition.y === y
    )
  );

  const killedShip = shottedShip?.every(({ x, y }) =>
    player.shotCells.find((cell) => cell.x === x && cell.y === y)
  );

  let status: "miss" | "shot" | "killed" = "miss";

  if (shottedShip) {
    status = "shot";
  }

  let attackReturn: AttackReturn[] = [
    {
      type: "attack",
      data: {
        currentPlayer: fromPlayerId,
        position: {
          x,
          y,
        },
        status,
      },
      clientIds: gamePlayerIds,
    },
  ];

  if (killedShip) {
    status = "killed";

    attackReturn = shottedShip.map((ship) => ({
      type: "attack",
      data: {
        currentPlayer: fromPlayerId,
        position: { x: ship.x, y: ship.y },
        status: "killed",
      },
      clientIds: gamePlayerIds,
    }));
  }

  const turnPlayerId = shottedShip ? fromPlayerId : enemy.playerId;

  game.turnId = turnPlayerId;

  return [...attackReturn, turn(gamePlayerIds, turnPlayerId)];
}
