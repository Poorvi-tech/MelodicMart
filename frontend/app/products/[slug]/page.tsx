'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, Share2, Play, Video, MessageCircle, Check, X, Package, Truck, Shield } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import Link from 'next/link';
import { productsAPI } from '@/lib/apiService';
import { products as staticProducts } from '@/data/products';


export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  // Unwrap the params promise using React.use()
  const unwrappedParams = use<{ slug: string }>(params);
  const slug = unwrappedParams.slug;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  const { addItem: addToCart } = useCartStore();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const apiProduct = await productsAPI.getBySlug(slug);
        if (apiProduct) {
          setProduct(apiProduct);
          // Fetch related products
          const categorySlug = typeof apiProduct.category === 'string' ? apiProduct.category : (apiProduct.category as any)?.slug || (apiProduct.category as any)?.id || '';
          fetchRelatedProducts(categorySlug, apiProduct._id || apiProduct.id);
        } else {
          // Fallback to static data
          const staticProduct = staticProducts.find(p => p.slug === slug) || 
                              staticProducts.find(p => p.id === slug) ||
                              staticProducts[0];
          setProduct(staticProduct);
          // Fetch related products
          if (staticProduct) {
            const categorySlug = typeof staticProduct.category === 'string' ? staticProduct.category : (staticProduct.category as any)?.slug || (staticProduct.category as any)?.id || '';
            fetchRelatedProducts(categorySlug, staticProduct.id);
          }
        }
      } catch (error) {
        console.log('API fetch failed, using static data as fallback');
        // Fallback to static data
        const staticProduct = staticProducts.find(p => p.slug === slug) || 
                            staticProducts.find(p => p.id === slug) ||
                            staticProducts[0];
        setProduct(staticProduct);
        // Fetch related products
        if (staticProduct) {
          const categorySlug = typeof staticProduct.category === 'string' ? staticProduct.category : (staticProduct.category as any)?.slug || (staticProduct.category as any)?.id || '';
          fetchRelatedProducts(categorySlug, staticProduct.id);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category: string, excludeId: string) => {
      try {
        // Try to fetch from API first
        const response = await productsAPI.getAll({ category, limit: 4 });
        if (response && response.products) {
          const filtered = response.products.filter((p: any) => (p._id || p.id) !== excludeId).slice(0, 3);
          setRelatedProducts(filtered);
        } else {
          // Fallback to static data
          const staticRelated = staticProducts
            .filter(p => p.category === category && p.id !== excludeId)
            .slice(0, 3);
          setRelatedProducts(staticRelated);
        }
      } catch (error) {
        console.log('API fetch failed for related products, using static data as fallback');
        // Fallback to static data
        const staticRelated = staticProducts
          .filter(p => p.category === category && p.id !== excludeId)
          .slice(0, 3);
        setRelatedProducts(staticRelated);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      // Show success message
      alert(`${product.name} added to cart!`);
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      toggleWishlist(product);
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
    } else {
      const audio = new Audio(audioUrl);
      audio.play();
      setCurrentAudio(audio);
      setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit to your API
    console.log('Review submitted:', reviewForm);
    alert('Thank you for your review!');
    setShowReviewForm(false);
    setReviewForm({ rating: 5, title: '', comment: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Link 
            href="/categories/string-instruments"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id || product._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-purple-600 hover:text-purple-800">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/categories/${typeof product.category === 'string' ? product.category : product.category?.slug || product.category?.id}`} className="text-purple-600 hover:text-purple-800">
            {typeof product.category === 'string' ? product.category.replace('-', ' ') : product.category?.name || 'Category'}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link href={`/categories/${typeof product.category === 'string' ? product.category : product.category?.slug || product.category?.id}?subcategory=${product.subcategory}`} className="text-purple-600 hover:text-purple-800">
            {product.subcategory}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{product.name}</span>
        </nav>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square relative rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="eager"
                />
              </div>
              
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating!) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                        <span className="text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
                      </div>
                      
                      {product.badge && (
                        <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-full transition-colors ${
                      inWishlist 
                        ? 'text-red-500 bg-red-50' 
                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-6 h-6 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-purple-600">₹{product.price.toLocaleString()}</div>
                {product.originalPrice && (
                  <div className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</div>
                )}
                {product.originalPrice && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                {product.inStock ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">In Stock - Ready to ship</span>
                  </>
                ) : (
                  <>
                    <X className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium">{value as string}</span>
                  </div>
                ))}
              </div>

              {/* Audio & Video */}
              {(product.audioSamples || product.videoUrl) && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">Media</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.audioSamples && product.audioSamples.map((audio: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => handlePlayAudio(audio.url)}
                        className="flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        <span>{audio.title}</span>
                        <span className="text-xs text-purple-500">({audio.duration})</span>
                      </button>
                    ))}
                    
                    {product.videoUrl && (
                      <button className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors">
                        <Video className="w-4 h-4" />
                        <span>Watch Video</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* User Photos */}
              {product.userPhotos && product.userPhotos.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">User Photos</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {product.userPhotos.map((photo: any, index: number) => (
                      <div key={index} className="flex-shrink-0 w-32">
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={photo.url}
                            alt={photo.caption}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1 truncate">{photo.user}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Shipping & Returns
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex flex-col items-center text-center">
                    <Package className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="font-medium">Free Shipping</span>
                    <span className="text-gray-600">On orders over ₹500</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="font-medium">Fast Delivery</span>
                    <span className="text-gray-600">2-4 business days</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-6 h-6 text-blue-600 mb-1" />
                    <span className="font-medium">7-Day Returns</span>
                    <span className="text-gray-600">No questions asked</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                    product.inStock
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-2xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                
                <button className="p-4 bg-white border-2 border-gray-300 hover:border-purple-600 rounded-xl transition-colors">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              

            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl shadow-xl mt-8 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl transition-all"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-purple-50 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Share Your Experience</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({...reviewForm, rating: star})}
                        className="text-2xl"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            star <= reviewForm.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({...reviewForm, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Give your review a title"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Your Review</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Share your experience with this product"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-2xl transition-all"
                  >
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {mockReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.user.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-gray-900">{review.user}</h4>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < review.rating 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{review.title}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl mt-8 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div 
                  key={relatedProduct._id || relatedProduct.id} 
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    const relatedSlug = relatedProduct.slug || relatedProduct._id || relatedProduct.id;
                    window.location.href = `/products/${relatedSlug}`;
                  }}
                >
                  <div className="relative aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600">{relatedProduct.rating || 'N/A'}</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">₹{relatedProduct.price.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: "Amit Kumar",
    rating: 5,
    title: "Outstanding Quality!",
    comment: "The sound quality is exceptional and the build is very solid. Worth every penny!",
    date: "2024-01-20",
    verified: true
  },
  {
    id: 2,
    user: "Priya Patel",
    rating: 4,
    title: "Great for beginners",
    comment: "Easy to play and sounds great. Only minor issue is the tuning pegs could be better.",
    date: "2024-01-15",
    verified: true
  },
  {
    id: 3,
    user: "Rajesh Mehta",
    rating: 5,
    title: "Professional grade instrument",
    comment: "Used this for my concert last week. The audience loved the sound!",
    date: "2024-01-10",
    verified: true
  }
];