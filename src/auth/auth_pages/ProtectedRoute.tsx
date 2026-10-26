import { useContext } from "react"
import { authContext } from "../context.ts"
import { Navigate } from "react-router-dom"



export function ProtectedRoute(props: React.PropsWithChildren){

    const {children} = props

    const tools = useContext(authContext)

    if(tools?.isAuth) {
        return children
    }
    return (
        <>
            <Navigate to={'/user/login'} />
        </>
    )
}
