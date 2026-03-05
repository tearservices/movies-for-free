import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPersonDetails, TMDB_IMAGE_BASE_URL } from '../lib/tmdb';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';

export default function Person() {
  const { id } = useParams();
  const [person, setPerson] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerson = async () => {
      if (id) {
        const data = await getPersonDetails(id);
        setPerson(data);
      }
    };
    fetchPerson();
  }, [id]);

  if (!person) return <Loader />;

  const credits = person.combined_credits?.cast?.filter((c: any) => c.poster_path || c.backdrop_path)
    .sort((a: any, b: any) => b.popularity - a.popularity) || [];

  return (
    <div className="min-h-screen bg-[#141414] pb-10">
      <Navbar />
      <div className="pt-24 px-4 md:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            {person.profile_path ? (
              <img 
                src={`${TMDB_IMAGE_BASE_URL}${person.profile_path}`} 
                alt={person.name}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center md:text-left">{person.name}</h1>
            <h2 className="text-xl text-gray-400 mb-4 text-center md:text-left">{person.known_for_department}</h2>
            {person.biography && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-2">Biography</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                  {person.biography}
                </p>
              </div>
            )}
          </div>
        </div>

        {credits.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-white">Known For</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {credits.map((item: any) => (
                <div 
                  key={`${item.id}-${item.media_type}`} 
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
          </div>
        )}
      </div>
    </div>
  );
}
