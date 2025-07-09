import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const onAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  const isFreePlan = localStorage.getItem("plan") || "free";
  const userId = localStorage.getItem("userId") || "free";
  const name = localStorage.getItem("name") || "free";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setIsAuthenticated(false);
    navigate("/");
  };

  // Detect outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(!showDropdown);
      }
    };
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);
  function handleClick(){
    setShowDropdown((prev) => !prev);

  }

  return (
    <nav className="bg-black py-5 px-4 border-b border-white/10">
      <div className="max-w-screen flex justify-between items-center">
        <Link to="/" className="flex items-center text-white text-xl font-bold space-x-2">
          <span className="text-orange-600 text-2xl">🔥</span>
          <span>Flameio</span>
        </Link>

        <div className="flex items-center space-x-6 text-sm text-white/80 relative">
          {isAuthenticated ? (
            <>
              {isFreePlan && (
                <Link to="/pricing" className="hover:text-orange-600 transition">
                  Pricing
                </Link>
              )}
              <Link to="/dashboard" className="hover:text-orange-600 transition">
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleClick}
                  className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center justify-center"
                  title="Profile"
                >
                  {name?.charAt(0)?.toUpperCase() || "U"}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg py-2 z-50">
                    <button
                      onClick={() => {setShowDropdown(false); navigate(`/profile/${userId}`)}}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/pricing" className="hover:text-orange-600 transition">Pricing</Link>
              <Link to="/about" className="hover:text-orange-600 transition">About</Link>
              <Link to="/contact" className="hover:text-orange-600 transition">Contact</Link>
              <Link to="/login" className="hover:text-orange-600 transition">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
