import express from "express";
import config from "../../config/config";
import {
  loginController,
  refreshTokenController,
  signUpController,
} from "../../controllers/auth";
import { User } from "../../entity/User";
import * as authSchema from "../../joi/schemas/auth.schemas";
import auth from "../../middleware/auth";
import authLimiter from "../../middleware/rateLimiter";
import validate from "../../middleware/validate";
import { APIvertion } from "../../types/api";
import { V1Routes } from "../../types/api/v1";
import { Env } from "../../types/Env";
import { tokenTypes } from "../../types/tokens";
import { isJoiToTypescriptGenerator } from "./../../joi/schemas/auth.schemas";
import { SessionUser } from "./../../redis/SessionUser";
import { generateToken } from "./../../services/token.service";
import { AuthRoutes } from "./../../types/api/v1";
import { MiddlewareFn } from "./../../types/MiddlewareFn";
import passport from "./passport";
export type LoginSuccess = {
  accessToken: string;
  refreshToken: string;
};

const router = express.Router();
const routerWrapper = express.Router();
if (isJoiToTypescriptGenerator) {
  throw new Error("custom validator are failing");
}
router.use(authLimiter);

router.get("/google/success", (req, res) => {
  return res.redirect(200, "msrm42app://msrm42app.io?id=" + 1234);
});

router.get("/google/failure", (_req, res) => res.send("error"));

router.get(
  "/google",

  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

const googleToJWT: MiddlewareFn = async (req, res) => {
  const { user } = <{ user: User }>(<unknown>req) || {};
  const refreshToken = user
    ? await generateToken(user.id, tokenTypes.REFRESH)
    : null;
  if (!refreshToken) {
    throw new Error("no token something bad happen");
  }
  await new SessionUser(req.redis!, user.id).set({ refreshToken });
  res.redirect(
    `msrm42app://msrm42app.io?refreshToken=${refreshToken}&id=${user?.id}`
  );
};
router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: `${APIvertion.V1}${V1Routes.AUTH}/google/failure`,
    session: false,
  }),

  googleToJWT
);
//only for test
if (config.env === Env.TEST) {
  router.get("/google/callback/test", auth, googleToJWT);
}
router.get("/logout", function (req, res) {
  req.logout();
  res.send("logout");
});
router.get(`${AuthRoutes.ME}`, auth, (req, res) => {
  res.send(req.user);
});
router.post(
  `${AuthRoutes.REFRESH_TOKEN}`,
  validate(authSchema.refreshToken),
  refreshTokenController
);
router.post(`${AuthRoutes.LOGIN}`, validate(authSchema.Login), loginController);

router.post(
  `${AuthRoutes.SIGNUP}`,
  validate(authSchema.SignUp),
  signUpController
);
export default routerWrapper.use(V1Routes.AUTH, router);
