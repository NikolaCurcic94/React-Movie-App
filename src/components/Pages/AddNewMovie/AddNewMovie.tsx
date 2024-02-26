import React, { useState } from 'react'
import './AddNewMovie.scss'
import { FormButton, H1, Input, InputActors, SelectGenre } from '../AllComponents/AllComponets'
import addMovieBanner from '../../../assets/images/add-movie.png'
import { Movie } from '../../../typesOfData/typesOFdata'
import { useDispatch } from 'react-redux'
import { fetchPostMovie } from '../../../redux/movies'
import { useNavigate } from 'react-router-dom'

const AddNewMovie = () => {
    const [newMovie, setNewMovie] = useState<any>()
    const [actorsArray, setActorsArray] = useState<any>([])
    const [selectedGenre, setSelectedGenre] = useState<any>([])
    const [titleError, setTitleError] = useState<any>(false)
    const [yearError, setYearError] = useState<any>(false)
    const [directorError, setDirectorError] = useState<any>(false)
    const [actorsError, setActorsError] = useState<any>(false)
    const [genreError, setGenreError] = useState<any>(false)
    const [descriptionError, setDescriptionError] = useState<any>(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const postMovie = async (newMovie: any) => {
        let userToken: any = localStorage.getItem('token')
        userToken = JSON.parse(userToken)
        // console.log(userToken.token)
        try {
            const api = 'https://movieapp-wnsi.onrender.com/api/movies'
            const data = await fetch(api, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json",
                    "Content-Length": "<calculated when request is sent>",
                    "Host": "<calculated when request is sent>",
                    "Accept": "*/*",
                    "Access-Control-Allow-Origin": "*",
                    "authorization": userToken?.token
                },
                body: JSON.stringify(
                    newMovie
                )
            })
            const result = await data.json();
            dispatch(fetchPostMovie(result))
        } catch (error) {
            alert(error)
        }
    }

    const formSubmitHandler = async (event: any) => {
        event.preventDefault()
        const movieTitle = event.target['title'].value;
        const yearOfRealise = event.target['year'].value;
        const movieDirector = event.target['director'].value;
        const movieActors = actorsArray;
        const movieGenre = selectedGenre;
        const moiveStoryLine = event.target['description'].value
        const imageURL = event.target['imgUrl'].value;

        setTitleError(movieTitle ? false : true)
        setYearError(yearOfRealise ? false : true)
        setDirectorError(movieDirector ? false : true)
        setActorsError(movieActors.length ? false : true)
        setGenreError(movieGenre.length ? false : true)
        setDescriptionError(moiveStoryLine ? false : true)

        if (movieTitle !== '' && yearOfRealise !== '' && movieDirector !== '' && movieActors.length > 0 && movieGenre.length > 0 && moiveStoryLine !== '') {
            console.log('true');
            await setNewMovie({
                title: movieTitle,
                year: yearOfRealise,
                director: movieDirector,
                actors: movieActors,
                genre: movieGenre,
                description: moiveStoryLine,
                imgUrl: imageURL
            })
            await postMovie({
                title: movieTitle,
                year: yearOfRealise,
                director: movieDirector,
                actors: movieActors,
                genre: movieGenre,
                description: moiveStoryLine,
                imgUrl: imageURL
            })
            navigate('/');
            alert('You just added a new movie to the list!')
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