import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { fetchGenres } from '../../../api/api'
import './AllComponents.scss'
import { useDispatch } from 'react-redux'
import { fecthCurrentMovieID } from '../../../redux/movieDetails'
import StarUnfilled from '../../../assets/icons/star.svg'
import StarFilled from '../../../assets/icons/filled-star.svg'
import { fetchUserFavorites } from '../../../redux/movies'
import { Movie } from '../../../typesOfData/typesOFdata'

interface ParsedToken {
    token: string
    user: {
        _id: string
        email: string
        favorites: string[]
    }
}

interface HeadingProps {
    children?: ReactNode
    className?: string
}

interface ButtonProps {
    children?: ReactNode
    handleClick?: () => void
}

interface ButtonMovieDetailsProps {
    children?: ReactNode
    currentMovie?: Movie
}

interface ButtonShowMoreProps {
    children?: ReactNode
    handleClick?: () => void
    classList?: string
}

interface InputProps {
    children?: ReactNode
    name?: string
    type?: string
    setUserInfo?: (value: string) => void
    isErrorClass?: string
}

interface InputActorsProps {
    children?: ReactNode
    name?: string
    type?: string
    setUserInfo?: (value: string) => void
    actorsArray: string[]
    setActorsArray: React.Dispatch<React.SetStateAction<string[]>>
    isErrorClass?: boolean
}

interface GenreOption {
    value: string
    label: string
}

interface SelectGenreProps {
    children?: ReactNode
    name?: string
    selectedGenre: string[]
    setSelectedGenre: React.Dispatch<React.SetStateAction<string[]>>
    isErrorClass?: boolean
}

interface InputSearchProps {
    children?: ReactNode
    title?: string
    getInputValue?: (value: string) => void
}

interface StarProps {
    id?: string
    isFavorite?: boolean
}

export const H1 = ({ children }: HeadingProps) => <h1>{children}</h1>
export const H2 = ({ children }: HeadingProps) => <h2>{children}</h2>
export const H3 = ({ children }: HeadingProps) => <h3>{children}</h3>
export const H4 = ({ children }: HeadingProps) => <h4>{children}</h4>
export const H5 = ({ children }: HeadingProps) => <h5>{children}</h5>
export const H6 = ({ children }: HeadingProps) => <h6>{children}</h6>

export const Button = ({ children, handleClick }: ButtonProps) => (
    <button onClick={handleClick} type='button' className='button'>{children}</button>
)

export const ButtonMovieDetails = ({ children, currentMovie }: ButtonMovieDetailsProps) => {
    const dispatch = useDispatch()
    const getCurrentMovieHandler = () => {
        dispatch(fecthCurrentMovieID(currentMovie))
    }
    return <button onClick={getCurrentMovieHandler} className='movie-details__button'>{children}</button>
}

export const FormButton = ({ children }: { children?: ReactNode }) => (
    <button type='submit' className='form__button'>{children}</button>
)

export const ButtonShowMore = ({ children, handleClick }: ButtonShowMoreProps) => (
    <button onClick={handleClick} type='button' className='show-more__button'>{children}</button>
)

export const ButtonNavigate = ({ children, handleClick }: ButtonProps) => (
    <button onClick={handleClick} type='button' className='navigate__button'>{children}</button>
)

export const P = ({ children }: { children?: ReactNode }) => <p>{children}</p>

export const Label = ({ children }: { children?: ReactNode }) => <label>{children}</label>

export const Input = ({ children, name, type, setUserInfo, isErrorClass }: InputProps) => {
    const [inputIsFocused, setInputIsFocused] = useState(false)

    const inputFocusHandler = () => {
        setInputIsFocused(true)
    }
    const inputBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            return
        }
        setInputIsFocused(false)
    }
    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== "") {
            if (setUserInfo) {
                setUserInfo(event.target.value)
            }
            if (event.target.classList.contains(isErrorClass ?? '')) {
                event.target.classList.remove(isErrorClass ?? '')
            }
            if (event.target.parentElement?.classList.contains(isErrorClass ?? '')) {
                event.target.parentElement.classList.remove(isErrorClass ?? '')
            }
        } else {
            if (isErrorClass) {
                event.target.classList.add(isErrorClass)
                event.target.parentElement?.classList.add(isErrorClass)
            }
        }
    }
    return <div className={`form__input-wrapper ${isErrorClass}`}>
        <label htmlFor={children as string} className={`form__label ${inputIsFocused ? "form__label--moved-up" : ""}`}>{children}</label>
        <input name={name} id={children as string} type={type} className={`form__input ${isErrorClass}`} onChange={inputChangeHandler} onBlur={inputBlurHandler} onFocus={inputFocusHandler}></input>
    </div>
}

export const InputActors = ({ children, name, type, actorsArray, setActorsArray, isErrorClass }: InputActorsProps) => {
    const [inputIsFocused, setInputIsFocused] = useState(false)
    const actorsInputRef = useRef<HTMLInputElement>(null)

    const inputFocusHandler = () => {
        setInputIsFocused(true)
    }
    const inputBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.currentTarget.value !== '') {
            return
        }
        setInputIsFocused(false)
    }
    const addActorHandler = () => {
        const newActor = actorsInputRef.current?.value ?? ''
        setActorsArray([...actorsArray, newActor])
        if (actorsInputRef.current) actorsInputRef.current.value = ''
    }
    return <div className={`form__input-wrapper ${!actorsArray?.length && isErrorClass && 'form__input--error'}`}>
        <label htmlFor={children as string} className={`form__label ${inputIsFocused ? "form__label--moved-up" : ""}`}>{children}</label>
        <input ref={actorsInputRef} name={name} id={children as string} type={type} className={`form__input ${!actorsArray?.length && isErrorClass && 'form__input--error'}`} onBlur={inputBlurHandler} onFocus={inputFocusHandler}></input>
        <button onClick={addActorHandler} type='button' className='button__add-actor'>Add</button>
        <div className='render-actors__input'>
            {actorsArray?.length > 0 ? <span className='actors-label'>Actors :</span> : ""}
            {actorsArray?.map((element, i) => {
                return <p key={i} className='array-of-actors'>{element}{i === actorsArray?.length - 1 ? "." : ", "}</p>
            })}
        </div>
    </div>
}

