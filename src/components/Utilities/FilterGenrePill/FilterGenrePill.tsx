import React, { useState } from 'react'
import './FilterGenrePill.scss'

type Props = {
    genre: string
    setAllGenres: React.Dispatch<React.SetStateAction<string[]>>
}

const FilterGenrePill = ({ genre, setAllGenres }: Props) => {
    const [isActive, setIsActive] = useState(false)
    const isActiveHandler = () => {
        isActive ? setIsActive(false) : setIsActive(true)
        if (isActive === false) {
            setAllGenres((prev) => [...prev, genre])
        } else {
            setAllGenres((prev) => prev.filter((el) => el !== genre))
        }
    }
    return (
        <div className={`genre-pill ${isActive ? 'genre-pill--active' : ""}`} onClick={isActiveHandler}>{genre}</div>
    )
}

export default FilterGenrePill