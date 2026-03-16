import axios from 'axios';

export const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,    
    headers: {
        'Content-Type': 'application/json',
    },
})

axiosApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
