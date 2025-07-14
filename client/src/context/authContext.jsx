import { createContext, useContext, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        try {
          const res = await fetch(`${API}/api/auth/verify-token`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch user");
          }
          const data = await res.json();
          setToken(storedToken);
          setUser(data.user);
        } catch (err) {
          console.error("Error fetching user:", err);
          logout(); 

        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);


  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
