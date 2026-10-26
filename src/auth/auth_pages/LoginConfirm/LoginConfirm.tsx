import styles from './LoginConfirm.module.css'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api'
import type { AxiosError } from 'axios'
import { useState,useContext } from 'react'
import { authContext } from '../../context'
import { useNavigate } from 'react-router-dom'


interface LoginRequest {
    email: string,
    code: string
}   

interface ErrorResponse {
    detail: string
}

interface LoginResponse {
    access_token: string,
    user_id: number
}


export function LoginConfirm(){

    const [err,serErr] = useState('')

    const authEntities = useContext(authContext)

    const navigate = useNavigate()

    const {mutate} = useMutation<LoginResponse,AxiosError<ErrorResponse>,LoginRequest>({
        mutationFn:async function(data: LoginRequest) {
            const result = await api.post('/user/login-confirm',data)
            return result.data
        },
        onSuccess:(response: LoginResponse) => {
            localStorage.setItemo('access_token',response.access_token)
            authEntities?.setIsAuth(true)
            authEntities?.setUserId(response.user_id)
            navigate('/')
        },
        onError:(error: AxiosError<ErrorResponse>) => {
            serErr(error.message)
        }
    })

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const code = formData.get('code') as string
        const email = localStorage.getItem('email') as string
        mutate({code:code,email:email})
    }

    return (
        <>
            <div className={styles.Outer}>

                <form onSubmit={handleSubmit} className={styles.Form}>
                    <div className={styles.Element}>
                        <label>Введите код:</label>
                        <input type='text' name='code'/>
                    </div>
                    <span className={styles.Error}>{ err }</span>
                    <button type='submit'>Подтвердить</button>
                </form>

            </div>
        </>
    )
}
