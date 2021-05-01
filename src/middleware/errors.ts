import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import config from "../config/config";
import { Env } from "../types/Env";
import { IError } from "../types/IError";
import ApiError from "../util/ApiError";
import { errorList } from "./../types/IError";
const logger = { error: (str: any) => console.log(str) };
export const errorConverter = (
  err: IError | ApiError,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode
      ? //   error.statusCode || error instanceof mongoose.Error // check if an error of the database.. not yet implement
        httpStatus.BAD_REQUEST
      : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || (httpStatus[statusCode] as string);
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!(err instanceof ApiError)) {
    throw new Error(errorList.NotApiError);
  }
  let { statusCode, message } = err;
  if (config.env === Env.PRODUCTION && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR] as string;
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === Env.DEVELOPMENT && { stack: err.stack }),
  };

  if (config.env === Env.DEVELOPMENT) {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};
