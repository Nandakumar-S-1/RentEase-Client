import type { AuthResponse, LoginData, RegisterData } from '../Types/auth';
import { axiosApi } from './api';


export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosApi.post('/users/register', data);
    return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosApi.post('/users/login', data)
    return response.data
}

export const loginAdmin = async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosApi.post('/admin/login', data);
    return response.data;
}

export const googleLogin = async (idToken: string, role: string): Promise<AuthResponse> => {
    const response = await axiosApi.post('/users/google-auth', { idToken, role });
    return response.data;
}

export const logoutUser = (): void => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
}

export const getCurrentUser = () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const getAccesToken = (): null | string => {
    return localStorage.getItem('accessToken')
}

export const isLoggedIn = (): boolean => {
    return !!localStorage.getItem('accessToken')
}


// export interface RegisterData {
//     email: string;
//     fullname: string;
//     password: string;
//     phone: string;
//     role: 'TENANT' | 'OWNER';
// }

// export interface LoginData {
//     email:string,
//     password:string
// }

// export interface AuthenticationResponse{
//     success:boolean,
//     message:string,
//     data:{
//         user:{
//             id:string,
//             email:string,
//             fullname:string,
//             phone:string,
//             role: 'TENANT' | 'OWNER';
//         },
//         accessToken:string,
//         refreshToken:string
//     }
// }