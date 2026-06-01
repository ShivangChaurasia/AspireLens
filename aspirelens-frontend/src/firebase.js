import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

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
 * Trigger Google Sign-In popup and return the Firebase ID token.
 * Falls back to redirect if popup is blocked by the browser.
 */
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        return { idToken, user: result.user };
    } catch (error) {
        if (error.code === 'auth/popup-blocked') {
            console.warn("Popup blocked. Falling back to redirect...");
            await signInWithRedirect(auth, googleProvider);
            return new Promise(() => {}); // Return a pending promise so the caller handles page unload gracefully
        }
        throw error;
    }
};

/**
 * Handle Google Redirect result and return user and token info if found.
 */
export const handleGoogleRedirectResult = async () => {
    const result = await getRedirectResult(auth);
    if (result) {
        const idToken = await result.user.getIdToken();
        return { idToken, user: result.user };
    }
    return null;
};
