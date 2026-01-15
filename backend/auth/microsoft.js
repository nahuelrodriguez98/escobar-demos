const passport = require("passport");
const { OIDCStrategy } = require("passport-azure-ad");

const ALLOWED_DOMAINS = [
  "@escobarstafe.com.ar",
  "@esobarautomotores.com.ar",
  "@escobarsantafe.com.ar"
];

let initialized = false;

function initMicrosoftStrategy() {
  if (initialized) return;

  const {
    AZURE_TENANT_ID,
    AZURE_CLIENT_ID,
    AZURE_CLIENT_SECRET,
    BACKEND_URL
  } = process.env;

  // 1. Evitar crash: Si falta configuración, logueamos error y salimos sin romper la app
  if (!BACKEND_URL || !AZURE_TENANT_ID || !AZURE_CLIENT_ID) {
    console.error("❌ ERROR CRÍTICO: Faltan variables de entorno para Microsoft Auth (BACKEND_URL, CLIENT_ID, etc). La estrategia no se cargará.");
    return; 
  }

  // 2. Construir la URL completa explícitamente para depuración
  const redirectUrl = `${BACKEND_URL}/auth/callback`;
  console.log("Inicializando Microsoft Strategy con callback:", redirectUrl);

  try {
    passport.use(
      "azuread-openidconnect",
      new OIDCStrategy(
        {
          identityMetadata: `https://login.microsoftonline.com/${AZURE_TENANT_ID}/v2.0/.well-known/openid-configuration`,
          clientID: AZURE_CLIENT_ID,
          responseType: "code",
          responseMode: "query",
          redirectUrl: redirectUrl, 
          clientSecret: AZURE_CLIENT_SECRET,
          validateIssuer: true,
          allowHttpForRedirectUrl: false, 
          passReqToCallback: false,
          scope: ["openid", "profile", "email"]
        },
        (iss, sub, profile, accessToken, refreshToken, done) => {
          const email = profile?._json?.preferred_username;

          if (!email) {
            return done(null, false);
          }

          const allowed = ALLOWED_DOMAINS.some(d => email.endsWith(d));
          if (!allowed) {
            return done(null, false, { message: "Dominio no permitido" });
          }

          return done(null, profile);
        }
      )
    );
    
    // Serializadores movidos aquí dentro para asegurar que solo corran si la estrategia cargó
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
    
    initialized = true;
    console.log("✅ Microsoft Strategy inicializada correctamente.");

  } catch (error) {
    console.error("❌ Error al crear la estrategia de Microsoft:", error);
    // No lanzamos throw para no matar el proceso de Node
  }
}

module.exports = {
  passport,
  initMicrosoftStrategy
};