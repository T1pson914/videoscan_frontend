import axios,{AxiosError, type AxiosResponse, type InternalAxiosRequestConfig} from "axios"



interface ErrorResponse {
    detail: string
}

export const api = axios.create({
    baseURL:'http://localhost:8000',
    withCredentials: true,
})


api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig =>{
        const access_token = localStorage.getItem('access_token')
        config.headers.Authorization = `Bearer ${access_token}`
        return config
    },
    (error: AxiosError)=>{
        return Promise.reject(error)
    }
)

let globalPromise: Promise<string> | null = null

function getNewAccessToken() : Promise<string>{
    if(globalPromise) {
        return globalPromise
    }
    globalPromise = api.post('/user/new-access').then((result)=>{
        const access_token = result.data.access_token
        localStorage.setItem('access_token',access_token)
        return access_token
    }).finally(()=>{
        globalPromise = null
    })
    return globalPromise
}

api.interceptors.response.use(
    (response: AxiosResponse) : AxiosResponse=>{
        return response
    },
    async (error: AxiosError<ErrorResponse>)=>{
        const originalRequest = error.config as InternalAxiosRequestConfig & {_retry: boolean}
        const isExpiredTokenError = error.status===401 && error.response?.data.detail === 'Access token expired.'

        if(originalRequest && isExpiredTokenError && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                const access_token = await getNewAccessToken()
                originalRequest.headers.Authorization = `Bearer ${access_token}`
                return api(originalRequest)
            }
            catch (error) {
                return Promise.reject(error)
            }
        }
        return Promise.reject(error)
    }
)
