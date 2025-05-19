import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Home from './pages/Home';
import VideoPageEditor from './pages/VideoPageEditor';
import VideoPageClient from './pages/VideoPageClient';

const App = () => (
  <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/workspace/:wsid' element={<Workspace />} />
      <Route path='/workspace/:wsid/video/:vid' element={<VideoPageEditor />} />
      <Route path='/video/:id' element={<VideoPageClient />} />
    </Routes>
  </Router>
);

export default App;
