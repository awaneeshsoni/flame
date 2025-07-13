import { createContext, useContext, useEffect, useState } from "react";

const WorkspaceContext = createContext();

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/workspace`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setWorkspaces(data);
      } catch (err) {
        console.error("Failed to fetch workspaces", err);
      }
    };

    if (token) fetchWorkspaces();
  }, [token]);

  return (
    <WorkspaceContext.Provider value={{ workspaces, setWorkspaces }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => useContext(WorkspaceContext);
