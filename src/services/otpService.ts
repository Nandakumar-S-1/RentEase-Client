import { axiosApi } from "./api"

export interface VerifyOtpResponse{
    success:boolean
    message:string,
    data:{
        id:string,
        email:string,
        fullname:string,
        phone:string,
        role:'TENANT'|'OWNER'
    }
    accessToken:string,
    refreshToken:string
}

export interface ResendOtpResponse{
    success:boolean,
    message:string
}

export const verifyOtp = async(email:string,otp:string): Promise<VerifyOtpResponse>=>{
    const response = await axiosApi.post('/users/verify-otp',{
        email,otp
    })
    return response.data
}

export const resendOtp = async (email:string):Promise<ResendOtpResponse>=>{
    const response = await axiosApi.post('/users/resend-otp',{
        email
    })
    return response.data
}
