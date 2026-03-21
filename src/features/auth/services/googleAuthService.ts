import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../config/firebase.config";

export const signinWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();

        return {
            idToken,
            user: {
                email: result.user.email || "",
                displayName: result.user.displayName || "google user",
            },
        };
    } catch (error) {
        const message = error instanceof Error ? error.message : "Google signin failed";
        console.error("google sign in error", error);
        throw new Error(message);
    }
};
