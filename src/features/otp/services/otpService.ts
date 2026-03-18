import { API_ROUTES } from "../../../config/routes"
import { axiosApi } from "../../../services/api/axiosInstance"

export interface VerifyOtpResponse {
    success: boolean
    message: string,
    data: {
        user: {
            id: string
            email: string
            fullname: string
            phone: string
            role: 'TENANT' | 'OWNER'
        }
        accessToken: string
        refreshToken: string
    }
}

export interface ResendOtpResponse {
    success: boolean,
    message: string
}

export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
    const response = await axiosApi.post(API_ROUTES.VERIFY_OTP, {
        email, otp
    })
    return response.data
}

export const resendOtp = async (email: string): Promise<ResendOtpResponse> => {
    const response = await axiosApi.post(API_ROUTES.RESEND_OTP, {
        email
    })
    return response.data
}
