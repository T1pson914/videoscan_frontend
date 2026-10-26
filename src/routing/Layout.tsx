import { Link, Outlet, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'
import { useContext, useEffect, useState } from 'react'
import { authContext } from '../auth/context'



export function Layout(){

    const [isOpen,setIsOpen] = useState(false)

    const {pathname} = useLocation()

    const authEntities = useContext(authContext)

    useEffect(()=>{
        setIsOpen(false)
    },[pathname])

    const burger_style = isOpen ? `${styles.Burger} ${styles.OpenBurger}` : `${styles.Burger}`

    const mobile_nav_style = isOpen ? `${styles.MobileNav} ${styles.OpenMobileNav}` : `${styles.MobileNav}`
    
    const rightSide = authEntities?.isAuth ? (
        <>
            <Link to='/user/profile'>Профиль</Link>
            <Link to='/user/logout'>Выход</Link>
        </>
    ) : (
        <>
            <Link to='/user/login'>Вход</Link>
            <Link to='/user/register'> Регистрация</Link>
        </>
    )

    return (
        <>
            <header className={styles.Header}>
                <div className={burger_style} onClick={()=>{setIsOpen(prev=>!prev)}}>
                    <span className={styles.First}></span>
                    <span className={styles.Second}></span>
                    <span className={styles.Third}></span>
                </div>
                <nav className={mobile_nav_style}>
                    <Link to='/'>Главная</Link>               
                    {rightSide}
                </nav>
                <nav className={styles.Nav}>
                    <div className={styles.LeftLinks}>
                        <Link to='/'>Главная</Link>
                    </div>
                    <div className={styles.RightLinks}>
                        {rightSide}
                    </div>
                </nav>
            </header>
            <main className={styles.Main}>
                <Outlet />
            </main>
        </>
    )
}
