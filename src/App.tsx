import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Profiles from './pages/Profiles';
import Home from './pages/Home';
import Search from './pages/Search';
import Details from './pages/Details';
import Player from './pages/Player';
import Person from './pages/Person';
import Loader from './components/Loader';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/profiles" />} />
        <Route path="/profiles" element={session ? <Profiles /> : <Navigate to="/login" />} />
        <Route path="/" element={session ? <Home /> : <Navigate to="/login" />} />
        <Route path="/search" element={session ? <Search /> : <Navigate to="/login" />} />
        <Route path="/details/:type/:id" element={session ? <Details /> : <Navigate to="/login" />} />
        <Route path="/watch/:type/:id" element={session ? <Player /> : <Navigate to="/login" />} />
        <Route path="/person/:id" element={session ? <Person /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
