import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Shop from './pages/Shop';
import CreateShop from './pages/CreateShop';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';
import { StoreProvider } from './lib/StoreContext';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/create-shop" element={<CreateShop />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </StoreProvider>
  );
}

export default App;
