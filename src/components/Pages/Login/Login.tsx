import React, { useEffect, useState } from 'react'
import "./Login.scss"
import { Button, H1, Input } from '../AllComponents/AllComponets'
import { Navigate, useNavigate } from 'react-router-dom'

const Login = () => {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    // const userLoggedIn = localStorage.getItem('token')
    // const isUserRegistered = localStorage.getItem('user')
    const navigate = useNavigate()
    let userStorage: any

    useEffect(() => {
        userStorage = window.localStorage.getItem("user")
        userStorage = JSON.parse(userStorage)
    }, [localStorage.getItem("user")])

    const handleLogin = async () => {
        // console.log('HANDLER LOGIN');
        try {
            const data = await fetch('https://movieapp-wnsi.onrender.com/api/auth/login', {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Content-Length": "<calculated when request is sent>",
                    "Host": "<calculated when request is sent>",
                    "Accept": "*/*",
                    "Access-Control-Allow-Origin": "*"
                },
                body: JSON.stringify({
                    "email": user,
                    "password": password
                })
            })
            const token = await data.json();
            localStorage.setItem("token", JSON.stringify(token))
            navigate('/')
            alert('You are logged in!')
            // console.log(token);

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