import ApiError from "../util/ApiError";

export {};
declare global {
  namespace jest {
    type toBeInstanceOfApiError = (
      statusCode?: number,
      message?: string
    ) => CustomMatcherResult;
    interface Expect {
      toBeInstanceOfApiError: toBeInstanceOfApiError;
    }
    interface Matchers<R> {
      toBeInstanceOfApiError(
        statusCode?: number,
        message?: string
      ): CustomMatcherResult;
    }
  }
}

expect.extend({
  toBeInstanceOfApiError(
    received: ApiError | Error,
    statusCode: number,
    message: string
  ) {
    let pass = received instanceof ApiError;
    if (!pass) {
      return {
        message: () =>
          `expected error to be instance of ApiError and is intance of ${"received?.contructor"}`,
        pass: false,
      };
    }
    const rStatusCode = (received as ApiError).statusCode;
    if (statusCode && statusCode !== rStatusCode) {
      return {
        message: () =>
          `expected ApiError to has statusCode ${rStatusCode} but be ${statusCode}`,
        pass: false,
      };
    }

    const rMessage = (received as ApiError).message;

    if (message && message.indexOf(rMessage) !== -1) {
      return {
        message: () =>
          `expected ApiError to contain ${rMessage} but be ${message}`,
        pass: false,
      };
    }
    return {
      message: () => `the object  error fit the despcription`,
      pass: true,
    };
  },
});
