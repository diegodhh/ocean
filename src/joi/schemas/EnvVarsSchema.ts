import Joi from "joi";
import { Env } from "../../types/Env";

export const EnvVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid(Env.PRODUCTION, Env.DEVELOPMENT, Env.TEST)
      .required(),
    PORT: Joi.number().default(3000),
    REDIS_URL: Joi.when("NODE_ENV", {
      is: Env.PRODUCTION,
      then: Joi.string()
        .required()
        .description("DATABASE_URL is undefined and requeried on production"),
      otherwise: Joi.string(),
    }),
    DATABASE_URL: Joi.when("NODE_ENV", {
      is: Env.PRODUCTION,
      then: Joi.string()
        .required()
        .description("DATABASE_URL is undefined and requeried on production"),
      otherwise: Joi.string(),
    }),

    GOOGLE_CLIENT_ID: Joi.string().required().description("google client id"),
    CLIENT_SECRET: Joi.string()
      .required()
      .description("google client secret is missing"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),

    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description("days after which refresh tokens expire"),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which reset password token expires"),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description("minutes after which verify email token expires"),
    // SMTP_HOST: Joi.string().description("server that will send the emails"),
    // SMTP_PORT: Joi.number().description("port to connect to the email server"),
    // SMTP_USERNAME: Joi.string().description("username for email server"),
    // SMTP_PASSWORD: Joi.string().description("password for email server"),
    // EMAIL_FROM: Joi.string().description(
    //   "the from field in the emails sent by the app"
    // ),
  })
  .unknown()
  .label("EnvVars");
