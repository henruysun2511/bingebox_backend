import { IUser } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface User extends IUser {}

    interface Request {
      user?: User;
    }
  }
}

export { };

