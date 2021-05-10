import Joi from "joi";
import { custom } from "./custom.validation";
export const isJoiToTypescriptGenerator = !process.env.NODE_ENV;
function JoyToTypescriptAdapter(
  realSchema: Joi.Schema,
  interfaceSchema: Joi.Schema
): Joi.Schema {
  if (isJoiToTypescriptGenerator) {
    return interfaceSchema;
  } else {
    return realSchema;
  }
}
export const SignUp = Joi.object()
  .keys({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: JoyToTypescriptAdapter(
          custom.customPassword(),
          Joi.string().required()
        ),
        firstName: Joi.string().max(100).min(1).required(),
        lastName: Joi.string().max(100),
        googleId: Joi.string(),
        phone: Joi.string(),
      })
      .required(),
  })
  .label("SignUpBody");

export const Login = Joi.object({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: JoyToTypescriptAdapter(
      custom.customPassword(),
      Joi.string().required()
    ),
  }).required(),
}).label("LoginBody");

export const refreshToken = Joi.object({
  body: Joi.object()
    .keys({
      refreshToken: Joi.string().required(),
    })
    .required(),
}).label("RefreshTokenBody");
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
