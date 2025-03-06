import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  color: string;
  slug: string;
  imageUrl?: string;
}

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [name, setName] = useState(product.name);
  const [color, setColor] = useState(product.color);
  const [price, setPrice] = useState(product.price.toString());
  
  const isInstagramPost = color === 'Instagram';

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  return (
    <div className="group">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="bg-[#f1f1f1] aspect-[1/1.25] flex items-center justify-center relative overflow-hidden">
          {product.imageUrl ? (
            <>
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isInstagramPost && (
                <div className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm">
                  <Instagram size={16} />
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-xs uppercase tracking-wider">
              Product Image
            </div>
          )}
        </div>
      </Link>
      
      <div className="mt-4 space-y-1">
        {isInstagramPost ? (
          <div className="text-sm line-clamp-2 h-10 overflow-hidden">
            {name}
          </div>
        ) : (
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-center uppercase text-sm tracking-wider font-medium border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none"
          />
        )}
        
        {isInstagramPost ? (
          <div className="text-xs uppercase tracking-wider flex items-center justify-center">
            <Instagram size={12} className="mr-1" /> Instagram Post
          </div>
        ) : (
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full text-center text-xs uppercase tracking-wider border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none"
          />
        )}
        
        {!isInstagramPost && (
          <div className="flex justify-center items-center mt-1">
            <input
              type="text"
              value={price}
              onChange={handlePriceChange}
              className="w-full text-center text-sm border-b border-transparent hover:border-gray-300 focus:border-black focus:outline-none"
              placeholder="Price"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
