export interface IError {
  statusCode?: number;
  name: string;
  message: string;
  stack?: string;
}
