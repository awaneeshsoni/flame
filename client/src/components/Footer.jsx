import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-6 text-center text-white/70 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4">
        <p className="text-sm">© {currentYear} Flame. All rights reserved.</p>
        <div className="mt-3 space-x-6 text-sm">
          <Link to="/" className="hover:text-orange-600 transition">
            Home
          </Link>
          <Link to="/blog" className="hover:text-orange-600 transition">
            Blog
          </Link>
          <Link to="/about" className="hover:text-orange-600 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-orange-600 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
