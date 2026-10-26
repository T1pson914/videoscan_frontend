import styles from './Login.module.css'
import {useTitle} from '../../../hooks.js'
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '../../../api.js'
import { Navigate } from 'react-router-dom'



interface LoginRequest {
    email: string,
    password: string
}   

interface ErrorResponse {
    detail: string
}

interface LoginResponse {
    message: string
}

export function Login(){

    useTitle('Вход')    

    const [values,setValues] = useState({email:'',password:''})
    const [error,setError] = useState('')
    const [successLogin,setSuccessLogin] = useState(false)
    
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {name,value} = event.target
        setValues({...values,[name]:value})
    }

    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
        const {value} = event.target
        if(value==='') {
            setError('')
        }
    }

    const {mutate} = useMutation<LoginResponse,AxiosError<ErrorResponse>,LoginRequest>({
        mutationFn: async function(payload: LoginRequest) {
            const response = await api.post('/user/login',payload)
            return response.data
        },
        onSuccess:() => {
            setSuccessLogin(true)
        },
        onError: (err: AxiosError<ErrorResponse>) => {
            setError(err.response?.data.detail ?? 'Что-то пошло не так.')
        }
    })

    function onSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const email = formData.get('email') as string
        const payload = {
            email: email,
            password: formData.get('password') as string,
        }
        localStorage.setItem('email',email)
        mutate(payload)
    }

    if (successLogin) {
        return <Navigate to={'/user/login-confirm'} />
    }

    return (
        <>
            <div className={styles.Outer}>
                
                <form className={styles.Form} onSubmit={onSubmit}>
                    <h1>Вход</h1>
                    <div className={styles.Element}>
                        <label htmlFor='email'>Почта:</label>
                        <input id='email' name='email' type='email' onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    { error && <span className={styles.Error}>{error}</span>}
                    <div className={styles.Element}>
                        <label htmlFor='password'>Пароль:</label>
                        <input id='password' name='password' type='password' onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <button>Войти</button>
                </form>
            </div>
        </>
    )
}
