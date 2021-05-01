import { CustomValidator } from "joi";

export const objectId: CustomValidator = (value, helpers) => {
  if (
    !value.match(
      "\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b"
    )
  ) {
    return helpers.message({ message: '"{{#label}}" must be a valid uuid' });
  }
  return value;
};

export const password: CustomValidator = (value, helpers) => {
  if (!(value.length >= 14 && value.length < 30)) {
    return helpers.error("password have betwenn 14 and 30 characters ");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.error(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};
