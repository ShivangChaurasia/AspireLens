import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Initiate Google Sign-In via redirect (avoids popup-blocked / COOP issues).
 * The page will navigate away; call handleGoogleRedirectResult() after it returns.
 */
export const signInWithGoogle = () => {
    return signInWithRedirect(auth, googleProvider);
};

/**
 * Call this on page load to retrieve the result after the Google redirect returns.
 * Returns { idToken, user } on success, or null if no redirect result is pending.
 */
export const handleGoogleRedirectResult = async () => {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
};
