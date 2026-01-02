import User from "@/modules/user/user.schema";
import { LoginTypeEnum } from "@/shares/constants/enum";
import { ENV } from "@/shares/constants/enviroment";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (!user) {
          user = await User.create({
            email,
            username: email,
            fullName: profile.displayName,
            avatar: profile.photos?.[0].value,
            googleId: profile.id,
            provider: LoginTypeEnum.GOOGLE,
          });
        } else if (!user.googleId) {
          // user đăng ký local trước → liên kết google
          user.googleId = profile.id;
          user.provider = LoginTypeEnum.GOOGLE;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
