import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth } from "../context/authContext";
import { useWorkspaceContext } from "../context/WorkspaceContext";

const API = import.meta.env.VITE_API_URL;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { setWorkspaces } = useWorkspaceContext();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      const { user, token } = data;
      login(token,user);
      const wsRes = await fetch(`${API}/api/workspace`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const workspaces = await wsRes.json();
      if (!wsRes.ok) throw new Error(workspaces.message || "Failed to fetch workspaces");
      setWorkspaces(workspaces);
      if (workspaces.length > 0) {
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
    <div className="bg-black text-white min-h-screen flex flex-col">
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-black border border-white/10 p-8 rounded-md shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Create an <span className="text-orange-600">Account</span>
          </h2>

          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4 text-sm">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-3 border border-white/20 bg-white text-black rounded-md focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
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
                "Sign Up"
              )}
            </button>
          </form>

          <p className="text-center mt-4 text-white/70">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Signup;
