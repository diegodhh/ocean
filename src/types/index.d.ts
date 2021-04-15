import { GoogleProfileSchema } from "./GoogleProfileSchema";
import { IUserRequest } from "./IUserRequest";

export default { GoogleProfileSchema, IUserRequest };

declare module expect {
  interface Matchers<R> {
    toBeInstanceOfApiError(statusCode?: number, message?: string): R;
  }
}
