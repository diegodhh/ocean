import express from "express";
import jwt from "jsonwebtoken";
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
import { isJoiToTypescriptGenerator } from "./../../joi/schemas/auth.schemas";
import { AuthRoutes } from "./../../types/api/v1";
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

router.get(
  "/google/callback",

  passport.authenticate("google", {
    failureRedirect: `${APIvertion.V1}${V1Routes.AUTH}/google/failure`,
    session: false,
  }),

  (req, res) => {
    const { user } = <{ user: User }>(<unknown>req) || {};
    const token = user
      ? jwt.sign(JSON.parse(JSON.stringify(user)), config.jwt.secret)
      : null;
    res.cookie("token", token);
    res.cookie("test1", "test");
    res.redirect(`msrm42app://msrm42app.io?token=${token}&id=${user?.id}`);
  }
);

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
