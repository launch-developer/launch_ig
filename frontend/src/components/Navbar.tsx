import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { useStore } from '../lib/StoreContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { storeName, setStoreName, announcementText, setAnnouncementText } = useStore();

  return (
    <header className="relative">
      <div className="announcement-bar">
        <input
          type="text"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full bg-transparent text-white text-center focus:outline-none"
          aria-label="Announcement text"
        />
      </div>
      
      <nav className="px-6 py-5 flex items-center justify-between border-b border-border">
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        {/* Desktop navigation links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link to="/" className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">Home</Link>
          <Link to="/shop" className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">Shop</Link>
        </div>
        
        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="text-xl sm:text-2xl font-light tracking-[0.15em] uppercase text-center bg-transparent border-none focus:outline-none"
            aria-label="Store name"
          />
        </div>
        
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
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute z-50 bg-background w-full border-b border-border animate-fade-in">
          <div className="p-6 flex flex-col space-y-6">
            <Link 
              to="/" 
              className="text-lg uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              className="text-lg uppercase tracking-wider"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
