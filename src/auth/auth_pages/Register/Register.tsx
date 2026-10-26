import styles from './Register.module.css'
import {useTitle} from '../../../hooks.js'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '../../../api.js'
import { Navigate } from 'react-router-dom'


interface RegisterRequest {
    email: string,
    username: string,
    password: string
}

interface ErrorMessages {
    email: string,
    username: string
}

interface ErrorResponse {
    detail: ErrorMessages
}

interface RegisterResponse {
    message: string
}

export function Register(){

    useTitle('Регистрация')    

    const [values,setValues] = useState({username:'',email:'',password:'',password2:''})
    const [errors,setErrors] = useState({username:'',email:'',password:'',password2:''})
    const [touched,setTouched] = useState({username:false,email:false,password:false,password2:false})
    const [confirm, setConfirm] = useState(false)


    function validate(newValues = values){

        const {username,email,password,password2} = newValues
        const newErrors = { ...errors }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        
        newErrors.username = !username ? '' : username[0] in ['0','1','2','3','4','5','6','7','8','9']
        ? 'Имя не должно начинаться с цифры.'  
        : username.trim().length < 2 
            ? 'Имя должно иметь хотя-бы 2 символа.'
            : ''
        
        newErrors.email = !email ? '' : emailRegex.test(email) 
            ? '' 
            : 'Некоректный email.'
        
        newErrors.password = !password ? '' : password.trim().length < 8 
            ? 'Длина пароля должна быть не меньше 8.'
            :''
        
        newErrors.password2 = !password2 ? '' : password2===password 
            ? '' 
            : 'Пароли не совпадают' 
        
        setErrors(newErrors)
        if (Object.values(values).some((elem=>elem===''))) {
            return false
        }
        return Object.values(newErrors).every(elem=>elem==='')
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const {name,value} = event.target as {name: keyof typeof values,value: string}
        setValues({ ...values, [name]:value})
        if(touched[name]) {
            validate( { ...values, [name]:value} ) 
        }
    }
    
    function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
        const {name,value} = event.target
        setTouched({...touched,[name]:true})
        validate( {...values,[name]:value} )
    }

    const {mutate} = useMutation<RegisterResponse,AxiosError<ErrorResponse>,RegisterRequest>({
        mutationFn: async function(payload: RegisterRequest) {
            const response = await api.post('/user/register',payload)
            return response.data
        },
        onSuccess: (response: RegisterResponse)=>{
            console.log(response.message)
            setConfirm(true)
        },
        onError: (error: AxiosError<ErrorResponse>)=>{
            console.log(error.message)
            const result = error.response?.data.detail
            const username = result?.username ?? '' 
            const email = result?.username ?? ''
            setErrors({...errors,username,email})
        }
    })

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){
        event.preventDefault()
        setTouched({username:true,email:true,password:true,password2:true});
        const condition = Object.values(values).every((elem)=>elem==='')
        if(validate( values ) && !condition){
            console.log('Все готово')
            const formData = new FormData(event.target)
            const payload = {
                email: formData.get('email') as string,
                username: formData.get('username') as string,
                password: formData.get('password') as string,
            }
            mutate(payload)
        }
    }
    const successMessage = 'Регистрация прошла успешно.'
    if (confirm) {
        return <Navigate to={'/user/login'} state={successMessage} />
    }

    return (
        <>
            <div className={styles.Outer}>
                <form className={styles.Form} onSubmit={handleSubmit}>
                    <h1>Регистрация</h1>
                    <div className={styles.Element}>
                        <label htmlFor='username'>Ник: </label>
                        <input type='text' id='username' name='username' onChange={handleChange} onBlur={handleBlur}/>           
                        {errors.username && touched.username && <span className={styles.Error}>{errors.username}</span>}
                    </div>
                    <div className={styles.Element}>
                        <label htmlFor='email'>Почта: </label>
                        <input type='email' id='email' name='email' onChange={handleChange} onBlur={handleBlur}/>
                        {errors.email && touched.email && <span className={styles.Error}>{errors.email}</span>}
                    </div>
                    <div className={styles.Element}>
                        <label htmlFor='password'>Пароль: </label>
                        <input type='password' id='password' name='password' onChange={handleChange} onBlur={handleBlur}/>
                        {errors.password && touched.password && <span className={styles.Error}>{errors.password}</span>}
                    </div>
                    <div className={styles.Element}>
                        <label htmlFor='password2'>Повторите пароль: </label>
                        <input type='password' id='password2' name='password2' onChange={handleChange} onBlur={handleBlur}/>
                        {errors.password2 && touched.password2 && <span className={styles.Error}>{errors.password2}</span>}
                    </div>
                    <button>Регистрация</button>
                </form>
            </div>
        </>
    )
}
