import React from 'react'

const usePostMovie = async (newMovie: any) => {
    const userToken: any = localStorage.getItem('token')
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
    console.log(result);
    return result
}

export default usePostMovie