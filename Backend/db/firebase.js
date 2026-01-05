import admin from "firebase-admin";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Ruta ABSOLUTA a tu archivo JSON fuera del repo
const serviceAccount = require("./plathery-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
