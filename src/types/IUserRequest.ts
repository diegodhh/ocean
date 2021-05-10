import { RedisClient } from "redis";
import { User } from "../entity/User";
import { SessionUser } from "../redis/SessionUser";

export interface IUserRequest {
  user?: User;
  token?: string;
  redis?: RedisClient;
  sessionUser?: SessionUser;
}

declare global {
  namespace Express {
    export interface Request extends IUserRequest {}
  }
}
