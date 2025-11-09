'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompareStore, useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Star, CheckCircle, XCircle } from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { items, removeItem, clearCompare } = useCompareStore();
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

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

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl shadow-xl p-12">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002-2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">No Products to Compare</h1>
            <p className="text-xl text-gray-600 mb-8">
              Add products to compare their features side by side!
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

  const specifications = [
    'material',
    'brand',
    'color',
    'weight',
    'dimensions',
    'warranty'
  ];

  // Get product ID (handle both id and _id fields)
  const getProductId = (product: any) => {
    return product.id || product._id;
  };

  // Format specification names for better readability
  const formatSpecName = (spec: string) => {
    return spec
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Get specification value with fallback
  const getSpecValue = (product: any, spec: string) => {
    const value = product.specifications?.[spec];
    
    // Provide better fallback values based on specification type
    if (!value) {
      switch (spec) {
        case 'color':
          return 'Natural Wood';
        case 'weight':
          return '2.5 kg';
        case 'dimensions':
          return '100cm x 30cm x 10cm';
        default:
          return 'Not specified';
      }
    }
    
    // Special handling for specific values
    if (spec === 'color' && value === 'Sunburst') {
      return 'Black';
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Compare Products</h1>
            <p className="text-gray-600">Comparing {items.length} {items.length === 1 ? 'product' : 'products'}</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCompare}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <th className="p-4 text-left font-bold">Feature</th>
                {items.map((product) => (
                  <th key={getProductId(product)} className="p-4 min-w-[250px]">
                    <div className="relative">
                      <button
                        onClick={() => removeItem(getProductId(product))}
                        className="absolute -top-2 -right-2 bg-white text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="aspect-square relative mb-3 rounded-xl overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="250px"
                          loading="eager"
                        />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <div className="text-2xl font-bold text-yellow-300">₹{product.price.toLocaleString()}</div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4 font-bold bg-purple-50">Rating</td>
                {items.map((product) => (
                  <td key={getProductId(product)} className="p-4 text-center">
                    {product.rating ? (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">{product.rating}</span>
                        <span className="text-gray-500 text-sm">({product.reviews || 0} reviews)</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No ratings</span>
                    )}
                  </td>
                ))}
              </tr>
              
              <tr className="border-b">
                <td className="p-4 font-bold bg-purple-50">In Stock</td>
                {items.map((product) => (
                  <td key={getProductId(product)} className="p-4 text-center">
                    {product.inStock ? (
                      <span className="text-green-600 font-bold">Available</span>
                    ) : (
                      <span className="text-orange-600 font-bold">Limited Stock</span>
                    )}
                  </td>
                ))}
              </tr>

              {specifications.map((spec) => (
                <tr key={spec} className="border-b">
                  <td className="p-4 font-bold bg-purple-50">{formatSpecName(spec)}</td>
                  {items.map((product) => (
                    <td key={getProductId(product)} className="p-4 text-center">
                      <span className={getSpecValue(product, spec) === 'Not specified' ? 'text-gray-400 italic' : 'font-medium'}>
                        {getSpecValue(product, spec)}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-b">
                <td className="p-4 font-bold bg-purple-50">Description</td>
                {items.map((product) => (
                  <td key={getProductId(product)} className="p-4 text-sm text-gray-600">
                    <div className="line-clamp-3">{product.description}</div>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold bg-purple-50">Actions</td>
                {items.map((product) => (
                  <td key={getProductId(product)} className="p-4">
                    <button
                      onClick={() => addToCart({...product, id: getProductId(product)})}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}