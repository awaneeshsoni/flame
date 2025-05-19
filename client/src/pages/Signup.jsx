import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API = import.meta.env.VITE_API_URL;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f172a]">
      <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white p-4"> 
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSignup} className="w-full max-w-md bg-[#1e293b] p-6 rounded-lg shadow-md"> 
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border border-gray-600 bg-[#fef9c3] text-black rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-600 bg-[#fef9c3] text-black rounded mb-4" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-600 bg-[#fef9c3] text-black rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-white text-black py-2 rounded font-semibold disabled:opacity-50" 
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
                <div className="animate-spin border-4 border-gray-400 border-t-black rounded-full w-6 h-6"></div>
            </div>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <p className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-gray-400 hover:text-white">
          Login
        </Link>
      </p>
    </div>
    <Footer />
    </div>
  );
}

export default Signup;