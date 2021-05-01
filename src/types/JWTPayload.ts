import { tokenTypes } from "./tokens";

export type JWTPayload = {
  sub: string;
  iat: number;
  exp: number;
  type: tokenTypes;
};
