import React, { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom"
import "./Header.scss"
import logo from '../../assets/icons/logo.svg';
import arrowRight from '../../assets/icons/arrow-right.svg'
import menuButton from '../../assets/icons/menu.svg'


const Header = () => {
    const [token, setToken] = useState<any>()
    const [navigationVisibility, setNavigationVisibility] = useState(false)
    const navigate = useNavigate()
    const userIsRegistered = localStorage.getItem('user')

    useEffect(() => {
        const checkLocalStorage: any = localStorage.getItem("token")
        setToken(checkLocalStorage)
    }, [localStorage.getItem('token')])

    const handleLogout = () => {
        localStorage.removeItem('token')
        setToken('')
        navigate('/')
    }
    const handleNavigationVisibility = () => {
        navigationVisibility ? setNavigationVisibility(false) : setNavigationVisibility(true)
    }
    const navigationBlurHandler = () => {
        setNavigationVisibility(false)
    }
    return (
        <div className='container'>
            <header className='header'>
                <NavLink className='header__logo' to="/">
                    <img src={logo} alt='logo image' title='logo' />
                </NavLink>
                <nav className='header__nav'>
                    <ul className={`header__nav-list ${navigationVisibility && '--visible'}`} onBlur={navigationBlurHandler}>
                        <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/all-components" style={({ isActive }) => {
                                return isActive ? { color: "#5A4AF4" } : {}
                            }}>All Components</NavLink>
                        </li>
                        <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/" style={({ isActive }) => {
                                return isActive ? { color: "#5A4AF4" } : {}
                            }}>All Movies</NavLink>
                        </li>

                        {!token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/register" style={({ isActive }) => {
                                return isActive ? { color: "#5A4AF4" } : {}
                            }}>Register</NavLink></li>}
                        {token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/favorites" style={({ isActive }) => {
                                return isActive ? { color: "#5A4AF4" } : {}
                            }}>Favorites</NavLink>
                        </li>}
                        {token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/addmovie" style={({ isActive }) => {
                                return isActive ? { color: "#5A4AF4" } : {}
                            }}>Add new movie</NavLink>
                            <img src={arrowRight} alt="arrow image" title='arrow' />
                        </li>}
                        {!token && <li className='header__list-item'>
                            <NavLink className='header__list-link' to="/login" style={({ isActive }) => {
                                return isActive ? { color: "#5A4AF4" } : {}
                            }}>Login</NavLink></li>}
                        {token && <li className='header__list-item'><button className='button__log-out' onClick={handleLogout}>Log out</button></li>}

                    </ul>
                    <img src={menuButton} className='header__menu-button' onClick={handleNavigationVisibility} alt="menu button" title='menu' />
                </nav>
            </header>
        </div >
    )
}

export default Header