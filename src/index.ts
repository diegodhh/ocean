require("dotenv").config();
import express, { Application, NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import ormconfig from "./ormconfig";
import passport from "./passport";
const app = express();
async function main(app: Application): Promise<Application> {
  try {
    let conn;

    conn = await createConnection(ormconfig);
    console.log(conn);
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
    res.redirect(301, "msrm42app://msrm42app.io/");
  });

  app.get(
    "/auth/google/success",
    (_req, res) => res.send("exito")
    // res.redirect("msrm42app://msrm42app.io?id=" + 123456)
  );

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
      successRedirect: "/auth/google/success",
      failureRedirect: "/auth/google/failure",
      session: false,
    })
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
