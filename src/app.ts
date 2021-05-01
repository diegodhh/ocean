require("dotenv").config();

import express from "express";
import httpStatus from "http-status";
import "reflect-metadata";
import { errorConverter, errorHandler } from "./middleware/errors";
import v1Routes from "./routes/v1";
import { APIvertion } from "./types/api";
import ApiError from "./util/ApiError";
const app = express();
app.use(express.json());
app.get("/", (_req, res) => {
  res.send("Hello World!!!!!!!!!!");
});

app.get("/myapp", (_req, res) => {
  res.redirect("msrm42app://msrm42app.io?id=diego");
});
v1Routes.forEach((route) => {
  app.use(APIvertion.V1, route);
});

app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "not found"));
});
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
export default app;