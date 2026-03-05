import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('activeProfile');
    navigate('/login');
  };

  return (
    <nav className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="px-4 md:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-red-600 text-3xl font-bold tracking-tighter">VIDKING</Link>
          <div className="hidden md:flex gap-4 text-sm text-gray-300">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/" className="hover:text-white transition">TV Shows</Link>
            <Link to="/" className="hover:text-white transition">Movies</Link>
            <Link to="/" className="hover:text-white transition">New & Popular</Link>
            <Link to="/" className="hover:text-white transition">My List</Link>
          </div>
        </div>
        <div className="flex items-center gap-6 text-white">
          <Link to="/search"><Search className="w-6 h-6 cursor-pointer hover:text-gray-300 transition" /></Link>
          <div className="relative group cursor-pointer">
            <User className="w-6 h-6 hover:text-gray-300 transition" />
            <div className="absolute right-0 top-full mt-2 w-48 bg-black/90 border border-gray-800 rounded-md py-2 hidden group-hover:block">
              <button onClick={() => navigate('/profiles')} className="w-full text-left px-4 py-2 text-sm hover:underline">Manage Profiles</button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:underline flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
