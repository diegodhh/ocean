import { NextFunction, Request, Response, Send } from "express";
import httpStatus from "http-status";
import { IError } from "../types/IError";
import ApiError from "../util/ApiError";
import "./../jestUtils/customMatchers";
import { errorList } from "./../types/IError";
import { errorConverter, errorHandler } from "./errors";

type ErrorMiddleWareWithPartials = (
  err: IError | ApiError,
  _req: Partial<Request>,
  _res: Partial<Response>,
  next: NextFunction
) => void;

describe("Test error converter middleware", () => {
  test("It should return the same error cause is alreadey an apiError", () => {
    const req = {} as Request;
    const res = {} as Response;
    const mockNextFunc = jest.fn((a) => a);
    const notFoundApiError = new ApiError(httpStatus.NOT_FOUND, "notFound");
    errorConverter(notFoundApiError, req, res, mockNextFunc);
    expect(mockNextFunc.mock.calls.length).toBe(1);
    expect(mockNextFunc).toBeCalledWith(notFoundApiError);
    expect(mockNextFunc).toBeCalledWith(
      expect.toBeInstanceOfApiError(httpStatus.NOT_FOUND)
    );
  });

  test("Should convert the object to ApiError with internal server error code 500", () => {
    const req = {} as Request;
    const res = {} as Response;
    const mockNextFunc = jest.fn((a) => a);
    const genericError = new Error();
    errorConverter(genericError, req, res, mockNextFunc);
    expect(httpStatus.INTERNAL_SERVER_ERROR).toBe(500);
    expect(mockNextFunc.mock.calls.length).toBe(1);
    expect(mockNextFunc).toBeCalledWith(
      expect.toBeInstanceOfApiError(httpStatus.INTERNAL_SERVER_ERROR)
    );
  });
});
describe(" error handler test suite", () => {
  test("If Error is no instance of ApiError waht should do", () => {
    const req = {} as Request;
    const res: Partial<Response> = { locals: {} };

    res.send = jest.fn((message) => {
      console.log(`mock send ${message}`);
      return res;
    }) as Send;

    res.status = jest.fn((statusCode) => {
      console.log(`mock!! set status ${statusCode}`);
      return res as Response;
    });
    const genericError = new Error();
    expect(() =>
      errorHandler(
        genericError as ApiError,
        req,
        res as Response,
        () => undefined
      )
    ).toThrow(new Error(errorList.NotApiError));
  });
  // test("If Error doesn't have status code should return ApiError with badrequest", () => {
  //   const req = {} as Request;
  //   const res: Partial<Response> = { locals: {} };

  //   res.send = jest.fn((message) => {
  //     console.log(`mock send ${message}`);
  //     return res;
  //   }) as Send;

  //   res.status = jest.fn((statusCode) => {
  //     console.log(`mock set status ${statusCode}`);
  //     return res as Response;
  //   });

  //   const genericError = new Error();
  //   expect(httpStatus.BAD_REQUEST).toBe(400);
  //   errorHandler(genericError, req, res, () => undefined);
  //   expect((res.send as jest.Mock).mock.calls.length).toBe(1);
  //   expect(res.status).toBeCalledWith(
  //     expect.toBeInstanceOfApiError(httpStatus.BAD_REQUEST)
  //   );
  // });
});
