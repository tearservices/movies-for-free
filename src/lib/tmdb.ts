const TMDB_API_KEY = 'ebbc810d0c9a9a4a13a264f96897036e';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const fetchMovies = async (endpoint: string) => {
  const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query: string) => {
  const response = await fetch(`${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${query}`);
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (id: string, type: 'movie' | 'tv' = 'movie') => {
  const response = await fetch(`${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`);
  return await response.json();
};

export const getPersonDetails = async (id: string) => {
  const response = await fetch(`${TMDB_BASE_URL}/person/${id}?api_key=${TMDB_API_KEY}&append_to_response=combined_credits`);
  return await response.json();
};

export { TMDB_IMAGE_BASE_URL };
