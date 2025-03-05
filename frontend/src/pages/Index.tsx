import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductGrid from '../components/ProductGrid';
import { featuredProducts } from '../data/products';
import { ArrowRight, PackagePlus, Instagram, Edit2 } from 'lucide-react';
import { useStore } from '../lib/StoreContext';

interface InstagramPost {
  id: string;
  shortCode: string;
  caption: string;
  uploadedImageUrl: string;
  commentsCount: number;
  likesCount: number;
  timestamp: string;
  childPosts?: InstagramPost[];
}

interface ScrapedData {
  jsonPath: string;
  instagramUrl: string;
  posts: InstagramPost[];
}

const Index = () => {
  const [email, setEmail] = useState('');
  const [heroTitle, setHeroTitle] = useState('New Season Collection');
  const [heroDescription, setHeroDescription] = useState('Discover timeless designs with minimalist aesthetics and premium quality');
  const [displayProducts, setDisplayProducts] = useState(featuredProducts.slice(0, 6));
  const [isHeroTitleFocused, setIsHeroTitleFocused] = useState(false);
  const [isHeroDescriptionFocused, setIsHeroDescriptionFocused] = useState(false);
  
  // Get the last scraped data from sessionStorage if available
  const lastScrapedData = sessionStorage.getItem('lastScrapedData');
  const hasScrapedData = !!lastScrapedData;
  
  useEffect(() => {
    if (hasScrapedData) {
      try {
        const parsedData: ScrapedData = JSON.parse(lastScrapedData!);
        
        if (parsedData.posts && parsedData.posts.length > 0) {
          // Get the 6 most recent posts
          const recentPosts = [...parsedData.posts]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 6);
            
          // Convert to product format
          const convertedPosts = recentPosts.map((post: InstagramPost) => ({
            id: post.id || post.shortCode,
            name: post.caption ? post.caption.slice(0, 30) + (post.caption.length > 30 ? '...' : '') : 'Instagram Post',
            price: 0,
            color: 'Instagram',
            slug: post.shortCode,
            imageUrl: post.uploadedImageUrl
          }));
          
          setDisplayProducts(convertedPosts);
        }
      } catch (error) {
        console.error('Error parsing scraped data:', error);
        // Fallback to sample products
        setDisplayProducts(featuredProducts.slice(0, 6));
      }
    } else {
      // Use first 6 sample products if no scraped data
      setDisplayProducts(featuredProducts.slice(0, 6));
    }
  }, [lastScrapedData, hasScrapedData]);
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed with:', email);
    setEmail('');
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden bg-white">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-black p-6 max-w-4xl mx-auto">
            <div className="relative inline-block group">
              <textarea
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                onFocus={() => setIsHeroTitleFocused(true)}
                onBlur={() => setIsHeroTitleFocused(false)}
                className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-wider uppercase mb-4 bg-transparent text-center border-none focus:outline-none resize-none w-full transition-all duration-200 ${isHeroTitleFocused ? 'bg-gray-50' : 'group-hover:bg-gray-50'}`}
                style={{ height: 'auto', overflow: 'hidden' }}
                placeholder="Enter Hero Title"
              />
              <Edit2 size={16} className={`absolute top-0 right-0 opacity-0 group-hover:opacity-50 ${isHeroTitleFocused ? 'opacity-100' : ''} transition-opacity duration-200`} />
            </div>
            
            <div className="relative inline-block group">
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                onFocus={() => setIsHeroDescriptionFocused(true)}
                onBlur={() => setIsHeroDescriptionFocused(false)}
                className={`text-lg md:text-xl font-light mb-8 bg-transparent text-center border-none focus:outline-none resize-none w-full max-w-xl mx-auto transition-all duration-200 ${isHeroDescriptionFocused ? 'bg-gray-50' : 'group-hover:bg-gray-50'}`}
                style={{ height: 'auto', overflow: 'hidden' }}
                placeholder="Enter Hero Description"
              />
              <Edit2 size={16} className={`absolute top-0 right-0 opacity-0 group-hover:opacity-50 ${isHeroDescriptionFocused ? 'opacity-100' : ''} transition-opacity duration-200`} />
            </div>
            
            <div className="flex justify-center gap-4">
              {hasScrapedData ? (
                <Link to="/shop" className="px-8 py-3 bg-black text-white uppercase text-sm tracking-wider font-medium hover:bg-opacity-90 transition-colors">
                  Shop
                </Link>
              ) : (
                <Link to="/create-shop" className="px-8 py-3 bg-black text-white uppercase text-sm tracking-wider font-medium hover:bg-opacity-90 transition-colors">
                  Create Shop
                </Link>
              )}
              
              {hasScrapedData && (
                <Link to="/create-shop" className="px-8 py-3 border border-black text-black uppercase text-sm tracking-wider font-medium hover:bg-black hover:text-white transition-colors flex items-center">
                  <Instagram size={16} className="mr-2" />
                  Change Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Scraper Banner */}
      <section className="py-8 px-6 bg-[#f8f8f8] border-y border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-light tracking-wide mb-2 flex items-center justify-center md:justify-start">
              <Instagram size={20} className="mr-2" />
              Instagram Shop Creator
            </h2>
            <p className="text-muted-foreground">
              Turn your Instagram feed into a shoppable store in seconds
            </p>
          </div>
          <Link to="/create-shop" className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-opacity-90 transition-colors">
            Create or Update Shop
          </Link>
        </div>
      </section>

      {/* Featured Products - Limited to 6 */}
      <ProductGrid products={displayProducts} title="Featured Products" />

      {/* Brand Philosophy Section */}
      <section className="py-16 px-6 bg-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">Thoughtful Design</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our products are crafted with meticulous attention to detail, focusing on clean silhouettes, 
            premium materials, and timeless designs that transcend trends.
          </p>
          <a href="/our-story" className="inline-block px-8 py-3 border border-black text-sm uppercase tracking-wider font-medium hover:bg-black hover:text-white transition-colors">
            Our Philosophy
          </a>
        </div>
      </section>

      {/* Two-column Feature Section */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#f5f5f5] flex items-center justify-center p-12 md:p-20">
          <div className="max-w-md">
            <div className="flex items-center mb-4">
              <PackagePlus className="mr-2" size={20} />
              <h2 className="text-2xl md:text-3xl font-light tracking-wide">New Arrivals</h2>
            </div>
            <p className="text-muted-foreground mb-8">
              Explore our latest collection featuring essential pieces designed for everyday versatility.
            </p>
            <Link to="/new-arrivals" className="inline-flex items-center px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-opacity-90 transition-colors">
              Explore Collection
              <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
        <div className="bg-[#efefef] flex items-center justify-center p-12 md:p-20">
          <div className="max-w-md">
            <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">Shop Now</h2>
            <p className="text-muted-foreground mb-8">
              Discover our complete collection of minimalist, high-quality garments designed for your everyday wardrobe.
            </p>
            {hasScrapedData ? (
              <Link to="/shop" className="inline-flex items-center px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-opacity-90 transition-colors">
                View All Products
                <ArrowRight size={16} className="ml-2" />
              </Link>
            ) : (
              <Link to="/create-shop" className="inline-flex items-center px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-opacity-90 transition-colors">
                Create Your Shop
                <ArrowRight size={16} className="ml-2" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-6">Stay Connected</h2>
          <p className="text-muted-foreground mb-8">
            Subscribe to receive updates on new collections, exclusive offers, and styling inspiration.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 border border-border focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-opacity-90 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Index; 