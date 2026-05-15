import React, { useState, useEffect } from 'react'
import './FilterGenre.scss'
import { Movie } from '../../../typesOfData/typesOFdata'
import FilterGenrePill from '../FilterGenrePill/FilterGenrePill'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'

interface FilterGenreProps {
    setAllGenres: React.Dispatch<React.SetStateAction<string[]>>
}

const FilterGenre = ({ setAllGenres }: FilterGenreProps) => {
    const movies: Movie[] = useSelector((state: RootState) => state.movies.value)
    let arrayOfGenres: string[] = []
    movies?.filter((element) => {
        if (arrayOfGenres && element.genre) {
            arrayOfGenres = [...arrayOfGenres, ...element?.genre]
        }
    });
    let filteredGenres: string[] = []

    arrayOfGenres?.forEach((element: string) => {
        if (!filteredGenres.includes(element)) {
            filteredGenres.push(element);
        }
    });

    return (
        <ul className='filter-genres'>
            {filteredGenres?.map((element: string, i: number) => {
                return <FilterGenrePill setAllGenres={setAllGenres} key={i} genre={element} />
            })}
        </ul>
    )
}

export default FilterGenre