export enum CustomApiErrors {
  DEFAULT = "DEFAULT",
  PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
  PASSWORD_NOT_DIVERSE = "PASSWORD_NOT_DIVERSE",
  USER_NOT_EXIST = "USER_NOT_EXIST",
  INCORRECT_EMAIL_OR_PASSWORD = "INCORRECT_EMAIL_OR_PASSWORD",
  USER_DOES_NOT_HAVE_PASSWORD = "USER_DOES_NOT_HAVE_PASSWORD",
}

export interface ErrorApiResponse {
  code: number;
  message: string;
  customErrorCodes?: CustomApiErrors[];
  stack?: any;
}
