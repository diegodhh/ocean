interface GoogleProfileSchema {
  id: string;
  displayName: string;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

import { Request } from "express";
import passport from "passport";
// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from "passport-google-oauth2";
import { User } from "./entity/User";

console.log(process.env.GOOGLE_CLIENT_ID);
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => done(null, null));
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: `${process.env.DOMAIN}/auth/google/callback`,
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
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          done(null, existingUser);
        } else {
          const { id, family_name, given_name, email } = profile;
          const newUser = await User.create({
            googleId: id,
            firstName: given_name,
            lastName: family_name,
            email: email,
          }).save();

          done(null, newUser);
        }
      } catch (err) {
        done(err, profile);
      }
    }
  )
);

export default passport;
