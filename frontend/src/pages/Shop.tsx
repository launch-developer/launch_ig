import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductGrid from '../components/ProductGrid';
import { featuredProducts } from '../data/products';

const API_URL = 'http://localhost:8000';

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

const Shop = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Shop: Fetching posts...');
        // Try to get data from sessionStorage
        const storedData = sessionStorage.getItem('lastScrapedData');
        
        if (!storedData) {
          console.log('Shop: No stored data found, using sample products');
          // If no data in sessionStorage, use sample products
          setPosts(featuredProducts);
          setLoading(false);
          return;
        }
        
        const parsedData: ScrapedData = JSON.parse(storedData);
        console.log('Shop: Found stored data:', parsedData);
        
        if (parsedData.posts && parsedData.posts.length > 0) {
          console.log('Shop: Using posts from session storage');
          // If posts are already in the stored data
          const convertedPosts = parsedData.posts.map((post: InstagramPost) => ({
            id: post.id || post.shortCode,
            name: post.caption ? post.caption.slice(0, 30) + (post.caption.length > 30 ? '...' : '') : 'Instagram Post',
            price: 0,
            color: 'Instagram',
            slug: post.shortCode,
            imageUrl: post.uploadedImageUrl
          }));
          
          setPosts(convertedPosts);
        } else if (parsedData.jsonPath) {
          console.log('Shop: Fetching posts from API:', `${API_URL}${parsedData.jsonPath}`);
          // If we need to fetch the posts from the API
          try {
            const response = await fetch(`${API_URL}${parsedData.jsonPath}`, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            if (!response.ok) {
              console.error('Shop: Failed to fetch data:', response.status, response.statusText);
              throw new Error('Failed to fetch shop data');
            }
            
            const responseText = await response.text();
            console.log('Shop: Received response text:', responseText.substring(0, 100) + '...');
            
            try {
              const scrapedPosts = JSON.parse(responseText);
              console.log('Shop: Successfully parsed JSON, found posts:', scrapedPosts.length);
              
              // Convert to product format
              const convertedPosts = scrapedPosts.map((post: InstagramPost) => ({
                id: post.id || post.shortCode,
                name: post.caption ? post.caption.slice(0, 30) + (post.caption.length > 30 ? '...' : '') : 'Instagram Post',
                price: 0,
                color: 'Instagram',
                slug: post.shortCode,
                imageUrl: post.uploadedImageUrl
              }));
              
              setPosts(convertedPosts);
              
              // Update sessionStorage with posts included
              sessionStorage.setItem('lastScrapedData', JSON.stringify({
                ...parsedData,
                posts: scrapedPosts
              }));
            } catch (jsonError) {
              console.error('Shop: Error parsing JSON:', jsonError);
              throw new Error('Invalid JSON response from server');
            }
          } catch (fetchError) {
            console.error('Shop: Error fetching from API:', fetchError);
            // Fallback to sample products
            setPosts(featuredProducts);
          }
        } else {
          console.log('Shop: No posts or jsonPath in stored data, using sample products');
          // Fallback to sample products
          setPosts(featuredProducts);
        }
      } catch (err: any) {
        console.error('Shop: Error in fetchPosts:', err);
        setError(err.message || 'Failed to load products');
        // Fallback to sample products
        setPosts(featuredProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="py-10 px-6">
          <h1 className="text-3xl font-light tracking-wide text-center mb-12">Shop All Products</h1>
          <div className="flex justify-center">
            <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="py-10 px-6">
          <h1 className="text-3xl font-light tracking-wide text-center mb-12">Shop All Products</h1>
          <div className="text-center text-red-600">{error}</div>
          <div className="mt-6 text-center">
            <Link 
              to="/create-shop" 
              className="inline-block px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Return to Instagram Scraper
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-10 px-6">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-light tracking-wide text-center flex-grow">Shop All Products</h1>
          <Link 
            to="/create-shop" 
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm"
          >
            Change Instagram Profile
          </Link>
        </div>
        <ProductGrid products={posts} />
      </div>
    </Layout>
  );
};

export default Shop;
