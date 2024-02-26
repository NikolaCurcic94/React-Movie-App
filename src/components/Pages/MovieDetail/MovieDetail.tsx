import React, { useState } from 'react'
import './MovieDetail.scss'
import { H3, H4, H6, P, Star } from '../AllComponents/AllComponets'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Movie } from '../../../typesOfData/typesOFdata'
import { RootState } from '../../../redux/store'

const MovieDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    let movies: Movie[] = useSelector((state: RootState) => state.movies.value)

    let currentMovie: any;

    const movieDetails = useSelector((state: RootState) => {
        return state.movieDetails.value;
    })

    if (Object.keys(movieDetails).length < 1) {
        movies = movies?.filter((element?: any) => {
            return element.title === id
        })
        currentMovie = movies[0]
        if (currentMovie === undefined) {
            navigate('/error')
        }
    }
    const { title, year, genre, imgUrl, description, favorite, director, actors, _id } = currentMovie ? currentMovie : movieDetails
    return (
        <>
            <div className='movie-detail'>
                <div className='movie-detail__background' style={{ background: `linear-gradient(180deg, rgba(54, 44, 146, 0.40) 0%, rgba(18, 98, 151, 0.40) 100%), url(${currentMovie ? currentMovie.imgUrl : movieDetails.imgUrl}),lightgray 50%`, backgroundRepeat: "no-repeat", backgroundSize: "100%", backgroundPositionY: "center" }}></div>
                <div className='movie-detail__content'>
                    <div className='movie-detail__content-label'>
                        <div className='movie-detail-genre__card'>
                            <div className='card__row'>
                                {genre?.map((element: string, i: number) => {
                                    return <div key={i}>
                                        <span className='card__col genre'>{element}</span><span className='card__col backslash'>{i === genre.length - 1 ? "" : "/"}</span>
                                    </div>
                                })}
                            </div>
                            <div className='card__row'>
                                <H3>{title}</H3>
                            </div>
                        </div>
                        <div className='movie-detail__poster' style={{ background: `url(${currentMovie ? currentMovie.imgUrl : movieDetails.imgUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover" }}></div>
                    </div>
                    <div className='movie-detail__content-about'>
                        <H4>Storyline</H4>
                        <P>{description}</P>
                        <H6>Favorite</H6>
                        <Star id={_id} isFavorite={favorite} />
                        <H6>Year of release</H6>
                        <P>{year}</P>
                        <H6>Director</H6>
                        <P>{director}</P>
                        <H6>Actors</H6>
                        <div className='render-actors'>{actors?.map((element: any, i: any) => {
                            return <p key={i}>{element}{i === actors.length - 1 ? "." : ", "}</p>
                        })}</div>
                        <H6>Genres</H6>
                        <div className='render-genre'>
                            {genre?.map((element: string, i: number) => {
                                return <p key={i} className='array-of-genre'>{element}{i === genre.length - 1 ? "." : ", "}</p>
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </>)
}

export default MovieDetail