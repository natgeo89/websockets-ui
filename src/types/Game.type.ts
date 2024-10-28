export interface Position {
  x: number;
  y: number;
}

export interface Ship {
  position: Position;
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface DB_Game {
  gameId: string;
  players: {
    playerId: string;
    ships: Ship[];
    shotCells: Set<`${number}:${number}`>
  }[];
  turnId?: string;
}
