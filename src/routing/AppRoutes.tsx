import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout.tsx";
import { Home } from "./pages/Home/Home.tsx";
import { Login } from "../auth/auth_pages/Login/Login.tsx";
import { Register } from "../auth/auth_pages/Register/Register.tsx";
import { Profile } from "../auth/auth_pages/Profile/Profile.tsx";
import { Logout } from "../auth/auth_pages/Logout.tsx";
import { ProtectedRoute } from "../auth/auth_pages/ProtectedRoute.tsx";
import { LoginConfirm } from "../auth/auth_pages/LoginConfirm/LoginConfirm.tsx"



export function AppRoutes(){
    return (
        <>
            <Routes>
                <Route path="/" element={ <Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/user/login" element={<Login />} />
                    <Route path="/user/register" element={<Register />} />
                    <Route path="/user/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
                    <Route path="/user/logout" element={<ProtectedRoute><Logout/></ProtectedRoute>} />
                    <Route path="/user/login-confirm" element={<LoginConfirm />} />
                </Route>
            </Routes>
        </>
    )
}
