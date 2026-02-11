import axios from 'axios';

export const axiosApi = axios.create({
    // baseURL: 'http://localhost:3000/api',
    baseURL:"https://wnfgzsjc-3000.inc1.devtunnels.ms/api",
    headers: {
        'Content-Type': 'application/json',
    },
})
