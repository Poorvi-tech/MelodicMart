'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { reviews } from '@/data/reviews';
import { Star, ThumbsUp, CheckCircle, Calendar, MapPin, Image as ImageIcon, Video, FileText, Filter } from 'lucide-react';

export default function ReviewsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'text' | 'image' | 'video'>('all');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');

  const filteredReviews = reviews.filter(review => {
    const matchesType = selectedFilter === 'all' || review.reviewType === selectedFilter;
    const matchesRating = selectedRating === 'all' || review.rating === selectedRating;
    return matchesType && matchesRating;
  });

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }));

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-9xl animate-bounce-slow">⭐</div>
          <div className="absolute bottom-10 right-10 text-9xl animate-float">💬</div>
          <div className="absolute top-1/2 left-1/3 text-7xl animate-pulse">❤️</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg" style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)', boxShadow: '0 10px 30px rgba(79, 70, 229, 0.4)' }}>
              ⭐ Customer Reviews
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-scaleIn">
              What Our <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #818cf8, #a78bfa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Musicians</span> Say
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Real reviews from real musicians who love their instruments
            </p>
            
            {/* Rating Summary */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">{averageRating}</div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-gray-300">Based on {totalReviews} reviews</div>
              </div>
              
              <div className="w-px h-24 bg-white/20"></div>
              
              <div className="space-y-2">
                {ratingDistribution.map((dist) => (
                  <div key={dist.rating} className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[...Array(dist.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${dist.percentage}%` }}></div>
                    </div>
                    <span className="text-gray-300 text-sm w-12">{dist.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 sticky top-16 z-40 backdrop-blur-lg bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-gray-900">Filter Reviews:</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Type Filter */}
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                selectedFilter === 'all' ? 'text-white' : 'bg-white text-gray-700 hover:shadow-xl'
              }`}
              style={selectedFilter === 'all' ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
            >
              All Reviews
            </button>
            <button
              onClick={() => setSelectedFilter('text')}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                selectedFilter === 'text' ? 'text-white' : 'bg-white text-gray-700 hover:shadow-xl'
              }`}
              style={selectedFilter === 'text' ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
            >
              <FileText className="w-4 h-4" />
              Text
            </button>
            <button
              onClick={() => setSelectedFilter('image')}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                selectedFilter === 'image' ? 'text-white' : 'bg-white text-gray-700 hover:shadow-xl'
              }`}
              style={selectedFilter === 'image' ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
            >
              <ImageIcon className="w-4 h-4" />
              Photos
            </button>
            <button
              onClick={() => setSelectedFilter('video')}
              className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                selectedFilter === 'video' ? 'text-white' : 'bg-white text-gray-700 hover:shadow-xl'
              }`}
              style={selectedFilter === 'video' ? { background: 'linear-gradient(to right, #4f46e5, #6366f1)' } : {}}
            >
              <Video className="w-4 h-4" />
              Videos
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-6 animate-bounce-slow">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No reviews found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
                </h2>
                <p className="text-gray-600">Verified customer experiences</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredReviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn"
                    style={{ 
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Customer Info */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={review.customerImage}
                            alt={review.customerName}
                            fill
                            className="object-cover"
                            sizes="48px"
                            loading="eager"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                            {review.verified && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            {review.location}
                          </div>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Product Name */}
                    <div className="mb-3">
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'linear-gradient(to right, #eef2ff, #e0e7ff)', color: '#4f46e5' }}>
                        {review.productName}
                      </div>
                    </div>

                    {/* Review Content */}
                    <p className="text-gray-700 mb-4 leading-relaxed">{review.reviewText}</p>

                    {/* Images */}
                    {review.images && review.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {review.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                            <Image
                              src={img}
                              alt={`Review image ${idx + 1}`}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                              sizes="(max-width: 768px) 50vw, 25vw"
                              loading="eager"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Video */}
                    {review.videoUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden" style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                        <iframe
                          width="100%"
                          height="250"
                          src={review.videoUrl}
                          title="Customer review video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full"
                        ></iframe>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 text-9xl animate-float">✍️</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-bounce-slow">📝</div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-scaleIn">
            Share Your Experience!
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Bought an instrument from us? We'd love to hear your thoughts!
          </p>
          <Link
            href="/"
            className="inline-block text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110"
            style={{ background: 'linear-gradient(to right, #4f46e5, #6366f1)', boxShadow: '0 10px 40px rgba(79, 70, 229, 0.4)' }}
          >
            Write a Review ✨
          </Link>
        </div>
      </section>
    </div>
  );
}
