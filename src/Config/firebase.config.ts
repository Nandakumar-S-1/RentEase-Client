import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfiguration = {
    apiKey: "AIzaSyCioKlLib5KyKCQR60ebb4T3dXDZb5iVQY",
    authDomain: "rentease-1eb8c.firebaseapp.com",
    projectId: "rentease-1eb8c",
    storageBucket: "rentease-1eb8c.firebasestorage.app",
    messagingSenderId: "720238111574",
    appId: "1:720238111574:web:174faa03ed9012ea8ec4f7",
    measurementId: "G-4CSGD5H7TW"
};

const app = initializeApp(firebaseConfiguration);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();