import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <div className="py-4 px-4 text-center bg-[#1e293b] md:text-left md:flex md:items-center md:justify-between mx-auto">
            <Link to="/" className="flex items-center text-white text-2xl font-bold">
                <div className="flex items-center space-x-2 text-xl font-bold">
                    <span>🔥</span>
                    <h2>Flame</h2>
                </div>
            </Link>
        </div>
    );
}

export default Navbar;
