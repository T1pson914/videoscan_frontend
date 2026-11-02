import styles from './LoginConfirm.module.css'
import { useMutation } from '@tanstack/react-query'
import { api } from '../../../api'
import type { AxiosError } from 'axios'
import { useState, useContext, useEffect } from 'react'
import { authContext } from '../../context'
import { useNavigate } from 'react-router-dom'
import { useTitle } from '../../../hooks'

interface LoginRequest {
    email: string,
    code: string
}

interface ResendRequest {
    email: string
}

interface ErrorResponse {
    detail: string
}

interface LoginResponse {
    access_token: string,
    user_id: number
}

const RESEND_DELAY = 120 // секунд
const RESEND_KEY = 'resend_available_at'
// Эндпоинт, который отправляет код. Замените на свой, если он называется иначе
const SEND_CODE_URL = '/user/login-confirm'

function getSecondsLeft(): number {
    const availableAt = Number(localStorage.getItem(RESEND_KEY))
    return Math.max(0, Math.ceil((availableAt - Date.now()) / 1000))
}

function startCooldown() {
    localStorage.setItem(RESEND_KEY, String(Date.now() + RESEND_DELAY * 1000))
}

export function LoginConfirm() {

    useTitle('Вход')

    const [err, setErr] = useState('')
    const [secondsLeft, setSecondsLeft] = useState<number>(() => {
        // Первый заход на страницу: код только что был отправлен, запускаем таймер
        if (!localStorage.getItem(RESEND_KEY)) {
            startCooldown()
        }
        return getSecondsLeft()
    })
    const authEntities = useContext(authContext)
    const navigate = useNavigate()

    // Тик раз в секунду, пока таймер не дойдёт до нуля
    useEffect(() => {
        if (secondsLeft <= 0) return
        const id = setTimeout(() => setSecondsLeft(getSecondsLeft()), 1000)
        return () => clearTimeout(id)
    }, [secondsLeft])

    const { mutate } = useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginRequest>({
        mutationFn: async function (data: LoginRequest) {
            const result = await api.post('SEND_CODE_URL', data)
            return result.data
        },
        onSuccess: (response: LoginResponse) => {
            localStorage.setItem('access_token', response.access_token)
            localStorage.removeItem('email')
            localStorage.removeItem(RESEND_KEY)
            authEntities?.setIsAuth(true)
            authEntities?.setUserId(response.user_id)
            navigate('/')
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            setErr(error.message)
        },
    })

    const { mutate: resend, isPending: isResending } = useMutation<unknown, AxiosError<ErrorResponse>, ResendRequest>({
        mutationFn: async function (data: ResendRequest) {
            const result = await api.post(SEND_CODE_URL, data)
            return result.data
        },
        onSuccess: () => {
            setErr('')
            startCooldown()
            setSecondsLeft(getSecondsLeft())
        },
        onError: (error: AxiosError<ErrorResponse>) => {
            setErr(error.message)
        },
    })

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const code = formData.get('code') as string
        const email = localStorage.getItem('email') as string
        mutate({ code: code, email: email })
    }

    function handleResend() {
        const email = localStorage.getItem('email') as string
        resend({ email })
    }

    const resendDisabled = secondsLeft > 0 || isResending

    return (
        <>
            <div className={styles.Outer}>

                <form onSubmit={handleSubmit} className={styles.Form}>
                    <div className={styles.Element}>
                        <label>Введите код:</label>
                        <input type='text' name='code' />
                    </div>
                    <button type='submit'>Подтвердить</button>
                    <button
                        type='button'
                        className={styles.Resend}
                        disabled={resendDisabled}
                        onClick={handleResend}
                    >
                        {secondsLeft > 0
                            ? `Отправить ещё раз (${secondsLeft} с)`
                            : 'Отправить ещё раз'}
                    </button>
                    <span className={styles.Error}>{err}</span>
                </form>
            </div>
        </>
    )
}
