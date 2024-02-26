import { ReactElement, useEffect, useState } from 'react'
import MovieItem from '../MovieItem/MovieItem'
import "./MovieList.scss"
import { ButtonShowMore } from '../../../Pages/AllComponents/AllComponets'

const MovieList = (props: any) => {
    const { filteredMovies } = props
    const [loadedMovies, setLoadedMovies] = useState(filteredMovies)
    const [screenWidth, setScreenWidth] = useState({ width: window.innerWidth })
    const [initialLoadedMovies, setInitialLoadedMovies] = useState(screenWidth.width <= 834 ? 6 : 8)
    const [loadMoreNumber, setLoadMoreNumber] = useState(8)
    const [isVisibleMovies, setisVisibleMovies] = useState(initialLoadedMovies)

    useEffect(() => {
        const resizeHandler = () => {
            setScreenWidth({ width: window.innerWidth })
        }
        window.addEventListener('resize', resizeHandler)
        resizeHandler()
        return () => window.removeEventListener('resize', resizeHandler)
    }, [])

    useEffect(() => {
        setLoadedMovies(filteredMovies)
    }, [filteredMovies])

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
    // console.log(screenWidth.width)
    return (
        <div className='movie-list__wrapper'>
            <ul className='movie-list row'>
                {loadedMovies?.slice(0, isVisibleMovies).map((element: any, i: number) => {
                    return <MovieItem key={i} title={element.title} url={element.imgUrl} {...element} />
                })}
            </ul>
            <ButtonShowMore classList='show-more__button' handleClick={showMoreMoviesHandler}>Show more</ButtonShowMore>
        </div>
    )
}

export default MovieList