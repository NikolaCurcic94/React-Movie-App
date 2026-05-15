import React, { useEffect } from "react";
import "./Main.scss";
import { fetchMoviesApi } from "../../api/api";
import AllMovies from "../Pages/AllMovies/AllMovies";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesRedux } from "../../redux/movies";
import { Route, Routes } from "react-router-dom";
import AllComponents from "../Pages/AllComponents/AllComponets";
import Favorites from "../Pages/Favorites/Favorites";
import AddNewMovie from "../Pages/AddNewMovie/AddNewMovie";
import MovieDetail from "../Pages/MovieDetail/MovieDetail";
import LostYourWay from "../Pages/LostYourWay/LostYourWay";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import { Movie } from "../../typesOfData/typesOFdata";
import { RootState } from "../../redux/store";

interface ParsedToken {
  token: string;
  user: {
    _id: string;
    email: string;
    favorites: string[];
  };
}
const Main = () => {
  const movies: Movie[] = useSelector((state: RootState) => state.movies.value);
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const getData = async () => {
      const data = await fetchMoviesApi().then((data) => data);
      if (cancelled) return;

      const rawToken: string | null = window.localStorage.getItem("token");
      if (!rawToken) {
        const withDefaults = (data as Movie[]).map((m) => ({ ...m, favorite: false }));
        dispatch(fetchMoviesRedux(withDefaults));
        return;
      }

      const token = JSON.parse(rawToken) as ParsedToken;
      if (!token?.user?.favorites) {
        // Stored token is malformed (e.g. an error response was saved); treat as logged out
        localStorage.removeItem("token");
        const withDefaults = (data as Movie[]).map((m) => ({ ...m, favorite: false }));
        dispatch(fetchMoviesRedux(withDefaults));
        return;
      }

      const arrayOFfavorites: string[] = token.user.favorites;
      const parsedMovieList: Movie[] = JSON.parse(JSON.stringify(data));

      parsedMovieList?.forEach((movie) => {
        movie.favorite = arrayOFfavorites.includes(movie._id ?? '');
      });
      dispatch(fetchMoviesRedux(parsedMovieList));
    };

    getData();
    return () => { cancelled = true; };
  }, [localStorage.getItem("token")]);
  return (
    <>
      <div className="container main-wrapper">
        <main className="main">
          <Routes>
            <Route path={"/all-components"} element={<AllComponents />} />
            <Route path={"/"} element={<AllMovies />} />
            <Route path="/error" element={<LostYourWay />} />
            <Route path={"/:id"} element={<MovieDetail />} />
            <Route path={"/favorites"} element={<Favorites />} />
            <Route path={"/addmovie"} element={<AddNewMovie />} />
            <Route path={"/login"} element={<Login />} />
            <Route path={"/register"} element={<Register />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

export default Main;
