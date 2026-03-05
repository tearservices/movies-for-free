import { useEffect, useState, useRef } from 'react';
import { fetchMovies, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MovieRowProps {
  title: string;
  endpoint: string;
  isLargeRow?: boolean;
}

export default function MovieRow({ title, endpoint, isLargeRow = false }: MovieRowProps) {
  const [movies, setMovies] = useState<any[]>([]);
  const rowRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getMovies = async () => {
      const data = await fetchMovies(endpoint);
      setMovies(data);
    };
    getMovies();
  }, [endpoint]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="pl-4 md:pl-16 my-8 relative group">
      <h2 className="text-white text-xl md:text-2xl font-bold mb-4">{title}</h2>
      <div className="relative flex items-center">
        <button 
          onClick={() => handleScroll('left')}
          className="absolute left-0 z-40 bg-black/50 hover:bg-black/80 text-white h-full w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <div 
          ref={rowRef}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth py-4"
        >
          {movies.map(movie => (
            movie.poster_path && movie.backdrop_path && (
              <img
                key={movie.id}
                onClick={() => navigate(`/details/${movie.media_type || 'movie'}/${movie.id}`)}
                src={`${TMDB_IMAGE_BASE_URL}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                alt={movie.title || movie.name}
                className={`cursor-pointer rounded-md object-cover transition-transform duration-300 hover:scale-105 hover:z-10 ${
                  isLargeRow ? 'w-[150px] md:w-[200px] h-[225px] md:h-[300px]' : 'w-[200px] md:w-[280px] h-[112px] md:h-[157px]'
                } flex-shrink-0`}
              />
            )
          ))}
        </div>
        <button 
          onClick={() => handleScroll('right')}
          className="absolute right-0 z-40 bg-black/50 hover:bg-black/80 text-white h-full w-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
