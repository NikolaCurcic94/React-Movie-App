import React from 'react'
import './LostYourWay.scss'
import LostWayImage from '../../../assets/images/lost-way-image.svg'
import { Button, ButtonNavigate, H1, P } from '../AllComponents/AllComponets'
import { useNavigate } from 'react-router-dom'

const LostYourWay = () => {
    const navigate = useNavigate()

    const goHomeHandler = () => {
        navigate('/')
    }
    return (
        <div className='lost-way'>
            <img src={LostWayImage} alt="lost way image" title='lost way' />
            <H1>Lost your way?</H1>
            <P>Oops! This is awkward. You are looking for something that doesn't actually exist.</P>
            <ButtonNavigate handleClick={goHomeHandler}>Go Home</ButtonNavigate>
        </div>
    )
}

export default LostYourWay