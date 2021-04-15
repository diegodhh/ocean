import { NextFunction, Request } from "express";
import httpStatus from "http-status";
import { IError } from "../types/IError";
import ApiError from "../util/ApiError";
import "./customMatchers";
import { errorConverter } from "./errors";

expect.extend({
  toBeInstanceOfApiError(received, statusCode?, message?) {
    let pass = received instanceof ApiError;
    if (statusCode) {
      pass = pass || statusCode === received?.statusCode;
    }

    if (pass) {
      return {
        message: () => `expected ${received} to be instance of ApiError`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be instance of ApiError`,
        pass: false,
      };
    }
  },
});
export {};

type ErrorMiddleWareWithPartials = (
  err: IError | ApiError,
  _req: Partial<Request>,
  _res: Partial<Response>,
  next: NextFunction
) => void;
const castErrorConverter: ErrorMiddleWareWithPartials = (errorConverter as unknown) as ErrorMiddleWareWithPartials;
describe("Test error converte middleware", () => {
  test("It should return the same error cause is alreadey an apiError", () => {
    const req = {} as Request;
    const res = {} as Response;
    const mockNextFunc = jest.fn((a) => a);
    const notFoundApiError = new ApiError(httpStatus.NOT_FOUND, "notFound");
    castErrorConverter(notFoundApiError, req, res, mockNextFunc);
    expect(mockNextFunc.mock.calls.length).toBe(1);
    expect(mockNextFunc).toBeCalledWith(notFoundApiError);
    expect(mockNextFunc).toBeCalledWith(expect.toBeInstanceOfApiError);
  });
  test("Should conver object to ApiError", () => {
    const req = {} as Request;
    const res = {} as Response;
    const mockNextFunc = jest.fn((a) => a);
    const genericError = new Error();
    castErrorConverter(genericError, req, res, mockNextFunc);
    expect(mockNextFunc.mock.calls.length).toBe(1);
    expect(mockNextFunc).toBeCalledWith(
      (expect as any).toBeInstanceOfApiError()
    );
  });
});
