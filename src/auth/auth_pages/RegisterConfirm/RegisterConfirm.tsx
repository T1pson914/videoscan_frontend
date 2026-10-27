import styles from './LoginConfirm.module.css'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api'
import type { AxiosError } from 'axios'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'



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


const STORAGE_KEY = 'cooldown-ends-at'



function getSecondsLeft(): number {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
        return 0
    }
    const endsAt = Number(raw)
    return Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
}


export function RegisterConfirm(){

    const [err,serErr] = useState('')
    const [timeLeft, setTimeLeft] = useState(getSecondsLeft)
    const isClicked = timeLeft > 0
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