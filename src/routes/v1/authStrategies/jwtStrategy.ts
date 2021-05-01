import {
  ExtractJwt,
  Strategy as JwtStrategy,
  VerifyCallback,
} from "passport-jwt";
import config from "../../../config/config";
import { User } from "../../../entity/User";
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

    const user = await User.findOne({ id: payload.sub });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
