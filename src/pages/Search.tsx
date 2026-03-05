import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { searchMovies, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        const data = await searchMovies(query);
        setResults(data.filter((item: any) => item.poster_path || item.backdrop_path));
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-10">
      <Navbar />
      <div className="px-4 md:px-16">
        <div className="relative max-w-3xl mx-auto mb-12">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          <input
            type="text"
            placeholder="Search for movies, TV shows..."
            className="w-full bg-gray-800/80 text-white text-xl px-16 py-5 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 shadow-lg backdrop-blur-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map(item => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/details/${item.media_type || 'movie'}/${item.id}`)}
                className="cursor-pointer group relative overflow-hidden rounded-md"
              >
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${item.poster_path || item.backdrop_path}`}
                  alt={item.title || item.name}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white font-bold text-sm md:text-base">{item.title || item.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center text-gray-400 mt-20 text-xl">
            No results found for "{query}"
          </div>
        ) : null}
      </div>
    </div>
  );
}
