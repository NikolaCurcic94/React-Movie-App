export interface Movie {
    title: string;
    year: number;
    director: string;
    actors: string[];
    description: string;
    imgUrl: string;
    favorite: boolean;
    genre: string[];
}

export interface Genre {
    genre: string
}