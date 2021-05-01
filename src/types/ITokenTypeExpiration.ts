import { unitOfTime } from "moment-mini";

export interface ITokenTypeExpiration {
  unit: unitOfTime.Base;
  expiration: number;
}
