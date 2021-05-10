import { Request } from "express";
import {
  Strategy as GoogleStrategy,
  Strategy,
  VerifyCallback,
} from "passport-google-oauth2";
import config from "../../../config/config";
import { User } from "../../../entity/User";
import { APIvertion } from "../../../types/api";
import { V1Routes } from "../../../types/api/v1";
import { GoogleProfileSchema } from "../../../types/GoogleProfileSchema";

const googleStrategy: Strategy = new GoogleStrategy(
  {
    clientID: config.googleStrategy.clientID!,
    clientSecret: config.googleStrategy.clientSecret!,
    callbackURL: `${process.env.DOMAIN}${APIvertion.V1}${V1Routes.AUTH}/google/callback`,
    passReqToCallback: true,
  },

  async function (
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: GoogleProfileSchema,
    done: VerifyCallback
  ) {
    try {
      let user;
      user = await User.findOne({ googleId: profile.id });

      if (!user) {
        const { id, family_name, given_name, email } = profile;
        user = await User.create({
          googleId: id,
          firstName: given_name,
          lastName: family_name,
          email: email,
        }).save();
      }

      done(null, user);
    } catch (err) {
      done(err, profile);
    }
  }
);

export default googleStrategy;
