export interface Ship {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: "small" | "medium" | "large" | "huge";
}

export interface DB_Game {
  gameId: number | string;
  players: {
    playerId: string;
    ships: Ship[]
    shotCells: {
      x: number;
      y: number;
    }[]
  }[];
  turnId?: string;
}
