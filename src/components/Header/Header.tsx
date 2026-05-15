import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom"
import "./Header.scss"
import logo from '../../assets/icons/logo.svg';
import arrowRight from '../../assets/icons/arrow-right.svg'
import menuButton from '../../assets/icons/menu.svg'
import { useDispatch } from 'react-redux'
import { clearAllFavorites } from '../../redux/movies'


const Header = () => {
    const [token, setToken] = useState<string | null>(null)
    const [navigationVisibility, setNavigationVisibility] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userIsRegistered = localStorage.getItem('user')
    const navListRef = useRef<HTMLUListElement>(null)
    const menuButtonRef = useRef<HTMLImageElement>(null)

    useEffect(() => {
        const checkLocalStorage = localStorage.getItem("token")
        setToken(checkLocalStorage)
    }, [localStorage.getItem('token')])

    useEffect(() => {
        if (!navigationVisibility) return

        const handleOutsideClick = (event: MouseEvent) => {
            if (navListRef.current?.contains(event.target as Node)) return
            if (menuButtonRef.current?.contains(event.target as Node)) return
            setNavigationVisibility(false)
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => document.removeEventListener('mousedown', handleOutsideClick)
    }, [navigationVisibility])

    const userEmail: string | null = (() => {
        if (!token) return null
        try { return JSON.parse(token)?.user?.email ?? null } catch { return null }
    })()

    const handleLogout = () => {
        localStorage.removeItem('token')
        dispatch(clearAllFavorites())
        setToken('')
        navigate('/')
        alert('You just logged out!')
    }
    const handleNavigationVisibility = () => {
        setNavigationVisibility(prev => !prev)
    }

    return (
        <div className='container'>
            <header className='header'>
                <NavLink className='header__logo' to="/">
                    <img src={logo} alt='logo' title='logo' />
                </NavLink>
                <nav className='header__nav'>
                    <ul ref={navListRef} className={`header__nav-list ${navigationVisibility && '--visible'}`}>
                        <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/all-components">All Components</NavLink>
                        </li>
                        <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/">All Movies</NavLink>
                        </li>

                        {!token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/register">Register</NavLink>
                        </li>}
                        {token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/favorites">Favorites</NavLink>
                        </li>}
                        {token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/addmovie">Add new movie</NavLink>
                            <img src={arrowRight} alt="arrow image" title='arrow' />
                        </li>}
                        {!token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/login">Login</NavLink>
                        </li>}
                        {token && userEmail && <li className='header__list-item'>
                            <span className='header__user-email'>Logged as: {userEmail}</span>
                        </li>}
                        {token && <li className='header__list-item'><button className='button__log-out' onClick={handleLogout}>Log out</button></li>}

                    </ul>
                    <img ref={menuButtonRef} src={menuButton} className='header__menu-button' onClick={handleNavigationVisibility} alt="menu button" title='menu' />
                </nav>
            </header>
        </div >
    )
}

export default Header