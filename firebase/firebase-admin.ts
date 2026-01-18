import admin from "firebase-admin";
const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!base64) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
}
const decoded = Buffer.from(base64, "base64").toString("utf-8");
const serviceAccount = JSON.parse(decoded);
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}


export const adminAuth = admin.auth();

