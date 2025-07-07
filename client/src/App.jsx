import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Home from './pages/Home';
import VideoPageEditor from './pages/VideoPageEditor';
import VideoPageClient from './pages/VideoPageClient';
import Navbar from './components/Navbar';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

const API = import.meta.env.VITE_API_URL;

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setIsAuth(false);
      try {
        const res = await fetch(`${API}/api/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("name");
        }
        setIsAuth(res.ok);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setIsAuth(false);
      }
    };
    verify();
  }, [location.pathname]);

  if (isAuth === null) return null; // loading
  return isAuth ? children : <Navigate to="/" />;
}

function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${API}/api/auth/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setIsAuthenticated(true);
          if (data.name) localStorage.setItem("name", data.name);
          if (data.plan) localStorage.setItem("plan", data.plan); // fixed typo: was `data.name`
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("plan");
          localStorage.removeItem("name");
          setIsAuthenticated(false);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("plan");
        localStorage.removeItem("name");
        setIsAuthenticated(false);
      }
    };
    verify();
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path='/' element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        } />
        <Route path='/login' element={
          <PublicRoute>
            <Login setIsAuthenticated={setIsAuthenticated} />
          </PublicRoute>
        } />
        <Route path='/signup' element={
          <PublicRoute>
            <Signup setIsAuthenticated={setIsAuthenticated} />
          </PublicRoute>
        } />

        <Route path='/profile/:userId' element={
          <ProtectedRoute>
            <Profile  />
          </ProtectedRoute>
        } />
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/workspace/:wsid' element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        } />
        <Route path='/workspace/:wsid/video/:vid' element={
          <ProtectedRoute>
            <VideoPageEditor />
          </ProtectedRoute>
        } />
        <Route path='/video/:id' element={<VideoPageClient />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Router>
  );
}
