import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getMovieDetails } from '../lib/tmdb';

export default function Player() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (id && type) {
        const data = await getMovieDetails(id, type as 'movie' | 'tv');
        setDetails(data);
        saveToRecentlyWatched(data);
      }
    };
    fetchDetails();
  }, [id, type]);

  const saveToRecentlyWatched = async (movieData: any) => {
    try {
      const activeProfileStr = localStorage.getItem('activeProfile');
      if (!activeProfileStr) return;
      
      const activeProfile = JSON.parse(activeProfileStr);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const userProfiles = user.user_metadata?.profiles || [];
      const profileIndex = userProfiles.findIndex((p: any) => p.id === activeProfile.id);
      
      if (profileIndex === -1) return;

      const recentlyWatched = userProfiles[profileIndex].recently_watched || [];
      
      // Remove if already exists to put it at the top
      const filteredWatched = recentlyWatched.filter((item: any) => item.tmdb_id !== movieData.id);
      
      const newItem = {
        tmdb_id: movieData.id,
        type: type,
        title: movieData.title || movieData.name,
        backdrop_path: movieData.backdrop_path,
        progress: Math.random() * 0.8 + 0.1, // Mock progress for demo
        timestamp: Date.now()
      };

      const newRecentlyWatched = [newItem, ...filteredWatched].slice(0, 20); // Keep last 20
      
      userProfiles[profileIndex].recently_watched = newRecentlyWatched;
      
      await supabase.auth.updateUser({
        data: { profiles: userProfiles }
      });

      // Update local storage
      localStorage.setItem('activeProfile', JSON.stringify(userProfiles[profileIndex]));
    } catch (error) {
      console.error('Error saving to recently watched:', error);
    }
  };

  // Vidking embed URL format
  const embedUrl = type === 'movie' 
    ? `https://vidking.net/embed/movie/${id}`
    : `https://vidking.net/embed/tv/${id}/1/1`;

  return (
    <div className="w-screen h-screen bg-black relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-50 text-white hover:text-gray-300 transition flex items-center gap-2 bg-black/50 p-3 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      
      <iframe
        src={embedUrl}
        className="w-full h-full border-none"
        allowFullScreen
        allow="autoplay; fullscreen"
        sandbox="allow-scripts allow-same-origin allow-presentation"
      ></iframe>
    </div>
  );
}
