import React, { useState } from 'react'
import './AddNewMovie.scss'
import { FormButton, H1, Input, InputActors, SelectGenre } from '../AllComponents/AllComponets'
import addMovieBanner from '../../../assets/images/add-movie.png'
import { Movie } from '../../../typesOfData/typesOFdata'
import { useDispatch } from 'react-redux'
import { fetchPostMovie } from '../../../redux/movies'
import { useNavigate } from 'react-router-dom'

interface ParsedToken {
    token: string
    user: { _id: string }
}

interface NewMoviePayload {
    title: string
    year: string
    director: string
    actors: string[]
    genre: string[]
    description: string
    imgUrl: string
}

const AddNewMovie = () => {
    const [newMovie, setNewMovie] = useState<Movie | undefined>(undefined)
    const [actorsArray, setActorsArray] = useState<string[]>([])
    const [selectedGenre, setSelectedGenre] = useState<string[]>([])
    const [titleError, setTitleError] = useState(false)
    const [yearError, setYearError] = useState(false)
    const [directorError, setDirectorError] = useState(false)
    const [actorsError, setActorsError] = useState(false)
    const [genreError, setGenreError] = useState(false)
    const [descriptionError, setDescriptionError] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const postMovie = async (newMovie: NewMoviePayload): Promise<boolean> => {
        const rawToken = localStorage.getItem('token')
        const userToken: ParsedToken | null = rawToken ? JSON.parse(rawToken) : null
        try {
            const api = 'http://localhost:3001/api/movies'
            const data = await fetch(api, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": userToken?.token ?? ''
                },
                body: JSON.stringify(newMovie)
            })
            if (!data.ok) {
                const err = await data.json()
                alert(`Failed to add movie: ${err.errors?.[0]?.msg || err.error || 'Unknown error'}`)
                return false
            }
            const result = await data.json()
            dispatch(fetchPostMovie(result))
            return true
        } catch (error) {
            alert(error)
            return false
        }
    }

    const formSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const elements = event.currentTarget.elements
        const movieTitle = (elements.namedItem('title') as HTMLInputElement).value
        const yearOfRealise = (elements.namedItem('year') as HTMLInputElement).value
        const movieDirector = (elements.namedItem('director') as HTMLInputElement).value
        const movieActors = actorsArray
        const movieGenre = selectedGenre
        const moiveStoryLine = (elements.namedItem('description') as HTMLInputElement).value
        const imageURL = (elements.namedItem('imgUrl') as HTMLInputElement).value

        setTitleError(movieTitle ? false : true)
        setYearError(yearOfRealise ? false : true)
        setDirectorError(movieDirector ? false : true)
        setActorsError(movieActors.length ? false : true)
        setGenreError(movieGenre.length ? false : true)
        setDescriptionError(moiveStoryLine ? false : true)

        if (movieTitle !== '' && yearOfRealise !== '' && movieDirector !== '' && movieActors.length > 0 && movieGenre.length > 0 && moiveStoryLine !== '') {
            const success = await postMovie({
                title: movieTitle,
                year: yearOfRealise,
                director: movieDirector,
                actors: movieActors,
                genre: movieGenre,
                description: moiveStoryLine,
                imgUrl: imageURL
            })
            if (success) {
                navigate('/')
                alert('You just added a new movie to the list!')
            }
        }
    }
    return (
        <section className='add-movie__section'>
            <div className='add-movie__section-column'>
                <H1 className="">Add new</H1>
                <img className='add-movie__imgage' src={addMovieBanner} alt="add movie banner" title='add movie' />
            </div>
            <div className='add-movie__section-column'>
                <form className='form' onSubmit={formSubmitHandler} action="#">
                    <Input isErrorClass={`${titleError && 'form__input--error'}`} name='title' type="text">Title</Input>
                    <Input isErrorClass={`${yearError && 'form__input--error'}`} name='year' type="text">Year</Input>
                    <Input isErrorClass={`${directorError && 'form__input--error'}`} name='director' type="text">Director</Input>
                    <InputActors isErrorClass={actorsError} actorsArray={actorsArray} setActorsArray={setActorsArray} name='actors' type="text">Add actor</InputActors>
                    <SelectGenre isErrorClass={genreError} selectedGenre={selectedGenre} setSelectedGenre={setSelectedGenre} name='genre'>Genres</SelectGenre>
                    <Input isErrorClass={`${descriptionError && 'form__input--error'}`} name='description' type="text">Storyline</Input>
                    <Input name='imgUrl' type="text">Image URL</Input>
                    <FormButton>Add movie</FormButton>
                </form>
            </div>
        </section>
    )
}

export default AddNewMovie
