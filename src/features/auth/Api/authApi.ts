import { axiosApi } from "../../../services/api/axiosInstance";

export const loginApi = async(data:{
    email:string;
    password:string
})=>{
    const res= await axiosApi.post('/auth/login',data)
    return res.data
}