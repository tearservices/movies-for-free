import { useEffect, useState } from 'react';
import { fetchMovies, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [movie, setMovie] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getTrending = async () => {
      const movies = await fetchMovies('/trending/all/week');
      setMovie(movies[Math.floor(Math.random() * movies.length)]);
    };
    getTrending();
  }, []);

  if (!movie) return <div className="h-[80vh] bg-[#141414]"></div>;

  return (
    <div className="relative h-[80vh] w-full text-white">
      <div className="absolute w-full h-full">
        <img
          src={`${TMDB_IMAGE_BASE_URL}${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
      </div>
      <div className="absolute top-[30%] md:top-[40%] p-4 md:p-16 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title || movie.name}</h1>
        <p className="text-sm md:text-lg text-gray-300 mb-8 line-clamp-3 md:line-clamp-4">{movie.overview}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/watch/${movie.media_type || 'movie'}/${movie.id}`)}
            className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded hover:bg-white/80 transition font-bold text-lg"
          >
            <Play className="w-6 h-6 fill-black" /> Play
          </button>
          <button 
            onClick={() => navigate(`/details/${movie.media_type || 'movie'}/${movie.id}`)}
            className="flex items-center gap-2 bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded hover:bg-gray-500/50 transition font-bold text-lg"
          >
            <Info className="w-6 h-6" /> More Info
          </button>
        </div>
      </div>
    </div>
  );
}
