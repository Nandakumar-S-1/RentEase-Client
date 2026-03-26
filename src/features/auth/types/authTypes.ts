import type { RoleType } from "../../../types/Constants/role.constant";
import type { VerificationStatus } from "../../verification/types/verificationType";

export interface User {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  role: RoleType
  verificationStatus?: VerificationStatus
}

export interface AuthResponse {
    success: boolean,
    message: string,
    data: {
        user: User
        accessToken: string;
        refreshToken?: string;
    };
}




export interface RegisterData{
    email:string,
    fullname:string,
    password:string,
    phone:string,
    role: RoleType
}

export interface LoginData{
    email:string,
    password:string
}

// export interface ApiError{
//     response?:{
//         data?:{
//             message?:string
//         }
//     }
// }