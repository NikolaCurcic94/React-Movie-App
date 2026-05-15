import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface movieState {
  value: any;
}

const initialState: movieState = {
  value: [],
};

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    fetchMoviesRedux: (state, action) => {
      state.value = action.payload;
    },
    fetchPostMovie: (state, action) => {
      let current = JSON.parse(JSON.stringify(state.value));
      current.push({ ...action.payload, favorite: false });
      state.value = current;
    },
    fetchUserFavorites: (state, action) => {
      const favoriteIds: string[] = action.payload;
      state.value.forEach((movie: any) => {
        movie.favorite = favoriteIds.includes(movie._id);
      });
    },
    clearAllFavorites: (state) => {
      state.value.forEach((movie: any) => {
        movie.favorite = false;
      });
    },
  },
});

export const { fetchMoviesRedux, fetchUserFavorites, fetchPostMovie, clearAllFavorites } =
  moviesSlice.actions;

export default moviesSlice.reducer;
