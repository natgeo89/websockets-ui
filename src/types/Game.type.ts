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
  }[];
}

// {
//   type: "add_ships",
//   data:
//       {
//           gameId: <number | string>,
//           ships:
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
//           indexPlayer: <number | string>, /* id of the player in the current game session */
//       },
//   id: 0,
// }
