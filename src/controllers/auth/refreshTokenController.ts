import httpStatus from "http-status";
import { SessionUser } from "../../redis/SessionUser";
import { LoginSuccess } from "../../routes/v1/auth.routes";
import { generateToken, verifyToken } from "../../services/token.service";
import { CustomApiErrors } from "../../types/errors/index";
import { RefreshTokenBody } from "../../types/joi-interfaces/auth.schemas";
import { MiddlewareFn } from "../../types/MiddlewareFn";
import { tokenTypes } from "../../types/tokens";
import ApiError from "../../util/ApiError";

export const refreshTokenController: MiddlewareFn = async (req, res) => {
  // key exists already validated
  const { body } = (req as unknown) as RefreshTokenBody;
  const [payload, err] = await verifyToken(
    body.refreshToken,
    tokenTypes.REFRESH
  );
  if (err) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "The token is invalid you have to sign in again",
      [CustomApiErrors.INVALID_TOKEN]
    );
  }
  if (payload) {
    req.sessionUser = new SessionUser(req.redis!, payload?.sub);
    const isValid = await req.sessionUser.isTokenWhisteListed(
      body.refreshToken
    );
    if (!isValid) {
      await req.sessionUser.delete(["refreshToken"]);
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "The refresh token have already expired",
        [CustomApiErrors.INVALID_TOKEN]
      );
    }
    const refreshToken = await generateToken(payload?.sub, tokenTypes.REFRESH);
    const accessToken = await generateToken(payload?.sub, tokenTypes.ACCESS);
    await req.sessionUser.set({ refreshToken });
    const response: LoginSuccess = { refreshToken, accessToken };
    res.json(response);
  }
};
