import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface movieState {
    value: any
}

const initialState: movieState = {
    value: [],
}

export const moviesSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        fetchMovies: (state, action) => {
            state.value = action.payload
        },
        fetchPostMovie: (state, action) => {
            let current = JSON.parse(JSON.stringify(state.value));
            current.push(action.payload)
            state.value = current
        },
        fetchUserFavorites: (state, action) => {
            let current = JSON.parse(JSON.stringify(state.value));
            current = current?.forEach((movie: any) => {
                movie.favorite = false
                action.payload.forEach((movieID: any) => {
                    if (movie._id === movieID) {
                        movie.favorite = true
                    }
                });
                state.value = current
            })
        }
    },
})

// Action creators are generated for each case reducer function
export const { fetchMovies, fetchUserFavorites, fetchPostMovie } = moviesSlice.actions

export default moviesSlice.reducer