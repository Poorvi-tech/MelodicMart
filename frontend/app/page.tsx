'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, TrendingUp, Users, Package, Truck, Shield, Music2, Guitar, Drum, Piano } from 'lucide-react';
import { categories as staticCategories } from '@/data/categories';
import { products as staticProducts } from '@/data/products';
import { testimonials, faqs } from '@/data/static-data';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>(staticCategories);
  // Use static featured products directly instead of fetching from API
  const [featuredProducts, setFeaturedProducts] = useState<any[]>(staticProducts.filter((p) => p.featured));
  const [loading, setLoading] = useState(true);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Fetch real data from backend for categories only
    const fetchData = async () => {
      try {
        // Import categoriesAPI dynamically to avoid server-side issues
        const { categoriesAPI } = await import('@/lib/apiService');
        
        // Fetch categories
        const categoriesData = await categoriesAPI.getAll(true);
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.log('Using static data as fallback');
        // Keep static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4338ca 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slideUp">
              <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg animate-float" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)', boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)' }}>
                ♪♫♬ Premium Music Store
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Handcrafted Premium
                <span className="bg-clip-text text-transparent block mt-2" style={{ backgroundImage: 'linear-gradient(to right, #93c5fd, #a78bfa, #c7d2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Musical Instruments
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 mb-8">
                Authentic instruments handcrafted by skilled artisans. Perfect for classical music, 
                meditation, and professional performances. Discover your perfect sound today.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#featured" 
                  className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110 hover:shadow-2xl animate-pulse-glow"
                >
                  Shop Collection
                </Link>
                <Link 
                  href="#categories" 
                  className="bg-white/90 hover:bg-white backdrop-blur-sm border-2 border-white shadow-xl px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110 text-indigo-900"
                >
                  Learn More
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #93c5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>5000+</div>
                  <div className="text-sm text-blue-100 font-semibold">Musicians</div>
                </div>
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #93c5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>25+</div>
                  <div className="text-sm text-blue-100 font-semibold">Years</div>
                </div>
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                  <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #93c5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>100%</div>
                  <div className="text-sm text-blue-100 font-semibold">Authentic</div>
                </div>
                <div className="text-center animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                  <div className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #93c5fd, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4.9</div>
                  <div className="text-sm text-blue-100 font-semibold flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-300 text-yellow-300 animate-pulse" /> Rating
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-scaleIn">
              <div className="flex items-center justify-center">
                <div className="text-[200px] sm:text-[280px] leading-none animate-float" style={{ filter: 'drop-shadow(0 30px 60px rgba(59, 130, 246, 0.4))' }}>
                  🎸
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 relative" style={{ background: 'linear-gradient(to right, #dbeafe, #ede9fe, #ede9fe)' }}>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-3 hover:scale-105 animate-fadeIn border border-blue-100 relative overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-400 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow relative z-10">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-900">Express Delivery</h3>
              <p className="text-indigo-700 mb-3">Lightning-fast shipping with secure packaging to ensure your instrument arrives safely</p>
              <p className="text-blue-600 font-semibold">2-3 Business Days</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-3 hover:scale-105 animate-fadeIn border border-indigo-100 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-r from-indigo-400 to-purple-400 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow relative z-10">
                <Package className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-900">Free Shipping</h3>
              <p className="text-indigo-700 mb-3">Complimentary nationwide delivery on all orders with tracking</p>
              <p className="text-indigo-600 font-semibold">Orders ₹999+</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-3 hover:scale-105 animate-fadeIn border border-purple-100 relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow relative z-10">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-indigo-900">Premium Craftsmanship</h3>
              <p className="text-indigo-700 mb-3">Meticulously handcrafted instruments using traditional techniques and finest materials</p>
              <p className="text-purple-600 font-semibold">Artisan Made</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 relative" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #ede9fe 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-indigo-900">
              Our <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #6366f1, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Collection</span>
            </h2>
            <p className="text-lg sm:text-xl text-indigo-700 max-w-2xl mx-auto">
              Choose from our carefully curated collection of traditional and modern instruments
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.filter(c => c.featured).map((category, index) => (
              <Link 
                key={category._id || category.id || category.slug} 
                href={`/categories/${category.slug}`}
                className="group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 border-2 border-white animate-fadeIn shadow-lg"
                style={{ animationDelay: `${index * 100}ms`, boxShadow: '0 10px 40px rgba(59, 130, 246, 0.15)' }}
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-indigo-800/40 to-transparent group-hover:from-indigo-900/70 transition-colors"></div>
                  {category.featured && (
                    <div className="absolute top-4 right-4 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}>
                      Popular
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900 via-indigo-800/80 to-transparent p-6 text-white">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-sm mb-3" style={{ color: '#c7d2fe' }}>{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: '#94a3b8' }}>{category.productCount} items</span>
                    <span className="text-white group-hover:translate-x-2 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/categories/string-instruments" 
              className="inline-block text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg transition-all transform hover:scale-110 hover:shadow-2xl animate-pulse-glow" 
              style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1, #818cf8)', boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)' }}
            >
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured" className="py-20 relative" style={{ background: 'linear-gradient(135deg, #dbeafe, #ede9fe, #ede9fe)' }}>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-block text-white px-4 py-2 rounded-full text-sm font-bold mb-4 shadow-lg animate-float" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}>
              Handpicked Favorites
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-indigo-900">
              Featured <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #3b82f6, #6366f1, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Items</span>
            </h2>
            <p className="text-lg sm:text-xl text-indigo-700 max-w-2xl mx-auto">
              Handpicked favorites loved by musicians for their exceptional sound and craftsmanship
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product, index) => (
              <div 
                key={product._id || product.id || product.slug} 
                className="bg-white rounded-2xl overflow-hidden group transition-all transform hover:-translate-y-3 hover:scale-105 border animate-fadeIn shadow-lg relative cursor-pointer" 
                style={{ borderColor: '#c7d2fe', boxShadow: '0 10px 40px rgba(59, 130, 246, 0.1)', animationDelay: `${index * 150}ms` }}
                onClick={() => {
                  const productSlug = product.slug || product._id || product.id;
                  window.location.href = `/products/${productSlug}`;
                }}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="eager"
                  />
                  {product.badge && (
                    <div className="absolute top-3 left-3 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}>
                      {product.badge}
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      SAVE ₹{product.originalPrice - product.price}
                    </div>
                  )}
                </div>
                
                <div className="p-5">
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
                      <div className="text-2xl font-bold text-indigo-700">₹{product.price.toLocaleString()}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-indigo-400 line-through">₹{product.originalPrice.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(product);
                    }}
                    className="w-full text-white py-2 rounded-lg font-bold transition-all transform hover:scale-110 animate-pulse-glow" 
                    style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          

        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-indigo-900">
              Why Musicians <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Choose Us</span>
            </h2>
            <p className="text-lg sm:text-xl text-indigo-600 max-w-2xl mx-auto">
              From authentic craftsmanship to exceptional customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Music2 className="w-8 h-8" />,
                title: 'Authentic Craftsmanship',
                description: 'Each instrument is handcrafted by skilled artisans using traditional techniques passed down through generations',
                badge: '25+ Years Experience'
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Quality Guarantee',
                description: 'Premium material selection, rigorous quality checks, and satisfaction guarantee on every purchase',
                badge: '100% Satisfaction'
              },
              {
                icon: <Truck className="w-8 h-8" />,
                title: 'Fast & Secure Delivery',
                description: 'Quick shipping across India with secure packaging to ensure your instrument arrives in perfect condition',
                badge: 'Pan-India Shipping'
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Expert Support',
                description: 'Professional guidance from our music experts to help you choose the perfect instrument for your skill level',
                badge: 'Personal Consultation'
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: 'Trusted by Musicians',
                description: 'Join 5000+ happy customers who trust us for authentic, high-quality instruments and exceptional service',
                badge: '5000+ Happy Customers'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Flexible Payment',
                description: 'Multiple payment options including COD, online payments, and easy returns for your convenience',
                badge: 'COD Available'
              },
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl hover:shadow-xl transition-all animate-fadeIn border border-blue-100 relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 animate-bounce-slow relative z-10">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-blue-600 mb-2">{item.badge}</div>
                <h3 className="text-xl font-bold mb-3 text-indigo-900">{item.title}</h3>
                <p className="text-indigo-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-block bg-yellow-300 text-indigo-900 px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse">
              Customer Testimonials
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              What Our <span className="text-yellow-300">Customers Say</span>
            </h2>
            <p className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto">
              Read genuine reviews from our valued customers about their shopping experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-2xl hover:bg-white/20 transition-all animate-fadeIn relative overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'fill-yellow-300 text-yellow-300' : 'text-gray-400'}`} />
                  ))}
                </div>
                <p className="text-blue-100 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-blue-200">{testimonial.location}</div>
                  </div>
                </div>
                <div className="text-sm text-blue-300 mt-3">{testimonial.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-indigo-900">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-lg sm:text-xl text-indigo-600">
              Get expert answers to common questions about our handcrafted instruments
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.slice(0, 6).map((faq, index) => (
              <div 
                key={faq.id} 
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl overflow-hidden animate-fadeIn border border-blue-100 relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-white/50 transition-colors relative z-10"
                >
                  <span className="font-semibold text-indigo-900 pr-4">{faq.question}</span>
                  <span className="text-blue-600 text-xl flex-shrink-0">{openFaq === faq.id ? '−' : '+'}</span>
                </button>
                {openFaq === faq.id && (
                  <div className="px-6 pb-4 text-indigo-700 animate-fadeIn">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            READY TO START YOUR MUSICAL JOURNEY?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8">
            Join thousands of satisfied musicians who chose Music Haven for their authentic sound and quality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="#featured" 
              className="bg-yellow-300 hover:bg-yellow-400 text-indigo-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-110 shadow-lg animate-pulse-glow"
            >
              Shop Now
            </Link>
            <Link 
              href="/blogs" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-110"
            >
              Read Blogs & Tutorials
            </Link>
            <Link 
              href="/about" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-110"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}