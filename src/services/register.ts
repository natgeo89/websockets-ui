import { db_createUser } from "../database/users";
import { DB_User } from "../types/User.type";

interface RegistrationReturn {
  type: "reg";
  data: DB_User & {
    error: boolean;
    errorText: string;
  };
  clientIds: string[];
}

export function registUser(userId: string, creds: {
  name: string;
  password: string;
}): RegistrationReturn {
  const user = db_createUser(userId, creds);

  return {
    type: "reg",
    data: {
      name: user.name,
      index: user.index,
      error: false,
      errorText: "",
    },
    clientIds: [user.index]
  };
}
