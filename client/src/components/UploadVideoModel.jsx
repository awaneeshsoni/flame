import { useState } from "react";
const API = import.meta.env.VITE_API_URL;

function UploadVideoModal({ wsid, onClose, setVideos }) {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video.");
      return;
    }

    setUploading(true);
    setProgress(10);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("workspaceId", wsid);

    try {
      const res = await fetch(`${API}/api/video/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setVideos((prev) => [...prev, data.video]); 
      setProgress(100);
      setTimeout(onClose, 1000); 
    } catch (err) {
      setError("Upload failed. Try again.");
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center " style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-96 text-white">
        <h2 className="text-xl font-bold mb-4">Upload Video</h2>

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hover:cursor-pointer mb-4 w-full bg-[#0f172a] text-white border border-gray-600 rounded p-2"
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

        {uploading && (
          <div className="relative w-full bg-gray-600 rounded h-3 overflow-hidden">
            <div
              className="bg-white h-3 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-300 disabled:bg-gray-400"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadVideoModal;
