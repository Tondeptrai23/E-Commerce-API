import { googleConfig } from "./config.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
    new GoogleStrategy(
        {
            clientID: googleConfig.CLIENT_ID,
            clientSecret: googleConfig.CLIENT_SECRET,
            callbackURL: googleConfig.CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
            return cb(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

const REDIRECT_URL = googleConfig.REDIRECT_URL;
const REDIRECT_URL_FAILED = googleConfig.REDIRECT_URL_FAILED;

export { REDIRECT_URL, REDIRECT_URL_FAILED };

export default passport;
