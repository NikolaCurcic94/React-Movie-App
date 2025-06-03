import React, { ReactElement, ReactNode, useState, useEffect, useRef } from 'react'
import Select from 'react-select'
import { fetchGenres } from '../../../api/api'
import './AllComponents.scss'
import { useDispatch } from 'react-redux'
import { fecthCurrentMovieID } from '../../../redux/movieDetails'
import { colors } from 'react-select/dist/declarations/src/theme'
import StarUnfilled from '../../../assets/icons/star.svg'
import StarFilled from '../../../assets/icons/filled-star.svg'
import { fetchUserFavorites } from '../../../redux/movies'

export const H1 = (props: any) => {
    const children = props.children
    return <h1>{children}</h1>
}
export const H2 = (props: any) => {
    const children = props.children
    return <h2>{children}</h2>
}
export const H3 = (props: any) => {
    const children = props.children
    return <h3>{children}</h3>
}
export const H4 = (props: any) => {
    const children = props.children
    return <h4>{children}</h4>
}
export const H5 = (props: any) => {
    const children = props.children
    return <h5>{children}</h5>
}
export const H6 = (props: any) => {
    const children = props.children
    return <h6>{children}</h6>
}
export const Button = (props: any) => {
    const children = props.children
    const { handleClick } = props
    return <button onClick={handleClick} type='button' className='button'>{children}</button>
}
export const ButtonMovieDetails = (props: any) => {
    const dispatch = useDispatch()
    const getCurrentMovieHandler = () => {
        dispatch(fecthCurrentMovieID(props.currentMovie));
    }
    const children = props.children
    return <button onClick={getCurrentMovieHandler} className='movie-details__button'>{children}</button>
}
export const FormButton = (props: any) => {
    const children = props.children
    return <button type='submit' className='form__button'>{children}</button>
}
export const ButtonShowMore = (props: any) => {
    const children = props.children
    const { handleClick } = props
    return <button onClick={handleClick} type='button' className='show-more__button'>{children}</button>
}
export const ButtonNavigate = (props: any) => {
    const children = props.children
    const { handleClick } = props
    return <button onClick={handleClick} type='button' className='navigate__button'>{children}</button>
}
export const P = (props: any) => {
    const children = props.children
    return <p>{children}</p>
}
export const Label = (props: any) => {
    const children = props.children
    return <label>{children}</label>
}
export const Input = (props: any) => {
    const children = props.children
    const { name, setUserInfo, isErrorClass } = props
    const [inputIsFocused, setInputIsFocused] = useState(false)

    const inputFocusHandler = () => {
        setInputIsFocused(true)
    }
    const inputBlurHandler = (event: any) => {
        if (event.target.value !== '') {
            return
        }
        setInputIsFocused(false)
    }
    const inputChangeHandler = (event: any) => {
        if (event.target.value !== "") {
            if (setUserInfo) {
                setUserInfo(event.target.value)
            }
            if (event.target.classList.contains(isErrorClass)) {
                event.target.classList.remove(isErrorClass)
            }
            if (event.target.parentElement.classList.contains(isErrorClass)) {
                event.target.parentElement.classList.remove(isErrorClass)
            }
        } else {
            event.target.classList.add(isErrorClass)
            event.target.parentElement.classList.add(isErrorClass)
        }
    }
    return <div className={`form__input-wrapper ${isErrorClass}`}>
        <label htmlFor={children} className={`form__label ${inputIsFocused ? "form__label--moved-up" : ""}`}>{children}</label>
        <input name={props.name} id={children} type={props.type} className={`form__input ${isErrorClass}`} onChange={inputChangeHandler} onBlur={inputBlurHandler} onFocus={inputFocusHandler}></input>
    </div>
}
export const InputActors = (props: any) => {
    const children = props.children
    const { name, setUserInfo, actorsArray, setActorsArray, isErrorClass } = props
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const actorsInputRef: any = useRef()

    const inputFocusHandler = () => {
        setInputIsFocused(true)
    }
    const inputBlurHandler = (event: any) => {
        if (event.currentTarget.value !== '') {
            return
        }
        setInputIsFocused(false)
    }
    const addActorHandler = () => {
        let newActor = actorsInputRef.current.value
        setActorsArray([...actorsArray, newActor])
        actorsInputRef.current.value = ''
    }
    return <div className={`form__input-wrapper ${!actorsArray?.length && isErrorClass && 'form__input--error'}`}>
        <label htmlFor={children} className={`form__label ${inputIsFocused ? "form__label--moved-up" : ""}`}>{children}</label>
        <input ref={actorsInputRef} name={props.name} id={children} type={props.type} className={`form__input ${!actorsArray?.length && isErrorClass && 'form__input--error'}`} onBlur={inputBlurHandler} onFocus={inputFocusHandler}></input>
        <button onClick={addActorHandler} type='button' className='button__add-actor'>Add</button>
        <div className='render-actors__input'>
            {actorsArray?.length > 0 ? <span className='actors-label'>Actors :</span> : ""}
            {actorsArray?.map((element: string, i: number) => {
                return <p key={i} className='array-of-actors'>{element}{i === actorsArray?.length - 1 ? "." : ", "}</p>
            })}
        </div>
    </div>
}
export const SelectGenre = (props: any) => {
    const [genreData, setGenreData] = useState<any>()
    const [isActive, setIsActive] = useState(false);
    const selectRef: any = useRef()
    const children = props.children
    const { selectedGenre, setSelectedGenre, isErrorClass } = props

    useEffect(() => {
        fetchGenres().then(data => setGenreData(data))
    }, [])
    const handleClick = () => {
        setIsActive(current => !current);
    };
    const inputChangeHandler = (event: any) => {
        if (event.target.value !== "") {

            if (event.target.classList.contains(isErrorClass)) {
                event.target.classList.remove(isErrorClass)
            }
            if (event.target.parentElement.classList.contains(isErrorClass)) {
                event.target.parentElement.classList.remove(isErrorClass)
            }
        } else {
            event.target.classList.add(isErrorClass)
            event.target.parentElement.classList.add(isErrorClass)
        }
        setSelectedGenre([...selectedGenre, event.target.value])
    }
    const selectBlurHandler = (event: any) => {
        setIsActive(current => !current);
    }
    const renderingGenre = selectedGenre?.map((element: string, i: number) => {
        return <span key={i} className='array-of-genres'>{element}{i === selectedGenre?.length - 1 ? "." : ", "}</span>
    })

    return <div className={`choose-genre__wrapper ${!genreData?.length && isErrorClass && 'form__input--error'}`}>
        <label htmlFor={children} onClick={handleClick} className={`label__choose-genre ${!selectedGenre?.length && isErrorClass && 'form__input--error'}`}>{selectedGenre?.length > 0 ? renderingGenre : 'Genres'}</label>
        <select ref={selectRef} onBlur={selectBlurHandler} onChange={inputChangeHandler} multiple className={`select__choose-genre ${isActive && "--rendering"}`} name={props.name} id={children} value={selectedGenre}>
            {genreData?.map((element: any, i: number) => <option key={i} className="option__choose-genre">{element.value}</option>
            )}
        </select>
    </div>
}
export const InputSearch = (props: any) => {
    const [enteredValue, setEnteredValue] = useState('')
    const children = props.children
    const { getInputValue } = props
    const inputChangeHandler = (event: any) => {
        setEnteredValue(event.target.value)
        getInputValue(event.target.value)
    }
    const clearInputHandler = () => {
        setEnteredValue('')
        getInputValue('')
    }
    return <div className='input__search-movies__wrapper'>
        <label htmlFor={props.title} className='input__search-movies__label'>{children}</label>
        <input id={props.title} type="text" className='input__search-movies' value={enteredValue} onChange={inputChangeHandler} />
        <button className='input__search-movies__close-button' onClick={clearInputHandler}></button>
    </div>
}
export const Star = (props: any) => {
    const dispatch = useDispatch()
    const { id, isFavorite } = props
    let userLocasStorage: any = localStorage.getItem('token')
    userLocasStorage = JSON.parse(userLocasStorage)

    const [isRendering, setIsRendering] = useState(isFavorite)

    const starRenderingHandler = async () => {
        if (!userLocasStorage) {
            alert('You need to be logged in to add this movie to favorites')
            return
        }
        isRendering ? setIsRendering(false) : setIsRendering(true)

        let arrayOfFavorites = [...userLocasStorage.user.favorites]

        //ako je state false ubaci u niz ako je true izbaci sa filterom
        if (isRendering === false) {
            arrayOfFavorites = [...arrayOfFavorites, id]
        } else if (isRendering === true) {
            arrayOfFavorites = arrayOfFavorites.filter(element => {
                return element !== id
            })
        }
        const data = await fetch(`https://movieapp-wnsi.onrender.com/api/users/${userLocasStorage.user._id}`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
                "Content-Length": "<calculated when request is sent>",
                "Host": "<calculated when request is sent>",
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "authorization": userLocasStorage.token
            },
            body: JSON.stringify({
                "favorites": arrayOfFavorites
            })
        })
        let res = await data.json()

        dispatch(fetchUserFavorites(arrayOfFavorites))
        userLocasStorage.user.favorites = arrayOfFavorites
        localStorage.setItem("token", JSON.stringify(userLocasStorage))
    }
    const children = props.children

    return (<div className='star-wrapper' onClick={starRenderingHandler}>
        {isRendering ? <img src={StarFilled} style={{ width: "16px" }} alt="star image" title='star' /> : <img src={StarUnfilled} alt="star image" title='star' />}
    </div>)
}

const AllComponents = () => {
    return (
        <div className='container'>
            <section className='section'>
                <H1>Typography</H1>
                <hr />
                <H1>Heading One</H1>
                <H2>Heading Two</H2>
                <H3>Heading Three</H3>
                <H4>Heading Four</H4>
                <H5>Heading Five</H5>
                <H6>Heading Six</H6>
            </section>
            <section className='section'>
                <H1>HTML Elements</H1>
                <hr />
                <P>Lorem ipsum</P>
                <InputSearch></InputSearch>
                <Input>Input</Input>
                <InputActors></InputActors>
                <SelectGenre>Select genre</SelectGenre>
                <Button>Button</Button>
                <FormButton>Form Button</FormButton>
                <ButtonMovieDetails>Button movie details</ButtonMovieDetails>
                <ButtonShowMore>Button show more</ButtonShowMore>
                <ButtonNavigate>Go home</ButtonNavigate>
                <Star />
            </section>
        </div>
    )
}

export default AllComponents