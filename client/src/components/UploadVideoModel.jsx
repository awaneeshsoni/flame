import { useState, useRef } from "react";
import { FaMinus, FaExpand, FaTimes, FaFilm, FaCloudUploadAlt } from "react-icons/fa";
import PlanConfig from "../config/planConfig";

const API = import.meta.env.VITE_API_URL;

function UploadVideoModal({ workspace, wsid, onClose, setVideos }) {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const controllerRef = useRef(null); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }

    const plan = workspace.creator?.plan || "free";
    const maxStorage = PlanConfig[plan]?.storagePerWorkspace || 5 * 1024 ** 3;
    const isStorageFull = workspace.storageUsed + videoFile.size > maxStorage;

    if (isStorageFull) {
      setError(`Storage limit exceeded for your "${plan}" plan.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("workspaceId", wsid);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? prev : prev + 5));
    }, 300);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch(`${API}/api/video/upload`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        signal: controller.signal,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Upload failed");
      }

      const data = await res.json();
      setVideos((prev) => [...prev, data.video]);
      setProgress(100);
      setTimeout(onClose, 1000);
    } catch (err) {
      clearInterval(progressInterval);
      if (err.name === "AbortError") {
        setError("Upload cancelled.");
      } else {
        setError(err.message || "Upload failed.");
      }
      setUploading(false);
      setProgress(0);
    }
  };

  const cancelUpload = () => {
    if (uploading && controllerRef.current) {
      controllerRef.current.abort();
    }
    onClose();
  };

  const containerClasses = isMinimized
    ? "fixed bottom-4 right-4 z-50"
    : "fixed inset-0 flex items-center justify-center z-50 bg-black/60";

  const boxClasses = "bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 w-full max-w-md";

  return (
    <div className={containerClasses}>
      <div className={boxClasses}>
        {isMinimized ? (
          <div className="p-3 flex items-center gap-4">
            <FaFilm className="text-orange-500 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate">{videoFile?.name || "Uploading..."}</p>
              <div className="relative w-full bg-zinc-700 rounded-full h-1.5 mt-1">
                <div
                  className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button onClick={() => setIsMinimized(false)} className="p-1 text-zinc-400 hover:text-white">
              <FaExpand />
            </button>
            <button onClick={cancelUpload} className="p-1 text-zinc-400 hover:text-white">
              <FaTimes />
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b border-zinc-700">
              <h2 className="text-lg font-bold">Upload Video</h2>
              <div className="flex items-center gap-2">
                <button onClick={() => (videoFile ? setIsMinimized(true) : onClose())} className="p-1 text-zinc-400 hover:text-white">
                  <FaMinus />
                </button>
                <button onClick={cancelUpload} className="p-1 text-zinc-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              <label
                htmlFor="video-upload"
                className={`flex flex-col items-center justify-center w-full h-32 px-4 transition bg-zinc-800 border-2 border-zinc-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-orange-500 focus:outline-none mb-4 ${uploading ? "pointer-events-none opacity-50" : ""
                  }`}
              >
                <FaCloudUploadAlt className="w-8 h-8 text-zinc-500" />
                <span className="flex items-center space-x-2">
                  <span className="font-medium text-zinc-400">
                    Click to browse or <span className="text-orange-500">drag & drop</span>
                  </span>
                </span>
                <input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
              </label>

              {videoFile && <p className="text-sm text-zinc-300 mb-2 truncate">File: {videoFile.name}</p>}
              {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

              {uploading && (
                <div className="mt-2">
                  <p className="text-sm text-right mb-1">{progress}%</p>
                  <div className="relative w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={cancelUpload}
                  className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !videoFile}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed font-semibold"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UploadVideoModal;
