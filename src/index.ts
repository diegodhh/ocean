require("dotenv").config();
import express, { Application, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import "reflect-metadata";
import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";
import passport from "./passport";
const app = express();

async function main(app: Application): Promise<Application> {
  try {
    let conn;

    conn = await createConnection(ormconfig);
    if (process.env.NODE_ENV === "production") {
    }
    //coment
  } catch (err) {
    console.log(err);
  }

  const log = () => {
    return (_req: Request, res: Response, next: NextFunction) => {
      next();
    };
  };

  app.use(passport.initialize());

  app.get("/", (_req, res) => {
    res.send("Hello World!!!!!!!!!!");
  });

  app.get("/myapp", (_req, res) => {
    res.redirect("msrm42app://msrm42app.io?id=diego");
  });

  app.get("/auth/google/success", (req, res) => {
    return res.redirect("msrm42app://msrm42app.io?id=" + 1234);
  });

  app.get("/auth/google/failure", (_req, res) => res.send("error"));

  app.get(
    "/auth/google",

    passport.authenticate("google", {
      scope: ["email", "profile"],
      session: false,
    })
  );

  app.get(
    "/auth/google/callback",

    passport.authenticate("google", {
      failureRedirect: "/auth/google/failure",
      session: false,
    }),
    (req, res) => {
      const token = req.user
        ? jwt.sign(
            JSON.parse(JSON.stringify(req.user)),
            process.env.JWT_SECRET!
          )
        : null;
      res.cookie("token", token);
      res.redirect(301, "msm42app://msrm42app.io?id=");
    }
  );

  app.get("/logout", function (req, res) {
    req.logout();
    res.send("logout");
  });

  app.use(log());

  if (process.env.NODE_ENV !== "test") {
    await app.listen(process.env.PORT);
  }
  return app;
}

export default main(app);
