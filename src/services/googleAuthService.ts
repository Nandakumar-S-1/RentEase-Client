import { initializeApp } from "firebase/app";
import { axiosApi } from "./api";
import { firebaseConfiguration } from "../Config/firebase.config";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth/web-extension";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import type { AuthResponse } from "../Types/auth";

const app = initializeApp(firebaseConfiguration)
const authentication =  getAuth(app)

const googleProvider = new GoogleAuthProvider()

export const signinWithGoogle = async ()=>{
    try {
        const result = await signInWithPopup(authentication,googleProvider)
        const idToken = await result.user.getIdToken()

        return {
            idToken,
            user:{
                email:result.user.email || '',
                displayName:result.user.displayName || 'google user',
            }
        }
    } catch (error:unknown) {
        console.error('google sigin in error',error)
        throw new Error(error.message || 'Google signin failed')        
    }
}

export const GoogleAuthenticate =  async(
    idToken:string,
    role:'TENANT' | 'OWNER'
):Promise<AuthResponse>=>{
    try {
        const response = await axiosApi.post('/users/google-auth',{
            idToken,
            role
        })
        return response.data
    } catch (error) {
        console.error('-----------google authenticate eroro',error)
        throw error        
    }
}

export const handleGoogleAuth =  async(
     role:'TENANT' | 'OWNER',
):Promise<AuthResponse>=>{
    const googleAuth =await signinWithGoogle()
    return GoogleAuthenticate(googleAuth.idToken,role)
}