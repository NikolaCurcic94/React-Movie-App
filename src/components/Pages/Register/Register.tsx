import React, { useEffect, useState } from 'react'
import "./Register.scss"
import { Button, FormButton, H1, Input } from '../AllComponents/AllComponets'
import { Navigate, useNavigate } from 'react-router-dom'

const Register = () => {
    const [user, setUser] = useState()
    const [password, setPassword] = useState()
    const userLoggedIn = localStorage.getItem('token')
    const isUserRegistered = localStorage.getItem('user')
    const navigate = useNavigate()
    let userStorage: any

    useEffect(() => {
        userStorage = window.localStorage.getItem("user")
        userStorage = JSON.parse(userStorage)
        // console.log(userStorage?.favorites,'userStorage');
        // userStorage && dispatch(fetchUserFavorites(userStorage?.favorites))

    }, [localStorage.getItem("user")])

    console.log(localStorage.getItem("user"));

    const handleRegister = async () => {
        console.log('HANDLER');
        const data = await fetch('https://movieapp-wnsi.onrender.com/api/auth/register', {
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
        const result = await data.json()
        localStorage.setItem('user', JSON.stringify(result))
        console.log(result);
        navigate('/login')
        alert('Registration was sucsessfull!')
    }
    return (
        <>
            <H1>Register</H1>
            <form className='form-register' action="#">
                <div className='form-register__div'>
                    <Input setUserInfo={setUser} name='username' type="email">Username</Input>
                </div>
                <div className='form-register__div'>
                    <Input setUserInfo={setPassword} name='password' type="password">Password</Input>
                </div>
                <Button handleClick={handleRegister}>Register</Button>
            </form>
        </>
    )
}

export default Register