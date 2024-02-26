import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface movieDetailState {
    value: any;
}

const initialState: movieDetailState = {
    value: {},
}

export const movieDetailsSlice = createSlice({
    name: 'movieDetails',
    initialState,
    reducers: {
        fecthCurrentMovieID: (state, action) => {
            state.value = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { fecthCurrentMovieID } = movieDetailsSlice.actions

export default movieDetailsSlice.reducer