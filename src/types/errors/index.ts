import httpStatus from "http-status";

interface ApiErrorInfo {
  code: number;
  message: string;
}

export const customApiErrors = {
  wrongPassword: <ApiErrorInfo>{
    code: httpStatus.BAD_REQUEST,
    message: "the password or email is invalid",
  },
};
