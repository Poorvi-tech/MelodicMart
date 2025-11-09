'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';

interface ProductRecommendationsProps {
  currentProductId?: string;
  category?: string;
  title?: string;
  products?: Product[];
}

export default function ProductRecommendations({ 
  currentProductId, 
  category, 
  title = 'You May Also Like',
  products = []
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    // Filter products
    let filtered = products;

    // Remove current product if viewing product detail
    if (currentProductId) {
      filtered = filtered.filter(p => p.id !== currentProductId);
    }

    // Filter by category if specified
    if (category) {
      filtered = filtered.filter(p => p.category === category || p.subcategory === category);
    }

    // Sort by rating and featured status
    filtered = filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if (a.rating && b.rating) return b.rating - a.rating;
      return 0;
    });

    // Take top 4
    setRecommendations(filtered.slice(0, 4));
  }, [currentProductId, category, products]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">Handpicked selections based on your interests</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
