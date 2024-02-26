import React, { useState, useEffect } from 'react'
import './AllMovies.scss'
import { H1, H2, InputSearch, P } from '../AllComponents/AllComponets'
import FilterGenre from '../../Utilities/FilterGenre/FilterGenre'
import MovieList from '../../Utilities/Movies/MovieList/MovieList'
import { Movie } from '../../../typesOfData/typesOFdata'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'


const AllMovies = () => {
    const movies: Movie[] = useSelector((state: RootState) => state.movies.value)
    const [inputValue, getInputValue] = useState('')
    const [allGenres, setAllGenres] = useState([])

    useEffect(() => { }, [movies])

    const filteredMoviesBySearch = movies!?.filter((element) => {
        if (movies && element?.title)
            return element?.title?.toLocaleLowerCase().includes(inputValue)
    })
    let filteredMoviesByGenrePill;

    filteredMoviesByGenrePill = filteredMoviesBySearch?.filter(el => {
        const item = el.genre
        const itemArr = allGenres?.some(elGenre => item.includes(elGenre))
        return itemArr
    })
    return (
        <div className='all-movies'>
            <H1>All Movies</H1>
            <p className='all-movies__paragrpah'>List of all movies we current</p>
            <InputSearch getInputValue={getInputValue} />
            <FilterGenre setAllGenres={setAllGenres} />
            <div className='movies-number-render'>
                <H2>All</H2><p>{movies?.length}</p>
            </div>
            <MovieList filteredMovies={allGenres.length ? filteredMoviesByGenrePill : filteredMoviesBySearch} />
        </div>
    )
}

export default AllMovies