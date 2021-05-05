import Joi from "joi";
import { custom } from "./custom.validation";
export const RegisterSchema = Joi.object()
  .keys({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: custom.customPassword(),
      name: Joi.string().required(),
    }),
  })
  .label("Register");

export const LoginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .messages({ "number.base": "abarajame la  ba;era" }),
    password: custom.customPassword(),
  }).required(),
}).label("Login");

// export const logout = {
//   body: Joi.object().keys({
//     refreshToken: Joi.string().required(),
//   }),
// };

// export const refreshTokens = {
//   body: Joi.object().keys({
//     refreshToken: Joi.string().required(),
//   }),
// };

// export const forgotPassword = {
//   body: Joi.object().keys({
//     email: Joi.string().email().required(),
//   }),
// };

// export const resetPassword = Joi.object({
//   query: Joi.object().keys({
//     token: Joi.string().required(),
//   }),
//   body: Joi.object().keys({
//     password: Joi.string().required().custom(password),
//   }),
// });

// export const verifyEmail = Joi.object({
//   query: Joi.object().keys({
//     token: Joi.string().required(),
//   }),
// });
