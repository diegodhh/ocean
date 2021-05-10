import Joi, { Root } from "joi";
import { CustomApiErrors } from "../../types/errors";

// export const objectId: CustomValidator = (value, helpers) => {
//   if (
//     !value.match(
//       "\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b"
//     )
//   ) {
//     return helpers.message({ message: '"{{#label}}" must be a valid uuid' });
//   }
//   return value;
// };

///// if you change the passwordType, also you are changing this interface
interface CustomJoi extends Root {
  customPassword: () => any;
}
const passwordType: string = "customPassword";
////
const prefix = (error: string) => `${passwordType}.${error}`;
const passwordErrors = {
  short: prefix("short"),
  big: prefix("big"),
  diverse: prefix("diverse"),
};
export const custom: CustomJoi = Joi.extend((joi) => {
  return {
    type: passwordType,
    base: joi.any(),
    messages: {
      [passwordErrors.short!]: CustomApiErrors.PASSWORD_TOO_SHORT,
      [passwordErrors.big!]: "{{#label}} must be at least five customPasswords",
      [passwordErrors.diverse!]: CustomApiErrors.PASSWORD_NOT_DIVERSE,
    },
    validate(value, helpers) {
      // Base validation regardless of the rules applied
      if (!(value.length >= 14 && value.length < 30)) {
        return { value, errors: helpers.error(passwordErrors.short) };
      }
      if (!(value.length >= 14 && value.length < 30)) {
        return { value, errors: helpers.error(passwordErrors.big) };
      }
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return { value, errors: helpers.error(passwordErrors.diverse) };
      }
      // Check flags for global state
    },
  };
});
