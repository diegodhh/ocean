import { MiddlewareFn } from "../types/MiddlewareFn";

const catchAsync: (fn: MiddlewareFn) => MiddlewareFn = (fn) => (
  req,
  res,
  next
) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
