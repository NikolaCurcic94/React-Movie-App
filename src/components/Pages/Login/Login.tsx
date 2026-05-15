import React, { useEffect, useState } from 'react'
import "./Login.scss"
import { Button, H1, Input } from '../AllComponents/AllComponets'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchUserFavorites } from '../../../redux/movies'

const Login = () => {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    let userStorage: string | null

    useEffect(() => {
        userStorage = window.localStorage.getItem("user")
        userStorage = JSON.parse(userStorage)
    }, [localStorage.getItem("user")])

    const handleLogin = async () => {
        try {
            const data = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "email": user,
                    "password": password
                })
            })
            if (!data.ok) {
                alert("Username or password is wrong!");
                return;
            }
            const token = await data.json();
            if (!token?.user?.favorites) {
                alert("Login failed: unexpected server response.");
                return;
            }
            localStorage.setItem("token", JSON.stringify(token))
            // Immediately apply this user's favorites to the Redux store so
            // Main.tsx's useSelector fires a re-render, which re-evaluates the
            // localStorage dep and triggers the getData() effect.
            dispatch(fetchUserFavorites(token.user.favorites))
            navigate('/')
            alert('You are logged in!')
        } catch (error) {
            alert("Username or password is wrong!");
        }
    }

    return (
        <>
            <H1>Login</H1>
            <form className='form-login' action="#">
                <div className='form-login__div'>
                    <Input setUserInfo={setUser} name='username' type="email">Username</Input>
                </div>
                <div className='form-login__div'>
                    <Input setUserInfo={setPassword} name='password' type="password">Password</Input>
                </div>
                <Button handleClick={handleLogin}>Login</Button>
            </form>
        </>
    )
}

export default Login