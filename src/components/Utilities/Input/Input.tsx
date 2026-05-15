import React from 'react'
import "./Input.scss"

interface InputProps {
    title?: string
}

const Input = ({ title }: InputProps) => {
    return (
        <div className='input__search-movies__wrapper'>
            <label htmlFor={title}></label>
            <input id={title} type="text" className='input__search-movies' placeholder='Search Movies'></input>
            <button className='input__search-movies__close-button'></button>
        </div>
    )
}

export default Input
