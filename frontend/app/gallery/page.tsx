'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { galleryItems, galleryCategories } from '@/data/gallery';
import { Filter, Grid3x3, LayoutGrid, Search, Eye, ShoppingCart, Heart, X } from 'lucide-react';
import { useCartStore } from '@/lib/store';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [selectedImage, setSelectedImage] = useState<typeof galleryItems[0] | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  const filteredItems = galleryItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl animate-bounce-slow">🎸</div>
          <div className="absolute bottom-10 right-10 text-9xl animate-float">🎹</div>
          <div className="absolute top-1/2 left-1/2 text-7xl animate-pulse">🎵</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg" style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)' }}>
              📸 Visual Gallery
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-scaleIn">
              Instrument <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #818cf8, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Gallery</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Explore our stunning collection of musical instruments through high-quality images
            </p>
            
            {/* Search & View Toggle */}
            <div className="max-w-3xl mx-auto flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search instruments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-full bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 shadow-2xl text-lg"
                  style={{ '--tw-ring-color': '#4f46e5' } as any}
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-white/95 rounded-full p-2 shadow-2xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-full transition-all ${viewMode === 'grid' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={viewMode === 'grid' ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-3 rounded-full transition-all ${viewMode === 'masonry' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                  style={viewMode === 'masonry' ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 sticky top-16 z-40 backdrop-blur-lg bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-gray-900">Filter by Category:</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:shadow-xl'
                }`}
                style={selectedCategory === category.id ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
              >
                <span className="text-xl">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-6 animate-bounce-slow">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No instruments found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredItems.length} {filteredItems.length === 1 ? 'Instrument' : 'Instruments'} Found
                </h2>
                <p className="text-gray-600">Click any image to view in full screen</p>
              </div>
              
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
              }>
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl bg-white transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 animate-fadeIn"
                    style={{ 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      animationDelay: `${index * 50}ms`,
                      breakInside: viewMode === 'masonry' ? 'avoid' : 'auto'
                    }}
                  >
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedImage(item)}>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        loading="eager"
                      />
                      
                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedImage(item);
                            }}
                            className="p-3 bg-white/90 rounded-full hover:bg-white transition-all transform hover:scale-110"
                          >
                            <Eye className="w-5 h-5 text-gray-900" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.price) {
                                addItem({ 
                                  id: item.id, 
                                  name: item.name, 
                                  price: item.price, 
                                  description: item.description,
                                  category: item.category,
                                  subcategory: item.category,
                                  images: [item.imageUrl],
                                  inStock: true
                                });
                              }
                            }}
                            className="p-3 rounded-full hover:bg-white transition-all transform hover:scale-110"
                            style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)' }}
                          >
                            <ShoppingCart className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {item.featured && (
                        <div className="absolute top-3 right-3 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)' }}>
                          ⭐ Featured
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="text-xs font-semibold mb-2" style={{ color: '#6366f1' }}>
                        {item.category}
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      
                      {item.price && (
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold" style={{ color: '#4f46e5' }}>
                            ₹{item.price.toLocaleString()}
                          </div>
                          <button
                            onClick={() => addItem({ 
                              id: item.id, 
                              name: item.name, 
                              price: item.price || 0, 
                              description: item.description,
                              category: item.category,
                              subcategory: item.category,
                              images: [item.imageUrl],
                              inStock: true
                            })}
                            className="text-white p-2 rounded-lg transition-all transform hover:scale-110"
                            style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)' }}
                          >
                            <ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Fullscreen Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-square md:aspect-video overflow-hidden rounded-2xl">
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                fill
                className="object-contain"
                sizes="100vw"
                loading="eager"
              />
            </div>
            
            <div className="mt-6 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">{selectedImage.name}</h2>
              <p className="text-gray-300 mb-4">{selectedImage.description}</p>
              {selectedImage.price && (
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl font-bold" style={{ color: '#818cf8' }}>
                    ₹{selectedImage.price.toLocaleString()}
                  </div>
                  <button
                    onClick={() => {
                      addItem({ 
                        id: selectedImage.id, 
                        name: selectedImage.name, 
                        price: selectedImage.price || 0, 
                        description: selectedImage.description,
                        category: selectedImage.category,
                        subcategory: selectedImage.category,
                        images: [selectedImage.imageUrl],
                        inStock: true
                      });
                      setSelectedImage(null);
                    }}
                    className="text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-110 flex items-center gap-2"
                    style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)' }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 text-9xl animate-float">🎼</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-bounce-slow">🎧</div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-scaleIn">
            Found Your Perfect Instrument?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Browse our full collection and start your musical journey today
          </p>
          <Link
            href="/"
            className="inline-block text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110"
            style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)' }}
          >
            Shop All Instruments 🎵
          </Link>
        </div>
      </section>
    </div>
  );
}
