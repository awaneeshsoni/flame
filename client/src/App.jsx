import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import VideoPageEditor from './pages/VideoPageEditor';
import VideoPageClient from './pages/VideoPageClient';
import Pricing from './pages/Pricing';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import { WorkspaceProvider, useWorkspaceContext } from './context/WorkspaceContext'; // ✅ added useWorkspaceContext

import UploadVideoModal from './components/UploadVideoModel';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const queryClient = new QueryClient();

function AppContent() {
  const [activeUploads, setActiveUploads] = useState([]);

  const { setWorkspaces } = useWorkspaceContext(); // ✅ use setWorkspaces here

  useEffect(() => {
    const handler = (e) => {
      const { wsid, workspace } = e.detail;
      const uploadId = uuidv4();
      setActiveUploads((prev) => [
        ...prev,
        { id: uploadId, wsid, workspace },
      ]);
    };

    window.addEventListener('open-upload-modal', handler);
    return () => window.removeEventListener('open-upload-modal', handler);
  }, []);

  const handleCloseUpload = (id) => {
    setActiveUploads((prev) => prev.filter((upload) => upload.id !== id));
  };
const handleUploadComplete = (video, workspace) => {
  window.dispatchEvent(
    new CustomEvent("video-uploaded", {
      detail: { workspaceId: workspace._id, video },
    })
  );
};

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:wsid"
          element={
            <ProtectedRoute>
              <Workspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspace/:wsid/video/:vid"
          element={
            <ProtectedRoute>
              <VideoPageEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/video/:id" element={<VideoPageClient />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>

      {activeUploads.map(({ id, wsid, workspace }, index) => (
        <UploadVideoModal
          key={id}
          wsid={wsid}
          workspace={workspace}
          index={index}
          onClose={() => handleCloseUpload(id)}
          handleUploadComplete={handleUploadComplete}
        />
      ))}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WorkspaceProvider>
          <Router>
            <AppContent />
          </Router>
        </WorkspaceProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
