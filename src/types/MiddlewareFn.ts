import { NextFunction, Response } from "express";

export type MiddlewareFn = (
  req: Express.Request,
  res: Response,
  next: NextFunction
) => void;
