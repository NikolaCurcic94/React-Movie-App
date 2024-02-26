import { useSelector } from 'react-redux'
import { Movie } from '../../../typesOfData/typesOFdata'
import { RootState } from '../../../redux/store'
import MovieItem from '../../Utilities/Movies/MovieItem/MovieItem'
import { ButtonShowMore, H1, InputSearch, P } from '../AllComponents/AllComponets'
import './Favorites.scss'
import { useEffect, useState } from 'react'
import { click } from '@testing-library/user-event/dist/click'

const Favorites = () => {
    const [screenWidth, setScreenWidth] = useState({ width: window.innerWidth })
    const [initialLoadedMovies, setInitialLoadedMovies] = useState(screenWidth.width <= 834 ? 6 : 8)
    const [loadMoreNumber, setLoadMoreNumber] = useState(8)
    const [isVisibleMovies, setisVisibleMovies] = useState(initialLoadedMovies)

    const movies: Movie[] = useSelector((state: RootState) => state.movies.value)
    let numberOfFavorites = []
    movies.forEach((element) => {
        if (element.favorite === true) {
            numberOfFavorites.push(element.favorite)
        }
    })
    useEffect(() => {
        const resizeHandler = () => {
            setScreenWidth({ width: window.innerWidth })
        }
        window.addEventListener('resize', resizeHandler)
        resizeHandler()
        return () => window.removeEventListener('resize', resizeHandler)
    }, [])


    useEffect(() => {
        if (screenWidth.width < 834) {
            setLoadMoreNumber(6)
            setInitialLoadedMovies(6)
        } else {
            setLoadMoreNumber(8)
            setInitialLoadedMovies(8)
        }
    }, [screenWidth.width])

    const showMoreMoviesHandler = () => {
        setisVisibleMovies(prevLoadedMovies => prevLoadedMovies + loadMoreNumber)
    }
    return (
        <>
            <H1>Favorites</H1>
            <InputSearch />
            <p className='number-of-favorites'>{numberOfFavorites.length} items</p>
            <ul className='movie-list row'>
                {movies?.slice(0, isVisibleMovies).map((element: any, i: number) => {
                    if (element.favorite === true) {
                        return <MovieItem key={i} title={element.title} url={element.imgUrl} {...element} />
                    }
                })}
            </ul>
            <ButtonShowMore classList='show-more__button' handleClick={showMoreMoviesHandler}>Show more</ButtonShowMore>
        </>
    )
}

export default Favorites