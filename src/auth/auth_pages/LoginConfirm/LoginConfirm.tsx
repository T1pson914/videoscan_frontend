import styles from './LoginConfirm.module.css'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api'
import type { AxiosError } from 'axios'
import { useState,useContext,useEffect } from 'react'
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


const STORAGE_KEY = 'cooldown-ends-at'



function getSecondsLeft(): number {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
        return 0
    }
    const endsAt = Number(raw)
    return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
}


export function LoginConfirm(){

    const [err,serErr] = useState('')
    const [timeLeft, setTimeLeft] = useState(getSecondsLeft)
    const isClicked = timeLeft > 0
    const authEntities = useContext(authContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isClicked) {
            return
        }
        const intervalId = setInterval(() => {
            setTimeLeft(getSecondsLeft())
        }, 1000)
        return () => clearInterval(intervalId)
    }, [isClicked])

    const {mutate} = useMutation<LoginResponse,AxiosError<ErrorResponse>,LoginRequest>({
        mutationFn:async function(data: LoginRequest) {
            const result = await api.post('/user/login-confirm',data)
            return result.data
        },
        onSuccess:(response: LoginResponse) => {   
            //setisFirstSubmit(true)
            localStorage.setItem('access_token',response.access_token)
            localStorage.removeItem('email')
            authEntities?.setIsAuth(true)
            authEntities?.setUserId(response.user_id)
            navigate('/')
        },
        onError:(error: AxiosError<ErrorResponse>) => {
            serErr(error.message)
        },
        // onSettled:() => {
        //     if(isClicked) {
        //         return
        //     }
        //     localStorage.setItem(STORAGE_KEY, String(Date.now() + 60 * 1000))    
        //     setTimeLeft(60) 
        // }
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
