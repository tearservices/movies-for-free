import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/profiles');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center relative" style={{ backgroundImage: 'url(https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-eca7922cb522/e1b3433a-2321-4dce-871d-55761eb86b77/US-en-20240311-popsignuptwoweeks-perspective_alpha_website_large.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 bg-black/80 p-16 rounded-md w-full max-w-md">
        <h1 className="text-white text-3xl font-bold mb-8">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        {error && <p className="bg-red-500/20 text-red-500 p-3 rounded mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email or phone number"
            className="bg-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button disabled={loading} type="submit" className="bg-red-600 text-white font-bold py-3 rounded mt-4 hover:bg-red-700 transition disabled:opacity-50">
            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        <p className="text-gray-400 mt-8">
          {isSignUp ? 'Already have an account?' : 'New to Vidking?'}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-white ml-2 hover:underline">
            {isSignUp ? 'Sign In now.' : 'Sign up now.'}
          </button>
        </p>
      </div>
    </div>
  );
}
