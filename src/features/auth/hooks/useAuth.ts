import { useDispatch } from "react-redux"
import { useAppSelector } from "../../../hooks/useAppSelector"
import { setError, setLoading, setUser } from "../Slice/AuthSlice"
import { loginApi } from "../Api/authApi"

export const useAuth = () =>{
    const dispatch=useDispatch()
    const {user,loading,error}=useAppSelector((state)=>state.auth)

    const login = async(data:{
        email:string;
        password:string
    })=>{
        try {
            dispatch(setLoading(true))
            const res=await loginApi(data)
            dispatch(setUser(res.user))
        } catch (error:any) {
            dispatch(setError(error.message))
        } finally{
            dispatch(setLoading(false))
        }
    }
    return {
        user,loading,error,login
    }
}