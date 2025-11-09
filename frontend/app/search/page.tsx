'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, Scale, Filter } from 'lucide-react';
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store';
import { productsAPI } from '@/lib/apiService';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');
  
  const addToCart = useCartStore((state) => state.addItem);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { items: compareItems, addItem: addToCompare, removeItem: removeFromCompare } = useCompareStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getAll({ search: query });
        let results = response.products || [];
        
        // Apply sorting
        if (sortBy === 'price-low') {
          results.sort((a: any, b: any) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          results.sort((a: any, b: any) => b.price - a.price);
        } else if (sortBy === 'name') {
          results.sort((a: any, b: any) => a.name.localeCompare(b.name));
        }
        
        setProducts(results);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query, sortBy]);

  const isInWishlist = (product: any) => {
    return wishlistItems.some(item => item.id === (product._id || product.id));
  };

  const isInCompare = (product: any) => {
    return compareItems.some(item => item.id === (product._id || product.id));
  };

  const toggleWishlist = (product: any) => {
    const productId = product._id || product.id;
    if (isInWishlist(product)) {
      removeFromWishlist(productId);
    } else {
      // Normalize product with 'id' field for store
      addToWishlist({ ...product, id: productId });
    }
  };

  const toggleCompare = (product: any) => {
    const productId = product._id || product.id;
    if (isInCompare(product)) {
      removeFromCompare(productId);
    } else {
      // Normalize product with 'id' field for store
      addToCompare({ ...product, id: productId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Searching for "{query}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            {products.length} {products.length === 1 ? 'result' : 'results'} found for 
            <span className="font-bold text-purple-600"> "{query}"</span>
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-700">Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="relevance">Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Results Found</h2>
            <p className="text-gray-600 mb-8">
              We couldn't find any instruments matching "{query}". Try searching with different keywords.
            </p>
            <Link
              href="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Browse All Instruments
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id || product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.images?.[0] || '/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="eager"
                  />
                  
                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => toggleWishlist(product)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isInWishlist(product)
                          ? 'bg-pink-500 text-white'
                          : 'bg-white/90 hover:bg-pink-500 hover:text-white text-gray-900'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(product) ? 'fill-white' : ''}`} />
                    </button>
                    <button
                      onClick={() => toggleCompare(product)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                        isInCompare(product)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/90 hover:bg-blue-500 hover:text-white text-gray-900'
                      }`}
                    >
                      <Scale className="w-5 h-5" />
                    </button>
                  </div>

                  {product.badge && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {product.badge}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <Link href={`/products/${product._id || product.id}`}>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 hover:text-purple-600 transition">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-1">{product.subcategory}</p>
                  {product.specifications?.brand && (
                    <p className="text-xs text-purple-600 font-semibold mb-3">
                      {product.specifications.brand}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{product.price.toLocaleString()}
                      </div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart({ ...product, id: product._id || product.id })}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}
