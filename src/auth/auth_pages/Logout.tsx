import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Navigate } from "react-router-dom";
import { api } from "../../api";
import { useContext, useEffect } from "react";
import { authContext } from "../context";

interface LogoutResponse {
    message: string
}

interface ErrorResponse {
    detail: {
        message: string,
        refresh_token: string | undefined
    }
}

export function Logout(){

    const tools = useContext(authContext)

    const {mutate} = useMutation<LogoutResponse,AxiosError<ErrorResponse>>({
        mutationFn: async function() {
            const response = await api.post('/user/logout')
            return response.data
        },
        onSuccess:() => {
            localStorage.removeItem('access_token')
            tools?.setIsAuth(false)
            tools?.setUserId(0)
        },
        onError:(error: AxiosError<ErrorResponse>) => {
            console.log(error.response?.data.detail.message)
            console.log(error.response?.data.detail.refresh_token)
        }
    })

    useEffect(()=>{
        mutate()
    },[])

    return (
        <>
            <Navigate to='/user/login' />
        </>
    )
}
