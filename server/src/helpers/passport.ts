import passport from "passport";
import { Strategy as Local } from "passport-local";
import { Strategy as Bearer } from "passport-http-bearer";
import { userModel } from "./schemas/user.js";

passport.use(
  new Local(async (username: string, password: string, done: Function) => {
    const user = await userModel.findOne({ username }).lean();
    const ok = user && user.password === password;

    if (!ok) {
      return done(null, false, "Invalid username or password!");
    }

    // Success
    return done(null, user);
  })
);

passport.use(
  new Bearer(async (token: string, done: Function) => {
    const user = await userModel.findOne({ token });
    if (!user) {
      return done(null, false);
    }
    return done(null, user, { scope: "all" });
  })
);

export const isLoggedIn = passport.authenticate("bearer", { session: false });
