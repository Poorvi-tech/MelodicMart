'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Star, Filter, ChevronDown } from 'lucide-react';
import { categories as staticCategories } from '@/data/categories';
import { products as staticProducts } from '@/data/products';
import { useCartStore } from '@/lib/store';
import { categoriesAPI, productsAPI } from '@/lib/apiService';
import ProductCard from '@/components/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const addItem = useCartStore((state) => state.addItem);
  
  const [category, setCategory] = useState<any>(null);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<string>('all');

  useEffect(() => {
    // Always use static data for now to ensure products show up
    const staticCategory = staticCategories.find((c) => c.slug === slug);
    setCategory(staticCategory || null);
    
    if (staticCategory) {
      const staticProds = staticProducts.filter((p) => p.category === staticCategory.id);
      setCategoryProducts(staticProds);
    }
    
    setLoading(false);
  }, [slug]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <p className="text-gray-600">The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Filter products
  let filteredProducts = categoryProducts;
  
  if (selectedSubcategory !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.subcategory === selectedSubcategory);
  }
  
  if (priceRange !== 'all') {
    filteredProducts = filteredProducts.filter(p => {
      if (priceRange === 'under-5000') return p.price < 5000;
      if (priceRange === '5000-15000') return p.price >= 5000 && p.price < 15000;
      if (priceRange === '15000-30000') return p.price >= 15000 && p.price < 30000;
      if (priceRange === 'above-30000') return p.price >= 30000;
      return true;
    });
  }
  
  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-purple-100 mb-6">{category.description}</p>
            <div className="flex items-center gap-4 text-yellow-400">
              <span className="font-semibold">{categoryProducts.length} Products Available</span>
              <span>•</span>
              <span>Premium Quality</span>
              <span>•</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
              </div>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        value="all"
                        checked={selectedSubcategory === 'all'}
                        onChange={() => setSelectedSubcategory('all')}
                        className="text-purple-600"
                      />
                      <span className="text-gray-700">All Products</span>
                    </label>
                    {category.subcategories.map((sub: string) => (
                      <label key={sub} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="subcategory"
                          value={sub}
                          checked={selectedSubcategory === sub}
                          onChange={() => setSelectedSubcategory(sub)}
                          className="text-purple-600"
                        />
                        <span className="text-gray-700">{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="all"
                      checked={priceRange === 'all'}
                      onChange={() => setPriceRange('all')}
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">All Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="under-5000"
                      checked={priceRange === 'under-5000'}
                      onChange={() => setPriceRange('under-5000')}
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">Under ₹5,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="5000-15000"
                      checked={priceRange === '5000-15000'}
                      onChange={() => setPriceRange('5000-15000')}
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">₹5,000 - ₹15,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="15000-30000"
                      checked={priceRange === '15000-30000'}
                      onChange={() => setPriceRange('15000-30000')}
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">₹15,000 - ₹30,000</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="above-30000"
                      checked={priceRange === 'above-30000'}
                      onChange={() => setPriceRange('above-30000')}
                      className="text-purple-600"
                    />
                    <span className="text-gray-700">Above ₹30,000</span>
                  </label>
                </div>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() => {
                  setSelectedSubcategory('all');
                  setPriceRange('all');
                  setSortBy('featured');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Bar */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
              </div>
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more results</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id || product.slug} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}