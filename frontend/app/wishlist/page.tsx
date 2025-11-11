'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWishlistStore, useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';

export default function WishlistPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    console.log('[WishlistPage] Items updated, count:', items.length);
  }, [items]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
            <p className="text-xl text-gray-600 mb-8">
              Start adding your favorite instruments to your wishlist!
            </p>
            <Link 
              href="/categories/string-instruments"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Browse Instruments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Wishlist <Heart className="inline w-8 h-8 text-red-500 fill-red-500" />
            </h1>
            <p className="text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((product, index) => (
            <div key={product.id || index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="eager"
                />
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-red-500 hover:text-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                {product.badge && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {product.badge}
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">₹{product.price.toLocaleString()}</div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}