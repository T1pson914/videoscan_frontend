import { useState } from 'react'
import { AppRoutes } from './routing/AppRoutes.tsx'
import { authContext } from './auth/context.ts'



export function App(){

	const [isAuth,setIsAuth] = useState(()=>{
		const access_token = localStorage.getItem('access_token')
		if (access_token) {
			return true
		}
		return false
	})

	const [user_id,setUserId] = useState(0)
	
	return (
		<>
			<authContext.Provider value={{isAuth,setIsAuth,user_id,setUserId}}>
				<AppRoutes />
			</authContext.Provider>
		</>
	)
}
