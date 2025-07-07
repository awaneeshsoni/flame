// src/components/UploadTracker.jsx
import { useEffect, useState } from 'react';
import { FaFilm, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API = import.meta.env.VITE_API_URL;

function UploadTracker({ upload, onComplete, onRemove }) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const performUpload = async () => {
      const formData = new FormData();
      formData.append('video', upload.file);
      formData.append('workspaceId', upload.wsid);

      // This is a simplified progress simulation. For real-world use,
      // you would use a library like Axios that supports upload progress events.
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 250);

      try {
        const res = await fetch(`${API}/api/video/upload`, {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        clearInterval(progressInterval);
        if (!res.ok) throw new Error('Upload failed');
        
        const data = await res.json();
        setProgress(100);
        setIsDone(true);
        onComplete(data.video); // Notify parent of new video
        setTimeout(() => onRemove(upload.id), 3000); // Auto-remove after 3s
      } catch (e) {
        clearInterval(progressInterval);
        setError(e.message);
      }
    };

    performUpload();
  }, [upload, onComplete, onRemove]);

  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 w-full max-w-xs p-3 flex items-center gap-3">
      {isDone ? (
        <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
      ) : error ? (
        <FaTimesCircle className="text-red-500 text-xl flex-shrink-0" />
      ) : (
        <FaFilm className="text-orange-500 flex-shrink-0" />
      )}
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium truncate">{upload.file.name}</p>
        {error ? (
          <p className="text-xs text-red-400">{error}</p>
        ) : (
          <div className="relative w-full bg-zinc-700 rounded-full h-1.5 mt-1">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <button onClick={() => onRemove(upload.id)} className="p-1 text-zinc-400 hover:text-white">
        <FaTimesCircle />
      </button>
    </div>
  );
}

export default UploadTracker;