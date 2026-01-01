import { IUser } from "./object.type";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

export { };

