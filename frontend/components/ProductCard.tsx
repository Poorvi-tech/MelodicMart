'use client';

import Image from 'next/image';
import { Star, Heart, Scale, ShoppingCart, Play, Video } from 'lucide-react';
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export default function ProductCard({ product, showActions = true }: ProductCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompareStore();

  // Get product ID (handle both id and _id fields)
  const productId = product.id || (product as any)._id;
  
  const inWishlist = productId ? isInWishlist(productId) : false;
  const inCompare = productId ? isInCompare(productId) : false;

  // Trigger interaction counter when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
      (window as any).incrementInteraction();
    }
  }, []);

  const handleWishlistToggle = () => {
    // Check if product has valid ID
    const productId = product.id || (product as any)._id;
    if (!productId) {
      console.error('[ProductCard] Product has no valid ID:', product);
      return;
    }
    
    // Pass product with proper ID to toggle function
    toggleWishlist({ ...product, id: productId });
    
    // Increment interaction counter
    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
      (window as any).incrementInteraction();
    }
  };

  const handleCompareToggle = () => {
    // Check if product has valid ID
    const productId = product.id || (product as any)._id;
    if (!productId) {
      console.error('[ProductCard] Product has no valid ID for compare:', product);
      return;
    }
    
    if (inCompare) {
      removeFromCompare(productId);
    } else {
      addToCompare({ ...product, id: productId });
    }
    
    // Increment interaction counter
    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
      (window as any).incrementInteraction();
    }
  };

  const handlePlayAudio = () => {
    if (product.audioSamples && product.audioSamples.length > 0) {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
      } else {
        const audio = new Audio(product.audioSamples[0].url);
        audio.play();
        setCurrentAudio(audio);
        setIsPlaying(true);
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        };
      }
      
      // Increment interaction counter
      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
        (window as any).incrementInteraction();
      }
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden group transition-all transform hover:-translate-y-3 hover:scale-105 border relative border-indigo-100 shadow-lg shadow-indigo-100/30 cursor-pointer animate-fadeIn"
      onClick={() => {
        // Navigate to product detail page
        // Use the product slug if available, otherwise generate from ID or name
        let productSlug = product.slug;
        if (!productSlug) {
          // Generate slug from ID or name
          const baseId = product.id || (product as any)._id;
          productSlug = baseId ? baseId.replace(/[^a-zA-Z0-9]/g, '-') : 
                       product.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/\s+/g, '-');
        }
        window.location.href = `/products/${productSlug}`;
        
        // Increment interaction counter
        if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
          (window as any).incrementInteraction();
        }
      }}
    >
      {/* Floating Bubble Effect */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-100 opacity-40 animate-bubblePulse" style={{ animationDelay: '0s' }}></div>
      
      <div className="relative aspect-square overflow-visible bg-gray-50">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading="eager"
        />
        
        {/* Very Prominent Wishlist Heart Button - Always Visible */}
        {showActions && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWishlistToggle();
            }}
            className="absolute top-3 right-3 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-2xl z-30 border-4 border-white hover:from-pink-600 hover:to-rose-600 transition-all duration-200 transform hover:scale-110 ring-4 ring-pink-200 ring-opacity-50 animate-pulse"
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart 
              className="w-4 h-4 sm:w-6 sm:h-6 transition-colors duration-200" 
              fill="white"
              color="white"
            />
          </button>
        )}
        
        {/* Badges */}
        {product.badge && (
          <div className="absolute top-3 left-3 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse">
            {product.badge}
          </div>
        )}
        
        {product.originalPrice && (
          <div className="absolute top-3 right-16 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
            SAVE ₹{product.originalPrice - product.price}
          </div>
        )}
      </div>
      
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-lg mb-2 text-indigo-900 line-clamp-2">{product.name}</h3>
        <p className="text-indigo-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-sm text-indigo-500">({product.reviews})</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-700">₹{product.price.toLocaleString()}</div>
            {product.originalPrice && (
              <div className="text-sm text-indigo-400 line-through">₹{product.originalPrice.toLocaleString()}</div>
            )}
          </div>
        </div>

        {/* Audio & Video Indicators */}
        {(product.audioSamples || product.videoUrl) && (
          <div className="flex gap-2 mb-3">
            {product.audioSamples && product.audioSamples.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                <Play className="w-3 h-3" />
                {product.audioSamples.length} Audio
              </span>
            )}
            {product.videoUrl && (
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center gap-1">
                <Video className="w-3 h-3" />
                Video
              </span>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
              // Show success message and option to go to cart
              if (typeof window !== 'undefined') {
                const confirmed = window.confirm(`${product.name} added to cart! Would you like to view your cart now?`);
                if (confirmed) {
                  window.location.href = '/cart';
                }
              }
              
              // Increment interaction counter
              if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                (window as any).incrementInteraction();
              }
            }}
            className="flex-1 text-white py-2 rounded-lg font-bold transition-all transform hover:scale-110 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-200/30 hover:animate-pulse"
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Add to Cart
          </button>
          
          {/* Compare Button */}
          {showActions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCompareToggle();
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center transition-all ${
                inCompare 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg animate-pulse' 
                  : 'bg-white border-2 border-blue-300 text-blue-500 hover:bg-blue-50'
              }`}
              title={inCompare ? 'Remove from Compare' : 'Add to Compare'}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}