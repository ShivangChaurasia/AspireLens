import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBeHCdEQIVKN6E4-4lFUQUAm_oruO4TZc8",
    authDomain: "aspirelens-80e6b.firebaseapp.com",
    projectId: "aspirelens-80e6b",
    storageBucket: "aspirelens-80e6b.firebasestorage.app",
    messagingSenderId: "483654846089",
    appId: "1:483654846089:web:ad10e2ea70ed56aceb2858",
    measurementId: "G-EE7HVZMR05",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Trigger Google Sign-In popup and return the Firebase ID token.
 */
export const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
};
