import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema, ValidationError } from "joi";
import ApiError from "../util/ApiError";
import pick from "../util/pick";

const validate = <T>(schema: ObjectSchema) => (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const filterReq = pick(req, ["params", "query", "body"], true);
  const { value, error } = <{ value: T; error: ValidationError }>schema
    .prefs({
      errors: { label: "key" },
    })
    .validate(filterReq);
  if (error) {
    const errorMessage = error.details
      .map((details) => details.message)
      .join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
