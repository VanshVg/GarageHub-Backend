import { logger } from "@/common/logger";
import { JWT_SECRET } from "@/config";
import { findOneUser } from "@/repositories/users.repository";
import passport from "passport";
import passportStrategy, { StrategyOptionsWithRequest } from "passport-jwt";

const JWTStrategy = passportStrategy.Strategy;
const ExtractJWT = passportStrategy.ExtractJwt;

const options: StrategyOptionsWithRequest = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("Bearer"),
  secretOrKey: JWT_SECRET,
  passReqToCallback: true,
};

export const passportMiddleware = () => {
  passport.use(
    "jwt",
    new JWTStrategy(options, async (req, payload, done) => {
      try {
        const isUser = await findOneUser({ where: { email: payload.email } });
        if (!isUser) {
          done(null, false);
        } else {
          done(null, { ...isUser });
        }
      } catch (error) {
        logger.error(error);
        done(error);
      }
    })
  );
};
