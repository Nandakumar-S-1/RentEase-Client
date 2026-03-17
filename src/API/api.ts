import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { ErrorResponse } from "react-router-dom";

export const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosApi.interceptors.request.use(
    (config) => {
    const accessToken = localStorage.getItem("accessaccessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
},(err)=>{
    return Promise.reject(err)
}
);


axios.interceptors.response.use(
    (responce)=>responce,
    async (err:AxiosError<ErrorResponse>)=>{
        const responceData =  err.response?.data as ErrorResponse | undefined;
        const originalRequest = err.config as InternalAxiosRequestConfig & {
            _retry?:boolean
        }
        if(originalRequest){
            return Promise.reject(err)
        }
        const errMessage = err.response?.data?.message || "";
        const status =  err.response?.status

        if(status===401){
            originalRequest.url?.includes('/auth/login')||
            originalRequest.url?.includes('/auth/refresh')
        }
    }
)
