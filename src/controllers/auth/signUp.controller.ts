import httpStatus from "http-status";
import { User } from "../../entity/User";
import { CustomApiErrors } from "../../types/errors";
import { SignUpBody } from "../../types/joi-interfaces";
import { MiddlewareFn } from "../../types/MiddlewareFn";
import ApiError from "../../util/ApiError";

export const signUpController: MiddlewareFn = async (req, res) => {
  const { body: userData } = (req as unknown) as SignUpBody;
  const { email } = userData;

  const alreadyExistingUser = await User.findOne({ email });
  if (alreadyExistingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User already exists", [
      CustomApiErrors.USER_ALREADY_EXIST,
    ]);
  }
  const user = await User.create(userData).save();
  res.status(200).send({ user });
};
