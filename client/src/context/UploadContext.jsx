import axios from "axios";
import { createContext, useContext, useState } from "react";

const UploadContext = createContext();
const API = import.meta.env.VITE_API_URL

export const UploadProvider = ({ children }) => {
  const [uploads, setUploads] = useState([]); 

  const startUpload = ({ file, wsid, onComplete, onError }) => {
    const id = Date.now();

    const CancelToken = axios.CancelToken;
    let cancel;
    const newUpload = {
      id,
      file,
      progress: 0,
      error: null,
      done: false,
      cancelToken: CancelToken.source(),
    };

    setUploads((prev) => [...prev, newUpload]);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("workspaceId", wsid);

    axios
      .post(`${API}/api/video/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        cancelToken: newUpload.cancelToken.token,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploads((prev) =>
            prev.map((u) => (u.id === id ? { ...u, progress: percent } : u))
          );
        },
      })
      .then((res) => {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, done: true, progress: 100 } : u
          )
        );
        onComplete(res.data.video);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          onError("Upload cancelled");
        } else {
          onError(err.message || "Upload failed");
        }
        setUploads((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, error: err.message, progress: 0 } : u
          )
        );
      });
  };

  const cancelUpload = (id) => {
    const target = uploads.find((u) => u.id === id);
    if (target) {
      target.cancelToken.cancel("Upload cancelled");
      setUploads((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <UploadContext.Provider value={{ uploads, startUpload, cancelUpload }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => useContext(UploadContext);
