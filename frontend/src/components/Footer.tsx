import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext';

const Footer = () => {
  const { storeName } = useStore();

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/men" className="text-sm text-muted-foreground hover:text-black transition-colors">Men</Link></li>
              <li><Link to="/women" className="text-sm text-muted-foreground hover:text-black transition-colors">Women</Link></li>
              <li><Link to="/sale" className="text-sm text-muted-foreground hover:text-black transition-colors">Sale</Link></li>
              <li><Link to="/new-arrivals" className="text-sm text-muted-foreground hover:text-black transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/shipping" className="text-sm text-muted-foreground hover:text-black transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-sm text-muted-foreground hover:text-black transition-colors">Returns</Link></li>
              <li><Link to="/sizing" className="text-sm text-muted-foreground hover:text-black transition-colors">Sizing</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-black transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/our-story" className="text-sm text-muted-foreground hover:text-black transition-colors">Our Story</Link></li>
              <li><Link to="/responsibility" className="text-sm text-muted-foreground hover:text-black transition-colors">Responsibility</Link></li>
              <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-black transition-colors">Careers</Link></li>
              <li><Link to="/stores" className="text-sm text-muted-foreground hover:text-black transition-colors">Stores</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/privacy" className="text-xs text-muted-foreground hover:text-black transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-xs text-muted-foreground hover:text-black transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
