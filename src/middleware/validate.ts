import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema, ValidationError } from "joi";
import ApiError from "../util/ApiError";
import pick from "../util/pick";
import { CustomApiErrors } from "./../types/errors/index";

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
    const validationErrors: Array<CustomApiErrors> = error.details?.map(
      (details) => CustomApiErrors[details.message as CustomApiErrors]
    );

    const errorMessages = error.details
      ?.map((details) => details.message)
      .join(",");

    next(new ApiError(httpStatus.BAD_REQUEST, errorMessages, validationErrors));
  }
  Object.assign(req, value);

  return next();
};

export default validate;
