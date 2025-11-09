'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts, blogCategories } from '@/data/blogs';
import { BookOpen, Youtube, Globe, Clock, Calendar, ExternalLink, Filter } from 'lucide-react';

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBlogs = blogPosts.filter(blog => {
    const matchesCategory = selectedCategory === 'all' || blog.category.toLowerCase() === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         blog.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryImage = (category: string) => {
    switch(category) {
      case 'Guitar': return 'https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=800&h=600&fit=crop';
      case 'Percussion': return 'https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=800&h=600&fit=crop';
      case 'Wind': return 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop';
      case 'Keyboard': return 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&h=600&fit=crop';
      case 'String': return 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&h=600&fit=crop';
      case 'Traditional': return 'https://images.unsplash.com/photo-1460036521480-ff49c08c2781?w=800&h=600&fit=crop';
      case 'General': return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop';
      default: return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop';
    }
  };

  const getSourceIcon = (source: string) => {
    switch(source) {
      case 'YouTube': return <Youtube className="w-5 h-5" />;
      case 'Blog': return <BookOpen className="w-5 h-5" />;
      case 'Article': return <Globe className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch(source) {
      case 'YouTube': return 'from-red-500 to-red-600';
      case 'Blog': return 'from-blue-500 to-blue-600';
      case 'Article': return 'from-green-500 to-green-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)' }}>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, #00bcd4 0%, #26c6da 50%, #4dd0e1 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-9xl animate-bounce-slow">📚</div>
          <div className="absolute bottom-10 right-10 text-9xl animate-float">🎵</div>
          <div className="absolute top-1/2 left-1/3 text-7xl animate-pulse">✨</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg animate-pulse" style={{ background: 'linear-gradient(to right, #ff6f00, #ff8f00)' }}>
              📖 Learn & Explore
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-scaleIn">
              Music <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #ff6f00, #ff8f00, #ffa726)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Blogs</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover guides, tutorials, and insights about musical instruments from YouTube, blogs, and expert articles
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs, tutorials, guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 rounded-full bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 shadow-2xl text-lg"
                  style={{ '--tw-ring-color': '#ff6f00' } as any}
                />
                <BookOpen className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 sticky top-16 z-40 backdrop-blur-lg" style={{ background: 'rgba(224, 247, 250, 0.95)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-gray-900">Filter by Category:</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {blogCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:shadow-xl'
                }`}
                style={selectedCategory === category.id ? { background: 'linear-gradient(to right, #00897b, #00acc1)' } : {}}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-9xl mb-6 animate-bounce-slow">🔍</div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No blogs found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Found {filteredBlogs.length} {filteredBlogs.length === 1 ? 'Blog' : 'Blogs'}
                </h2>
                <p className="text-gray-600">Click any card to explore the full content</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((blog, index) => (
                  <a
                    key={blog.id}
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 hover:shadow-2xl border-2 animate-fadeIn"
                    style={{ 
                      borderColor: '#b2ebf2',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Image/Icon Section */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={getCategoryImage(blog.category)}
                        alt={blog.category}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="eager"
                      />
                      
                      {/* Source Badge */}
                      <div className={`absolute top-3 right-3 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 bg-gradient-to-r ${getSourceColor(blog.source)}`}>
                        {getSourceIcon(blog.source)}
                        {blog.source}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg" style={{ background: 'linear-gradient(to right, #ff6f00, #ff8f00)' }}>
                        {blog.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                        {blog.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        {blog.readTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {blog.readTime}
                          </div>
                        )}
                      </div>

                      {/* Read More Button */}
                      <div className="flex items-center justify-between">
                        <span className="text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 group-hover:gap-3 transition-all" style={{ background: 'linear-gradient(to right, #00897b, #00acc1)' }}>
                          Explore Now
                          <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(to right, #00897b, #00acc1, #00bcd4)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 text-9xl animate-float">🎼</div>
          <div className="absolute bottom-10 left-10 text-9xl animate-bounce-slow">🎧</div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-scaleIn">
            Ready to Start Your Musical Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Explore our collection of premium instruments and start making music today
          </p>
          <Link
            href="/"
            className="inline-block text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110 shadow-2xl animate-pulse-glow"
            style={{ background: 'linear-gradient(to right, #ff6f00, #ff8f00)' }}
          >
            Browse Instruments 🎵
          </Link>
        </div>
      </section>
    </div>
  );
}
