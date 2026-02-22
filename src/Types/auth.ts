export interface User {
  id: string;
  email: string;
  fullname: string;
  phone: string;
  role: 'TENANT' | 'OWNER';
}

export interface AuthResponse {
    success: boolean,
    message: string,
    data: {
        user: User
        accessToken: string;
        refreshToken: string;
    };
}


export interface RegisterData{
    email:string,
    fullname:string,
    password:string,
    phone:string,
    role: 'TENANT'|'OWNER'
}

export interface LoginData{
    email:string,
    password:string
}

export interface ApiError{
    response?:{
        data?:{
            message?:string
        }
    }
}