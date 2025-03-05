import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Home, ShoppingBag } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const CreateShop = () => {
  // State for the scraping form
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExistingData, setHasExistingData] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's existing scraped data
    const storedData = sessionStorage.getItem('lastScrapedData');
    setHasExistingData(!!storedData);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('instagram_url', instagramUrl);
      
      console.log('Sending request to:', `${API_URL}/scrape`);
      console.log('With URL:', instagramUrl);
      
      const response = await fetch(`${API_URL}/scrape`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to scrape Instagram profile');
      }

      const jsonPath = await response.text();
      console.log('Received JSON path:', jsonPath);
      
      // Make sure we have a valid path
      if (!jsonPath.startsWith('/static/')) {
        throw new Error('Invalid response format from server');
      }
      
      // Store minimal data in sessionStorage to start with
      sessionStorage.setItem('lastScrapedData', JSON.stringify({
        jsonPath,
        instagramUrl,
        posts: []
      }));
      
      // Redirect to the Shop page
      console.log('Scraping complete, redirecting to Shop page');
      navigate('/shop');
      
    } catch (err: any) {
      console.error('Error during scraping:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        {/* Navigation buttons */}
        <div className="flex justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          
          {hasExistingData && (
            <Link 
              to="/shop" 
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              <ShoppingBag size={18} className="mr-2" />
              View Current Shop
            </Link>
          )}
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Turn Instagram Posts</span>
            <span className="block text-indigo-600">Into Your Shop</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Enter an Instagram profile URL to create your shop instantly
          </p>
        </div>

        <div className="mt-10 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="sm:flex flex-col items-center">
            <div className="min-w-0 w-full">
              <label htmlFor="instagramUrl" className="sr-only">
                Instagram Profile URL
              </label>
              <input
                type="url"
                id="instagramUrl"
                className="block w-full px-4 py-3 rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://www.instagram.com/username"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                required
                pattern="https?://.*"
              />
            </div>
            {error && (
              <div className="mt-2 text-red-600 text-sm w-full text-center">
                {error}
              </div>
            )}
            <div className="mt-3 w-full sm:w-auto">
              <button
                type="submit"
                disabled={loading}
                className={`block w-full sm:w-auto px-8 py-3 rounded-md shadow bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Create Shop'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateShop; 