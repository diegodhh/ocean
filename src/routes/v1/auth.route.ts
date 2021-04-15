import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../../entity/User";
import auth from "../../middleware/auth";
import { APIvertion, prefixes } from "./../../types/prefixes";
import passport from "./passport";
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
    failureRedirect: `${APIvertion.v1}${prefixes.auth}/google/failure`,
    session: false,
  }),

  (req, res) => {
    const { user } = <{ user: User }>(<unknown>req) || {};
    const token = user
      ? jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_SECRET!)
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
router.get("/me", auth, (req, res) => {
  res.send(req.user);
});
export default routerWrapper.use(prefixes.auth, router);
