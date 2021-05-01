import { ValidationError } from "joi";
import { EnvVarsSchema } from "../joi/schemas/EnvVarsSchema";
import { ITokenTypeExpiration } from "../types/ITokenTypeExpiration";
import { EnvVars } from "./../types/joi-interfaces/EnvVars";
import { tokenTypes } from "./../types/tokens";

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const { value: envVars, error } = <{ value: EnvVars; error: ValidationError }>(
  EnvVarsSchema.prefs({
    errors: { label: "key" },
  }).validate(process.env)
);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}
//for local config view ormconfig.ts when DATABASE_URL is not defined
export default {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  orm: {
    type: "postgres" as "postgres",
    databaseURL: envVars.DATABASE_URL,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    [tokenTypes.ACCESS]: <ITokenTypeExpiration>{
      expiration: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
      unit: "minutes",
    },
    [tokenTypes.REFRESH]: <ITokenTypeExpiration>{
      expiration: envVars.JWT_REFRESH_EXPIRATION_DAYS,
      unit: "days",
    },
    [tokenTypes.RESET_PASSWORD]: <ITokenTypeExpiration>{
      expiration: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
      unit: "minutes",
    },
    [tokenTypes.VERIFY_EMAIL]: <ITokenTypeExpiration>{
      expiration: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
      unit: "minutes",
    },
  },
  googleStrategy: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  //   email: {
  //     smtp: {
  //       host: envVars.SMTP_HOST,
  //       port: envVars.SMTP_PORT,
  //       auth: {
  //         user: envVars.SMTP_USERNAME,
  //         pass: envVars.SMTP_PASSWORD,
  //       },
  //     },
  //     from: envVars.EMAIL_FROM,
  //   },
};
