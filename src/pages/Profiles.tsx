import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import Loader from '../components/Loader';

export default function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    const userProfiles = user.user_metadata?.profiles || [];
    setProfiles(userProfiles);
    setLoading(false);
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newProfileName}`,
      recently_watched: []
    };

    const updatedProfiles = [...profiles, newProfile];
    await supabase.auth.updateUser({
      data: { profiles: updatedProfiles }
    });

    setProfiles(updatedProfiles);
    setIsCreating(false);
    setNewProfileName('');
  };

  const selectProfile = (profile: any) => {
    localStorage.setItem('activeProfile', JSON.stringify(profile));
    navigate('/');
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl md:text-5xl font-medium mb-10">Who's watching?</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {profiles.map(profile => (
          <div key={profile.id} onClick={() => selectProfile(profile)} className="flex flex-col items-center group cursor-pointer">
            <div className="w-32 h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover bg-gray-800" />
            </div>
            <span className="mt-4 text-gray-400 group-hover:text-white transition-colors text-xl">{profile.name}</span>
          </div>
        ))}
        {profiles.length < 5 && (
          <div onClick={() => setIsCreating(true)} className="flex flex-col items-center group cursor-pointer">
            <div className="w-32 h-32 rounded-md border-2 border-gray-600 flex items-center justify-center group-hover:border-white group-hover:bg-gray-800 transition-all">
              <PlusCircle className="w-16 h-16 text-gray-600 group-hover:text-white" />
            </div>
            <span className="mt-4 text-gray-400 group-hover:text-white transition-colors text-xl">Add Profile</span>
          </div>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Add Profile</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded mb-6 focus:outline-none focus:ring-2 focus:ring-white"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-4">
              <button onClick={handleCreateProfile} className="flex-1 bg-white text-black font-bold py-3 rounded hover:bg-gray-200 transition">Continue</button>
              <button onClick={() => setIsCreating(false)} className="flex-1 border border-gray-500 text-gray-300 font-bold py-3 rounded hover:border-white hover:text-white transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