export const SelectGenre = ({ children, name, selectedGenre, setSelectedGenre, isErrorClass }: SelectGenreProps) => {
    const [genreData, setGenreData] = useState<GenreOption[]>([])
    const [isActive, setIsActive] = useState(false)
    const selectRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        fetchGenres().then((data: GenreOption[]) => setGenreData(data))
    }, [])

    const handleClick = () => {
        setIsActive(current => !current)
    }
    const inputChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== "") {
            if (event.target.classList.contains(isErrorClass ? 'form__input--error' : '')) {
                event.target.classList.remove('form__input--error')
            }
            if (event.target.parentElement?.classList.contains('form__input--error')) {
                event.target.parentElement.classList.remove('form__input--error')
            }
        } else {
            event.target.classList.add('form__input--error')
            event.target.parentElement?.classList.add('form__input--error')
        }
        setSelectedGenre([...selectedGenre, event.target.value])
    }
    const selectBlurHandler = (event: React.FocusEvent<HTMLSelectElement>) => {
        setIsActive(current => !current)
    }
    const renderingGenre = selectedGenre?.map((element, i) => {
        return <span key={i} className='array-of-genres'>{element}{i === selectedGenre?.length - 1 ? "." : ", "}</span>
    })

    return <div className={`choose-genre__wrapper ${!genreData?.length && isErrorClass && 'form__input--error'}`}>
        <label htmlFor={children as string} onClick={handleClick} className={`label__choose-genre ${!selectedGenre?.length && isErrorClass && 'form__input--error'}`}>{selectedGenre?.length > 0 ? renderingGenre : 'Genres'}</label>
        <select ref={selectRef} onBlur={selectBlurHandler} onChange={inputChangeHandler} multiple className={`select__choose-genre ${isActive && "--rendering"}`} name={name} id={children as string} value={selectedGenre}>
            {genreData?.map((element, i) => <option key={i} className="option__choose-genre">{element.value}</option>
            )}
        </select>
    </div>
}

export const InputSearch = ({ children, title, getInputValue }: InputSearchProps) => {
    const [enteredValue, setEnteredValue] = useState('')
    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredValue(event.target.value)
        if (getInputValue) getInputValue(event.target.value)
    }
    const clearInputHandler = () => {
        setEnteredValue('')
        if (getInputValue) getInputValue('')
    }
    return <div className='input__search-movies__wrapper'>
        <label htmlFor={title} className='input__search-movies__label'>{children}</label>
        <input id={title} type="text" className='input__search-movies' value={enteredValue} onChange={inputChangeHandler} />
        <button className='input__search-movies__close-button' onClick={clearInputHandler}></button>
    </div>
}

export const Star = ({ id, isFavorite }: StarProps) => {
    const dispatch = useDispatch()

    const [isRendering, setIsRendering] = useState(!!isFavorite)

    useEffect(() => {
        setIsRendering(!!isFavorite)
    }, [isFavorite])

    const starRenderingHandler = async () => {
        // Read the freshest token at click time — never use a stale closure value
        const raw = localStorage.getItem('token')
        const freshToken = raw ? JSON.parse(raw) as ParsedToken : null

        if (!freshToken?.user?.favorites) {
            alert('You need to be logged in to add this movie to favorites')
            return
        }

        const nowFavorite = !isRendering
        setIsRendering(nowFavorite)

        // Build the new favorites list: remove this id first, then add if favoriting
        let arrayOfFavorites: string[] = freshToken.user.favorites.filter((el) => el !== id)
        if (nowFavorite) {
            arrayOfFavorites = [...arrayOfFavorites, id ?? '']
        }

        try {
            const response = await fetch(`http://localhost:3001/api/users/${freshToken.user._id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "authorization": freshToken.token
                },
                body: JSON.stringify({ "favorites": arrayOfFavorites })
            })

            if (!response.ok) {
                setIsRendering(!nowFavorite)
                return
            }

            const result = await response.json()
            // Use the server-confirmed list so the store stays in sync with the DB
            const confirmedFavorites: string[] = result?.favorites ?? arrayOfFavorites

            dispatch(fetchUserFavorites(confirmedFavorites))
            const updatedToken = { ...freshToken, user: { ...freshToken.user, favorites: confirmedFavorites } }
            localStorage.setItem("token", JSON.stringify(updatedToken))
        } catch {
            setIsRendering(!nowFavorite)
        }
    }

    return (
        <div className='star-wrapper' onClick={starRenderingHandler}>
            {isRendering
                ? <img src={StarFilled} style={{ width: "16px" }} alt="star" title='star' />
                : <img src={StarUnfilled} alt="star" title='star' />}
        </div>
    )
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
                <InputActors actorsArray={[]} setActorsArray={() => {}}></InputActors>
                <SelectGenre selectedGenre={[]} setSelectedGenre={() => {}}>Select genre</SelectGenre>
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
