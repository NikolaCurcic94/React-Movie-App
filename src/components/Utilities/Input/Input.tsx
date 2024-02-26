import React from 'react'
import "./Input.scss"

const Input = (props: any) => {

    return (
        <div className='input__search-movies__wrapper'>
            <label htmlFor={props.title}></label>
            <input id={props.title} type="text" className='input__search-movies' placeholder='Search Movies'></input>
            <button className='input__search-movies__close-button'></button>
        </div>
    )
}

export default Input
