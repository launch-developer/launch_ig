import React from 'react';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
}

const Layout = ({ children, hideNavbar = false }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
