export const fecthMovies = async () => {
    const api = 'https://movieapp-wnsi.onrender.com/api/movies/'
    const result = await fetch(api)
    const movies = await result.json()
    return movies
}


export const fecthGenres = async () => {
    const api = 'http://localhost:3000/genres/'
    const result = await fetch(api)
    const genres = await result.json()
    genres.sort()
    let filteredArrayOfGenres: string[] = []
    genres.forEach((element: string) => {
        if (!filteredArrayOfGenres.includes(element)) {
            filteredArrayOfGenres.push(element);
        }
    });
    const arrayOfGenres: any = [];
    filteredArrayOfGenres.map((element: any) => {
        return arrayOfGenres.push({ value: element, label: element })
    })
    return arrayOfGenres
}