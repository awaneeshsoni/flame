import { FaFilm, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useUpload } from "../context/UploadContext";

function UploadTracker({ upload }) {
  const { cancelUpload } = useUpload();

  return (
    <div className="bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 w-full max-w-xs p-3 flex items-center gap-3">
      {upload.done ? (
        <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
      ) : upload.error ? (
        <FaTimesCircle className="text-red-500 text-xl flex-shrink-0" />
      ) : (
        <FaFilm className="text-orange-500 flex-shrink-0" />
      )}

      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium truncate">{upload.file.name}</p>
        {upload.error ? (
          <p className="text-xs text-red-400">{upload.error}</p>
        ) : (
          <>
            {upload.progress === 100 && !upload.done && (
              <p className="text-xs text-orange-400 font-medium mb-1">
                Processing...
              </p>
            )}
            <div className="relative w-full bg-zinc-700 rounded-full h-1.5 mt-1">
              <div
                className="bg-orange-500 h-1.5 rounded-full transition-all"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </>
        )}
      </div>
      {!upload.done && (
        <button
          onClick={() => cancelUpload(upload.id)}
          className="p-1 text-zinc-400 hover:text-white"
        >
          <FaTimesCircle />
        </button>
      )}
    </div>
  );
}

export default UploadTracker;
