import { createContext } from "react";



interface AuthContextSchema {
    user_id: number | null,
    isAuth: boolean,
    setIsAuth: (value: boolean) => void,
    setUserId: (value: number) => void
}


export const authContext = createContext<AuthContextSchema | null>(null)
