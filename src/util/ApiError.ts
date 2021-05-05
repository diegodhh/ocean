import { CustomApiErrors } from "./../types/errors/index";

export default class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string | undefined,
    public customErrorCodes?: Array<CustomApiErrors>,
    public isOperational: boolean = true,
    stack = ""
  ) {
    super(message);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
