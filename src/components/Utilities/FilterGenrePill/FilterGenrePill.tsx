import React, { useState } from 'react'
import './FilterGenrePill.scss'

type Props = {
    genre: string,
    setAllGenres: any
}

const FilterGenrePill = (props: Props) => {
    const [isActive, setIsActive] = useState(false)
    const { genre, setAllGenres } = props
    const isActiveHandler = () => {
        isActive ? setIsActive(false) : setIsActive(true)
        if (isActive === false) {
            setAllGenres((element: any) => {
                return [...element, genre]
            })
        } else {
            setAllGenres((element: any) => {
                return element?.filter((el: any) => el !== genre)
            })
        }
    }
    return (
        <div className={`genre-pill ${isActive ? 'genre-pill--active' : ""}`} onClick={isActiveHandler}>{genre}</div>
    )
}

export default FilterGenrePill