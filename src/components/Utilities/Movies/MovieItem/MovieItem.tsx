import './MovieItem.scss'
import { Link } from 'react-router-dom'
import { ButtonMovieDetails, H6, Star } from '../../../Pages/AllComponents/AllComponets'

const MovieItem = (props: any) => {
    const { title, imgUrl, favorite, _id } = props
    return (
        <li className='col-12 col-md-6 col-lg-3'>
            <article className='movie-item'>
                <div className='movie-item__poster' style={{ backgroundImage: `url(${imgUrl})` }}>
                    <Star id={_id} isFavorite={favorite} />
                    <div className='movie-item__poster-modal'>
                        <ButtonMovieDetails currentMovie={props}>
                            <Link to={`${title}`}>Click for details</Link>
                        </ButtonMovieDetails>
                    </div>
                </div>
                <div className='movie-item__label'>
                    <H6 className='movie-item__title'>{title}</H6>
                </div>
            </article>
        </li>
    )
}

export default MovieItem