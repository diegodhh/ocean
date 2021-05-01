export interface IError {
  statusCode?: number;
  name: string;
  message: string;
  stack?: string;
}

export enum errorList {
  NotApiError = "Error was not previusly converted",
}
