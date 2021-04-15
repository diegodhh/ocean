import { Request } from "express";
import httpStatus from "http-status";
import passport from "passport";
import ApiError from "../util/ApiError";
import { MiddlewareFn } from "./../types/MiddlewareFn";
const verifyCallback: (
  req: Request,
  resolve: (value?: unknown) => void,
  reject: (reason?: any) => void
) => (...args: any[]) => any = (req, resolve, reject) => async (
  err,
  user,
  info
) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  req.user = user;

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
