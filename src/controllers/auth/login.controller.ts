import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { User } from "../../entity/User";
import { LoginSuccess } from "../../routes/v1/auth.routes";
import { generateToken } from "../../services/token.service";
import { CustomApiErrors } from "../../types/errors";
import { MiddlewareFn } from "../../types/MiddlewareFn";
import { tokenTypes } from "../../types/tokens";
import ApiError from "../../util/ApiError";
import { SessionUser } from "./../../redis/SessionUser";
import { LoginBody } from "./../../types/joi-interfaces/auth.schemas";

export const loginController: MiddlewareFn = async (req, res) => {
  const { body } = (req as unknown) as LoginBody;
  const { password, email } = body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "The user does not exist", [
      CustomApiErrors.USER_NOT_EXIST,
    ]);
  }
  if (!user.password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "this user doesn't have password, try to login with google",
      [CustomApiErrors.USER_DOES_NOT_HAVE_PASSWORD]
    );
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "The password or the email are incorrect",
      [CustomApiErrors.INCORRECT_EMAIL_OR_PASSWORD]
    );
  }
  const accessToken = await generateToken(user.id, tokenTypes.ACCESS);
  const refreshToken = await generateToken(user.id, tokenTypes.REFRESH);
  const data: LoginSuccess = { accessToken, refreshToken };
  new SessionUser(req.redis!, user.id).set({ refreshToken });
  res.status(httpStatus.OK).send(data);
};
