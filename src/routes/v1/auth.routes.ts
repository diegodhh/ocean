import express from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { User } from "../../entity/User";
import { LoginSchema } from "../../joi/schemas/auth.schemas";
import auth from "../../middleware/auth";
import validate from "../../middleware/validate";
import { APIvertion } from "../../types/api";
import { AuthRoutes, V1Routes } from "../../types/api/v1";
import ApiError from "../../util/ApiError";
import { loginController } from "./../../controllers/LoginController";
import {} from "./../../joi/schemas/auth.schemas";
import passport from "./passport";

export type LoginSuccess = {
  accessToken: string;
  refreshToken: string;
};
const router = express.Router();
const routerWrapper = express.Router();
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
router.post(`${AuthRoutes.LOGIN}`, validate(LoginSchema), loginController);

router.post(`${AuthRoutes.SIGNUP}`, (req, res) => {
  throw new ApiError(
    httpStatus.BAD_REQUEST,
    "the password or email is invalid"
  );
});
export default routerWrapper.use(V1Routes.AUTH, router);
