import httpStatus from "http-status";
import passport from "passport";
import { SessionUser } from "../redis/SessionUser";
import ApiError from "../util/ApiError";
import { MiddlewareFn } from "./../types/MiddlewareFn";
const verifyCallback: (
  req: Express.Request,
  resolve: (value?: unknown) => void,
  reject: (reason?: any) => void
) => (...args: any[]) => any = (
  req: Express.Request,
  resolve,
  reject
) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }

  req.user = user;
  if (!req.user || !user.id) {
    throw new Error("not id");
  }
  if (!req.redis) {
    throw new Error("redis is not in req");
  }

  req.sessionUser = new SessionUser(req.redis, user.id);

  resolve();
};

const auth: MiddlewareFn = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate(
      "jwt",
      { session: false },
      verifyCallback(req, resolve, reject)
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

export default auth;
