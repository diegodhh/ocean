import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifyCallback,
} from "passport-jwt";
import config from "../../../config/config";
import { tokenTypes } from "../../../types/tokens";

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error("Invalid token type");
    }

    done(null, { id: payload.sub });
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
