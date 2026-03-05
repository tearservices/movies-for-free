import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import { Play } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [recentlyWatched, setRecentlyWatched] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      const activeProfileStr = localStorage.getItem('activeProfile');
      if (!activeProfileStr) {
        navigate('/profiles');
        return;
      }
      const activeProfile = JSON.parse(activeProfileStr);
      setRecentlyWatched(activeProfile.recently_watched || []);
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#141414] pb-10">
      <Navbar />
      <Hero />
      <div className="-mt-32 relative z-20">
        {recentlyWatched.length > 0 && (
          <div className="pl-4 md:pl-16 my-8 relative group">
            <h2 className="text-white text-xl md:text-2xl font-bold mb-4">Continue Watching</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4">
              {recentlyWatched.map((item, idx) => (
                <div key={idx} onClick={() => navigate(`/watch/${item.type}/${item.tmdb_id}`)} className="relative cursor-pointer group/item flex-shrink-0">
                  <img
                    src={`${TMDB_IMAGE_BASE_URL}${item.backdrop_path}`}
                    alt={item.title}
                    className="w-[200px] md:w-[280px] h-[112px] md:h-[157px] rounded-md object-cover transition-transform duration-300 group-hover/item:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-b-md">
                    <div className="h-full bg-red-600 rounded-bl-md" style={{ width: `${item.progress * 100}%` }}></div>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <MovieRow title="Trending Now" endpoint="/trending/all/week" isLargeRow />
        <MovieRow title="Top Rated" endpoint="/movie/top_rated" />
        <MovieRow title="Action Movies" endpoint="/discover/movie?with_genres=28" />
        <MovieRow title="Comedy Movies" endpoint="/discover/movie?with_genres=35" />
        <MovieRow title="Horror Movies" endpoint="/discover/movie?with_genres=27" />
        <MovieRow title="Romance Movies" endpoint="/discover/movie?with_genres=10749" />
        <MovieRow title="Documentaries" endpoint="/discover/movie?with_genres=99" />
      </div>
    </div>
  );
}
