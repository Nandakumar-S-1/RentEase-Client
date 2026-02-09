import axios from 'axios';

export const axiosApi = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

//'https://wnfgzsjc-3000.inc1.devtunnels.ms/api'