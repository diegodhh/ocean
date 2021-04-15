require("dotenv").config();

import express, { NextFunction, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import "reflect-metadata";
import { errorConverter, errorHandler } from "./middleware/errors";
import v1Routes from "./routes/v1";
import { IUserRequest } from "./types/IUserRequest";
import { APIvertion } from "./types/prefixes";
import ApiError from "./util/ApiError";
const app = express();
function verifytoken(req: IUserRequest, res: Response, next: NextFunction) {
  const bearerheader = req.headers["authorization"];

  if (bearerheader) {
    const bearer = bearerheader.split(" ");
    const bearertoken = bearer[1];
    req.token = bearertoken;
    jwt.verify(bearertoken, process.env.jwt_secret!, (err, token) => {
      if (err) {
        res.status(403).send("no autorizadoa");
      }
    });
    next();
  } else {
    // forbidden
  }
}

app.get("/", (_req, res) => {
  res.send("Hello World!!!!!!!!!!");
});

app.get("/myapp", (_req, res) => {
  res.redirect("msrm42app://msrm42app.io?id=diego");
});
v1Routes.forEach((route) => {
  app.use(APIvertion.v1, route);
});

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "not found"));
});
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
export default app;
