import styles from './RegisterConfirm.module.css'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api'
import type { AxiosError } from 'axios'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTitle } from '../../../hooks'



interface RegisterRequest {
    email: string,
    code: string
}   

interface ErrorResponse {
    detail: string
}

interface RegisterResponse {
    message: string
}



export function RegisterConfirm(){

    useTitle('Регистрация')

    const [err,serErr] = useState('')
    const navigate = useNavigate()

    const {mutate} = useMutation<RegisterResponse,AxiosError<ErrorResponse>,RegisterRequest>({
        mutationFn:async function(data: RegisterRequest) {
            const result = await api.post('/user/login-confirm',data)
            return result.data
        },
        onSuccess:() => {
            //if(isClicked) {
            //    return
            //}
            //localStorage.setItem(STORAGE_KEY, String(Date.now() + 60 * 1000))    
            //setTimeLeft(60)    
            //setisFirstSubmit(true)
            localStorage.removeItem('email')
            navigate('/user/login')
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