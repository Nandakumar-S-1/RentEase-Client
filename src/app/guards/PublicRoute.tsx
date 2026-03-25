import React from "react"
import { useAppSelector } from "../../hooks/useAppSelector"
import { Navigate } from "react-router-dom"
import { PAGE_ROUTES } from "../../config/routes"
//This is used for pages that should be accessible only when the user is NOT logged in.
interface PublicRouteProps{
    children:React.ReactNode
}
const PublicRoute:React.FC<PublicRouteProps>=({children})=>{
    const isAuthenticated = useAppSelector((state)=>state.auth.isAuthenticated)

    if(isAuthenticated){
        return <Navigate to={PAGE_ROUTES.DASHBOARD}/>
    }
    return <>{children}</>
}

export default PublicRoute