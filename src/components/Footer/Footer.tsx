import React, { useEffect, useState } from 'react'
import './Footer.scss'
import { NavLink } from 'react-router-dom'

const Footer = () => {
    const [token, setToken] = useState<any>()
    useEffect(() => {
        const checkLocalStorage: any = localStorage.getItem("token")
        setToken(checkLocalStorage)
    }, [localStorage.getItem('token')])

    return (
        <div className='container'>
            <footer className='footer'>
                <nav className='footer__nav'>
                    <ul className='footer__nav-list'>
                        <li className='footer__list-item first'>MOVIES © 2023</li>
                        {token && <li className='footer__list-item'><NavLink className='header__list-link' to="/" style={({ isActive }) => {
                            return isActive ? { color: "#5A4AF4" } : {}
                        }}>All Movies</NavLink></li>}
                        {token && <li className='footer__list-item'>/</li>}
                        {token && <li className='footer__list-item'><NavLink className='header__list-link' to="/favorites" style={({ isActive }) => {
                            return isActive ? { color: "#5A4AF4" } : {}
                        }}>Favorites</NavLink></li>}
                        {token && <li className='footer__list-item'>/</li>}
                        {token && <li className='footer__list-item'><NavLink className='header__list-link' to="/addmovie" style={({ isActive }) => {
                            return isActive ? { color: "#5A4AF4" } : {}
                        }}>Add new movie</NavLink></li>}
                    </ul>
                </nav>
            </footer>
        </div>
    )
}

export default Footer