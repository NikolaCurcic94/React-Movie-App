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
const Main = () => {
  const movies: Movie[] = useSelector((state: RootState) => state.movies.value);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      //fetch all movies (data je lista svih filmova)
      const data = await fetchMoviesApi().then((data) => data);

      let token: any = window.localStorage.getItem("token");
      // proveri da li ima nesto u storidzu, ako nema token, gurni u redux filmove koji su fetchovani
      if (!token) {
        return dispatch(fetchMoviesRedux(data));
      }
      token = JSON.parse(token);

      // arrayOFfavorites je array koji sadrzi ID-ijeve filmova koji su dodati u favorites
      let arrayOFfavorites = token.user.favorites;
      let parsedMovieList = JSON.parse(JSON.stringify(data));

      // u parsiranom nizu filmova prolazimo kroz properti arrayOFfavorites
      // i trazimo poklapanje sa ID filma elementima niza arrayOFfavorites koji su zapravo i sami ID-ijevi
      parsedMovieList?.forEach((movie: any) => {
        return arrayOFfavorites?.forEach((favorite: any) => {
          if (movie._id === favorite) {
            movie.favorite = true;
          }
        });
      });
      dispatch(fetchMoviesRedux(parsedMovieList));
    };
    getData();
  }, [localStorage.getItem("token")]);
  return (
    <>
      <div className="container">
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
