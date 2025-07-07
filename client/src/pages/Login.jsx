// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API = import.meta.env.VITE_API_URL;

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token & username in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("name", data.username); // Use 'name' not 'username' if your backend returns that
      localStorage.setItem("userId", data.userId); // Use 'name' not 'username' if your backend returns that
      localStorage.setItem("plan", data.plan); // Use 'name' not 'username' if your backend returns that

      setIsAuthenticated(true);

      // Redirect based on available workspace
      const workspaceRes = await fetch(`${API}/api/workspace`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const workspaces = await workspaceRes.json();
      if (Array.isArray(workspaces) && workspaces.length > 0) {
        navigate(`/workspace/${workspaces[0]._id}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 text-white">
        <div className="w-full max-w-md bg-black border border-white/10 p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Welcome Back to <span className="text-orange-600">Flame</span>
          </h2>

          {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4 text-sm">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-white/20 bg-white text-black rounded-md focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-white/20 bg-white text-black rounded-md focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-md transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex justify-center">
                  <div className="animate-spin border-4 border-white/30 border-t-orange-600 rounded-full w-6 h-6"></div>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center mt-4 text-white/70">
            Don't have an account?{" "}
            <Link to="/signup" className="text-orange-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
