export const fetchMoviesApi = async () => {
  const api = "http://localhost:3001/movies";
  const result = await fetch(api);
  const movies = await result.json();
  return movies;
};

export const fetchGenres = async () => {
  const api = "http://localhost:3001/genres";
  const result = await fetch(api);
  const genres = await result.json();
  genres.sort();
  let filteredArrayOfGenres: string[] = [];
  genres.forEach((element: string) => {
    if (!filteredArrayOfGenres.includes(element)) {
      filteredArrayOfGenres.push(element);
    }
  });
  const arrayOfGenres: any = [];
  filteredArrayOfGenres.map((element: any) => {
    return arrayOfGenres.push({ value: element, label: element });
  });
  return arrayOfGenres;
};
