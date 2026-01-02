/*const passport = require("passport");
const { OIDCStrategy } = require("passport-azure-ad");
passport.use(
  "azuread-openidconnect",
  new OIDCStrategy(
    {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      responseMode: "query",
      responseType: "code",
      redirectUrl: "http://localhost:4000/auth/callback",
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      validateIssuer: true,
      passReqToCallback: false,
      scope: ["openid", "profile", "email"],
    },
    function (iss, sub, profile, accessToken, refreshToken, done) {
      const email = profile._json.preferred_username;

      if (!email.endsWith("@escobarstafe.com.ar")) {
        return done(null, false, { message: "Dominio no permitido" });
      }

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
*/
const passport = require("passport");
const { OIDCStrategy } = require("passport-azure-ad");

const ALLOWED_DOMAINS = [
  "@escobarstafe.com.ar",
  "@esobarautomotores.com.ar", 
  "@escobarsantafe.com.ar"
];

passport.use(
  "azuread-openidconnect",
  new OIDCStrategy(
    {
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.AZURE_CLIENT_ID,
      responseMode: "query",
      responseType: "code",
      //redirectUrl: "http://localhost:4000/auth/callback",
      redirectUrl: process.env.BACKEND_URL + "/auth/callback",
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      validateIssuer: true,
      passReqToCallback: false,
      scope: ["openid", "profile", "email"],
    },
    function (iss, sub, profile, accessToken, refreshToken, done) {
      const email = profile._json.preferred_username;

      const isDomainAllowed = ALLOWED_DOMAINS.some(domain => email.endsWith(domain));

      if (!isDomainAllowed) {
        return done(null, false, { message: "Dominio no permitido" });
      }

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;