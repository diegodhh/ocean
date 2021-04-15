import { Request } from "express";
import {
  Strategy as GoogleStrategy,
  Strategy,
  VerifyCallback,
} from "passport-google-oauth2";
import { User } from "../../../entity/User";
import { GoogleProfileSchema } from "../../../types/GoogleProfileSchema";
import { APIvertion, prefixes } from "../../../types/prefixes";

const googleStrategy: Strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.CLIENT_SECRET as string,
    callbackURL: `${process.env.DOMAIN}${APIvertion.v1}${prefixes.auth}/google/callback`,
    passReqToCallback: true,
  },

  async function (
    request: Request,
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

      console.log(request.cookies);

      done(null, user);
      console.log();
    } catch (err) {
      done(err, profile);
    }
  }
);

export default googleStrategy;
