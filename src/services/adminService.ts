import { axiosApi } from '../API/api';

export interface UserResponse {
    id: string;
    email: string;
    fullname: string;
    phone: string;
    role: 'ADMIN' | 'OWNER' | 'TENANT';
    isEmailVerified: boolean;
    isActive: boolean;
    isSuspended: boolean;
    createdAt: string;
}

export const getAllUsers = async (page = 1, limit = 10,role?:'OWNER'|'TENANT') => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params:any ={page,limit}
    if(role){
        params.role=role
    }
    const response = await axiosApi.get('/admin/users', {
        params
    });
    return response.data;
};

export const suspendUser = async (userId: string) => {
    const response = await axiosApi.patch(`/admin/users/suspend/${userId}`);
    return response.data;
};

export const activateUser = async (userId: string) => {
    const response = await axiosApi.patch(`/admin/users/activate/${userId}`);
    return response.data;
};

export const deactivateUser = async (userId: string) => {
    const response = await axiosApi.patch(`/admin/users/deactivate/${userId}`);
    return response.data;
};
