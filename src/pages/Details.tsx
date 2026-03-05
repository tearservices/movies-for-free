import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import Navbar from '../components/Navbar';
import { Play } from 'lucide-react';

export default function Details() {
  const { type, id } = useParams();
  const [details, setDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      if (id && type) {
        const data = await getMovieDetails(id, type as 'movie' | 'tv');
        setDetails(data);
      }
    };
    fetchDetails();
  }, [id, type]);

  if (!details) return <div className="min-h-screen bg-[#141414]"></div>;

  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <div className="relative h-[80vh] w-full">
        <div className="absolute w-full h-full">
          <img
            src={`${TMDB_IMAGE_BASE_URL}${details.backdrop_path || details.poster_path}`}
            alt={details.title || details.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
        </div>
        
        <div className="absolute top-[20%] md:top-[30%] p-4 md:p-16 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">{details.title || details.name}</h1>
          
          <div className="flex items-center gap-4 text-gray-300 mb-6 text-sm md:text-base font-medium">
            <span className="text-green-500 font-bold">{Math.round(details.vote_average * 10)}% Match</span>
            <span>{details.release_date?.substring(0, 4) || details.first_air_date?.substring(0, 4)}</span>
            {details.runtime && <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
            {details.number_of_seasons && <span>{details.number_of_seasons} Seasons</span>}
            <span className="border border-gray-600 px-1 rounded text-xs">HD</span>
          </div>

          <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">{details.overview}</p>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate(`/watch/${type}/${id}`)}
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded hover:bg-white/80 transition font-bold text-lg"
            >
              <Play className="w-6 h-6 fill-black" /> Play
            </button>
          </div>

          <div className="mt-8 text-sm text-gray-400">
            <p className="mb-2"><span className="text-gray-500">Genres:</span> {details.genres?.map((g: any) => g.name).join(', ')}</p>
          </div>
        </div>
      </div>

      {details.credits?.cast && details.credits.cast.length > 0 && (
        <div className="px-4 md:px-16 py-12 relative z-10 bg-[#141414]">
          <h2 className="text-2xl font-bold mb-6 text-white">Cast</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {details.credits.cast.slice(0, 15).map((actor: any) => (
              <div 
                key={actor.id} 
                onClick={() => navigate(`/person/${actor.id}`)}
                className="flex-shrink-0 w-32 cursor-pointer group"
              >
                <div className="w-32 h-48 bg-gray-800 rounded-md overflow-hidden mb-2">
                  {actor.profile_path ? (
                    <img 
                      src={`${TMDB_IMAGE_BASE_URL}${actor.profile_path}`} 
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center p-2">No Image</div>
                  )}
                </div>
                <p className="text-sm font-bold text-white truncate">{actor.name}</p>
                <p className="text-xs text-gray-400 truncate">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
