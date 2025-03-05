import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User } from 'lucide-react';

const LandingHeader = () => {
  return (
    <header className="relative">
      <nav className="px-6 py-5 flex items-center justify-end border-b border-border">
        {/* Right navigation items */}
        <div className="flex items-center space-x-6">
          <button aria-label="Search" className="hover:opacity-70 transition-opacity">
            <Search size={20} />
          </button>
          <Link to="/account" aria-label="Account" className="hover:opacity-70 transition-opacity">
            <User size={20} />
          </Link>
          <Link to="/cart" aria-label="Shopping bag" className="hover:opacity-70 transition-opacity relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default LandingHeader; 