import passport from "passport";
import strategies from "./authStrategies";
// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => done(null, null));
strategies.forEach((strategy) => passport.use(strategy));

export default passport;
