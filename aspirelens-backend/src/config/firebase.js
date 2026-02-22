import admin from "firebase-admin";

/**
 * Initialize Firebase Admin SDK using environment variables.
 * For Google Auth token verification only — no service account file needed
 * when using Application Default Credentials or projectId-only init.
 *
 * Required env vars:
 *   FIREBASE_PROJECT_ID=aspirelens-80e6b
 */

if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || "aspirelens-80e6b";

    try {
        // If you have a service account JSON set GOOGLE_APPLICATION_CREDENTIALS
        // or FIREBASE_SERVICE_ACCOUNT env var. Otherwise we init with projectId only
        // which is sufficient for verifyIdToken() when called from the same project.
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId,
            });
        } else {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId,
            });
        }
        console.log("✅ Firebase Admin initialized (project:", projectId, ")");
    } catch (err) {
        console.warn("⚠️ Firebase Admin init failed:", err.message);
        console.warn("Google login will not work until FIREBASE_SERVICE_ACCOUNT is configured.");
    }
}

export default admin;
