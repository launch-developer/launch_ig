
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-6">
        <div className="text-center">
          <h1 className="text-7xl font-light mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-8">The page you're looking for doesn't exist</p>
          <a href="/" className="inline-block px-8 py-3 bg-black text-white text-sm uppercase tracking-wider font-medium hover:bg-opacity-90 transition-colors">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
