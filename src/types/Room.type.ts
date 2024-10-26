import { DB_User } from "./User.type";

export interface DB_Room {
  roomId: number | string;
  roomUsers: DB_User[];
}



// {
//   type: "update_winners",
//   data:
//       [
//           {
//               name: <string>,
//               wins: <number>,
//           }
//       ],
//   id: 0,
// }
