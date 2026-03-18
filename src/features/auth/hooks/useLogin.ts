import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../../../hooks/useAppDispatch"
import type {  LoginData } from "../types/authTypes"
import { loginUser } from "../services/authService"
import { setCredentials } from "../slices/AuthSlice"
import { PAGE_ROUTES } from "../../../config/routes"
import { useState } from "react"
import type { ApiError } from '../../../types/common';

export const useLogin = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const login = async (data: LoginData) => {
        try {
            setIsLoading(true)
            setError(null)
            setSuccessMessage(null)

            const response = await loginUser(data)
            dispatch(
                setCredentials({
                    user: response.data.user,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                })
            )
            setSuccessMessage('Login Successful')
            setTimeout(() => navigate(PAGE_ROUTES.DASHBOARD), 1000)
        } catch (error) {
            const apiError = error as ApiError
            setError(
                apiError?.response?.data?.message || 'Login failed, Please try again'
            )
        } finally {
            setIsLoading(false)
        }
    }
    return { login, isLoading, error, successMessage }
}