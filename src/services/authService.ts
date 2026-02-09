import { axiosApi } from './api';

export interface RegisterData {
    email: string;
    fullname: string;
    password: string;
    phone: string;
    role: 'TENANT' | 'OWNER';
}

export const registerUser = async (data: RegisterData) => {
    const response = await axiosApi.post('/users/register', data);
    return response.data;
};
