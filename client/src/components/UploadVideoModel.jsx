import { useState } from "react";
import {
  FaMinus,
  FaExpand,
  FaTimes,
  FaFilm,
  FaCloudUploadAlt,
} from "react-icons/fa";
import PlanConfig from "../config/planConfig";
import { useUpload } from "../context/UploadContext";

function UploadVideoModal({ workspace, wsid, onClose, setVideos, handleUploadComplete }) {
  const [videoFile, setVideoFile] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { uploads, startUpload, cancelUpload } = useUpload();
  const currentUpload = uploads.find((u) => u.file.name === videoFile?.name);

  const handleUpload = () => {
    const plan = workspace.creator?.plan || "free";
    const maxStorage =
      PlanConfig[plan]?.storagePerWorkspace || 5 * 1024 ** 3;

    if (workspace.storageUsed + videoFile.size > maxStorage) {
      setLocalError(`Storage limit exceeded for your "${plan}" plan.`);
      return;
    }

    setLocalError(null);

    startUpload({
      file: videoFile,
      wsid,
      onComplete: (video) => {
        handleUploadComplete(video, workspace);
        setTimeout(() => onClose(), 1000);
      },
      onError: (msg) => setLocalError(msg),
    });
  };

  const cancelAndClose = () => {
    if (currentUpload) {
      cancelUpload(currentUpload.id);
    }
    onClose();
  };

  const containerClasses = isMinimized
    ? "fixed bottom-4 right-4 z-50"
    : "fixed inset-0 flex items-center justify-center z-50 bg-black/60";

  return (
    <div className={containerClasses}>
      <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 w-full max-w-md">
        {isMinimized ? (
          <div className="p-3 flex items-center gap-4">
            <FaFilm className="text-orange-500 flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <p className="text-sm font-medium truncate">
                {videoFile?.name || "Uploading..."}
              </p>

              {currentUpload && (
                <>
                  {currentUpload.progress === 100 && !currentUpload.done && (
                    <p className="text-xs text-orange-400 font-medium mt-1">
                      Processing...
                    </p>
                  )}
                  <div className="relative w-full bg-zinc-700 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${currentUpload.progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <FaExpand />
            </button>
            <button
              onClick={cancelAndClose}
              className="p-1 text-zinc-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-4 border-b border-zinc-700">
              <h2 className="text-lg font-bold">Upload Video</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    videoFile ? setIsMinimized(true) : onClose()
                  }
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <FaMinus />
                </button>
                <button
                  onClick={cancelAndClose}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="p-6">
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-zinc-800 border-2 border-zinc-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-orange-500 focus:outline-none mb-4"
              >
                <FaCloudUploadAlt className="w-8 h-8 text-zinc-500" />
                <span className="font-medium text-zinc-400">
                  Click to browse or{" "}
                  <span className="text-orange-500">drag & drop</span>
                </span>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  className="hidden"
                />
              </label>

              {videoFile && (
                <p className="text-sm text-zinc-300 mb-2 truncate">
                  File: {videoFile.name}
                </p>
              )}
              {localError && (
                <p className="text-red-400 text-sm mb-2">{localError}</p>
              )}

              {currentUpload && (
                <div className="mt-2">
                  {currentUpload.progress === 100 &&
                    !currentUpload.done && (
                      <p className="text-sm text-orange-400 font-medium mb-1 text-center">
                        Processing...
                      </p>
                    )}
                  <p className="text-sm text-right mb-1">
                    {currentUpload.progress}%
                  </p>
                  <div className="relative w-full bg-zinc-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentUpload.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={cancelAndClose}
                  className="px-4 py-2 bg-zinc-600 text-white rounded-md hover:bg-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!videoFile || !!currentUpload}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-zinc-700 disabled:text-zinc-400 font-semibold"
                >
                  Upload
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
