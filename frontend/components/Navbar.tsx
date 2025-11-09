'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Music, User, LogOut, Heart, Scale, Package, MessageCircle, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react';
import { useCartStore, useWishlistStore, useCompareStore } from '@/lib/store';
import { categories } from '@/data/categories';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientTotalItems, setClientTotalItems] = useState(0);
  const [clientWishlistCount, setClientWishlistCount] = useState(0);
  const [clientCompareCount, setClientCompareCount] = useState(0);
  const router = useRouter();

  // Get store selectors
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const wishlistItems = useWishlistStore((state) => state.items);
  const compareItems = useCompareStore((state) => state.items);

  // Initialize client-side values after mount
  useEffect(() => {
    setClientTotalItems(getTotalItems());
    setClientWishlistCount(wishlistItems.length);
    setClientCompareCount(compareItems.length);
    
    // Set up store subscriptions
    const unsubscribeCart = useCartStore.subscribe((state) => {
      setClientTotalItems(state.getTotalItems());
    });
    
    const unsubscribeWishlist = useWishlistStore.subscribe((state) => {
      setClientWishlistCount(state.items.length);
    });
    
    const unsubscribeCompare = useCompareStore.subscribe((state) => {
      setClientCompareCount(state.items.length);
    });
    
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      const parsedUser = JSON.parse(userData);
      
      // Fetch unread messages for admin
      if (parsedUser.role === 'admin') {
        fetchUnreadMessages();
        // Poll every 30 seconds for new messages
        const interval = setInterval(fetchUnreadMessages, 30000);
        return () => {
          clearInterval(interval);
          unsubscribeCart();
          unsubscribeWishlist();
          unsubscribeCompare();
        };
      }
    }
    
    // Cleanup function
    return () => {
      unsubscribeCart();
      unsubscribeWishlist();
      unsubscribeCompare();
    };
  }, [getTotalItems, wishlistItems.length, compareItems.length]);

  const fetchUnreadMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if token exists
      if (!token) {
        console.warn('No token found for admin chat request');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        console.warn('Unauthorized access to admin chat API');
        // Clear local storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      // Handle 403 Forbidden (not admin)
      if (response.status === 403) {
        console.warn('Access forbidden - user is not admin');
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setUnreadMessages(data.totalUnread || 0);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
    router.refresh();
    
    // Increment interaction counter
    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
      (window as any).incrementInteraction();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      
      // Increment interaction counter
      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
        (window as any).incrementInteraction();
      }
    }
  };

  return (
    <nav className="text-white sticky top-0 z-50 shadow-2xl backdrop-blur-md bg-gradient-to-br from-blue-50 to-indigo-100 shadow-indigo-200/30">
      {/* Top Bar */}
      <div className="py-2 px-4 text-sm bg-gradient-to-r from-blue-400 to-indigo-400 shadow-lg shadow-indigo-300/30 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white font-semibold text-center sm:text-left animate-gentlePulse">✨ Free Shipping on orders above ₹999 | COD Available</p>
          <div className="flex gap-4 text-white">
            <Link 
              href="/contact" 
              className="hover:text-yellow-200 transition hover:scale-110 animate-sway"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                  (window as any).incrementInteraction();
                }
              }}
            >
              Contact Us
            </Link>
            <Link 
              href="/about" 
              className="hover:text-yellow-200 transition hover:scale-110 animate-sway"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                  (window as any).incrementInteraction();
                }
              }}
            >
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-4 relative">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold group"
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                (window as any).incrementInteraction();
              }
            }}
          >
            <Music className="w-8 h-8 text-indigo-600 group-hover:scale-110 transition-transform animate-bounce-slow" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Music Haven
            </span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search instruments..."
                className="w-full px-4 py-2 pl-10 rounded-full bg-white/80 border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-blue-300 text-indigo-900 placeholder-indigo-300 transition-all hover:bg-white/90 shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-indigo-400" />
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-110"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                  (window as any).incrementInteraction();
                }
              }}
            >
              Home
            </Link>
            
            {/* Only show shopping features to non-admin users */}
            {user?.role !== 'admin' && (
              <>
                {/* Categories Dropdown */}
                <div 
                  className="relative"
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onMouseLeave={() => setIsCategoriesOpen(false)}
                >
                  <button className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-1 hover:scale-110">
                    Categories
                    <span className="text-xs">▼</span>
                  </button>
                  
                  {isCategoriesOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-indigo-900 rounded-xl shadow-xl py-2 w-64 animate-fadeIn border border-indigo-100">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          className="block px-4 py-2 hover:text-blue-600 transition hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105"
                          onClick={() => {
                            if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                              (window as any).incrementInteraction();
                            }
                          }}
                        >
                          {category.name}
                          <span className="text-xs text-indigo-400 ml-2">({category.productCount})</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link 
                  href="/blogs" 
                  className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-110"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  Blogs
                </Link>
                <Link 
                  href="/gallery" 
                  className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-110"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  Gallery
                </Link>
                <Link 
                  href="/reviews" 
                  className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-110"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  Reviews
                </Link>
              </>
            )}
            <Link 
              href="/about" 
              className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-110"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                  (window as any).incrementInteraction();
                }
              }}
            >
              About
            </Link>
            
            {/* Explore Button - Added for interactive components */}
            <Link 
              href="/explore" 
              className="text-indigo-800 hover:text-purple-600 transition font-medium hover:scale-110 flex items-center gap-1"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                  (window as any).incrementInteraction();
                }
              }}
            >
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                Explore
              </span>
            </Link>
            
            {/* Show Contact link only to non-admin users */}
            {user?.role !== 'admin' && (
              <Link 
                href="/contact" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-110"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Contact
              </Link>
            )}
            
            {/* Admin-specific menu items */}
            {user?.role === 'admin' && (
              <>
                <Link 
                  href="/admin" 
                  className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-1 hover:scale-110"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link 
                  href="/admin/chats" 
                  className="relative text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-1 hover:scale-110"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Messages
                  {unreadMessages > 0 && (
                    <span className="bg-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
                <Link 
                  href="/admin?tab=payments" 
                  className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-1 hover:scale-110"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  <DollarSign className="w-4 h-4" />
                  Payments
                </Link>
              </>
            )}
            
            {/* Show shopping features only to non-admin users */}
            {user?.role !== 'admin' && (
              <>
                {/* Wishlist */}
                <Link 
                  href="/wishlist" 
                  className="relative text-indigo-800 hover:text-pink-500 transition group"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  <Heart className="w-6 h-6 group-hover:scale-110 transition-transform text-pink-500 hover:animate-pulse" />
                  {clientWishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-400 to-rose-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {clientWishlistCount}
                    </span>
                  )}
                </Link>

                {/* Compare */}
                <Link 
                  href="/compare" 
                  className="relative text-indigo-800 hover:text-blue-500 transition group"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  <Scale className="w-6 h-6 group-hover:scale-110 transition-transform hover:animate-pulse" />
                  {clientCompareCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                      {clientCompareCount}
                    </span>
                  )}
                </Link>
                
                {/* Cart */}
                <Link 
                  href="/cart" 
                  className="relative text-indigo-800 hover:text-indigo-600 transition group"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform hover:animate-pulse" />
                  {clientTotalItems > 0 && (
                    <span className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse bg-gradient-to-r from-indigo-500 to-blue-500">
                      {clientTotalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Menu */}
            {user ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-indigo-800 hover:text-blue-600 transition hover:scale-110">
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user.name}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white text-indigo-900 rounded-xl shadow-xl py-2 w-48 animate-fadeIn border border-indigo-100">
                    <div className="px-4 py-2 border-b border-indigo-100">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-indigo-500">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full mt-1 inline-block">Seller</span>
                      )}
                    </div>
                    {user.role !== 'admin' && (
                      <>
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 hover:bg-blue-50 transition hover:scale-105"
                          onClick={() => {
                            if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                              (window as any).incrementInteraction();
                            }
                          }}
                        >
                          My Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block px-4 py-2 hover:bg-blue-50 transition hover:scale-105"
                          onClick={() => {
                            if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                              (window as any).incrementInteraction();
                            }
                          }}
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition flex items-center gap-2 hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-110 bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:animate-pulse shadow-lg"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                (window as any).incrementInteraction();
              }
            }}
            className="lg:hidden text-indigo-900 hover:text-blue-600 transition hover:scale-110"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search instruments..."
              className="w-full px-4 py-2 pl-10 rounded-full bg-white border-2 border-indigo-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-indigo-900 placeholder-indigo-400 shadow-lg transition-all hover:shadow-xl"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-indigo-400" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 pt-4 animate-fadeIn border-t border-indigo-200">
            <div className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Home
              </Link>
              
              {/* Mobile Categories */}
              <div>
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-1 w-full hover:scale-105"
                >
                  Categories
                  <span className="text-xs">{isCategoriesOpen ? '▲' : '▼'}</span>
                </button>
                
                {isCategoriesOpen && (
                  <div className="ml-4 mt-2 space-y-2 animate-slide-in-left">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="block text-indigo-700 hover:text-blue-600 transition hover:scale-105"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                            (window as any).incrementInteraction();
                          }
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                href="/blogs" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Blogs
              </Link>
              <Link 
                href="/gallery" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Gallery
              </Link>
              <Link 
                href="/reviews" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Reviews
              </Link>
              <Link 
                href="/about" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                About
              </Link>
              <Link 
                href="/explore" 
                className="text-indigo-800 hover:text-purple-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-sm">
                  Explore Interactive Features
                </span>
              </Link>
              <Link 
                href="/contact" 
                className="text-indigo-800 hover:text-blue-600 transition font-medium hover:scale-105"
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                    (window as any).incrementInteraction();
                  }
                }}
              >
                Contact
              </Link>
              
              {/* Admin-specific menu items for mobile */}
              {user?.role === 'admin' && (
                <>
                  <Link 
                    href="/admin" 
                    className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-2 hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                        (window as any).incrementInteraction();
                      }
                    }}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link 
                    href="/admin/chats" 
                    className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-2 hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                        (window as any).incrementInteraction();
                      }
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Messages
                  </Link>
                  <Link 
                    href="/admin?tab=payments" 
                    className="text-indigo-800 hover:text-blue-600 transition font-medium flex items-center gap-2 hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                        (window as any).incrementInteraction();
                      }
                    }}
                  >
                    <DollarSign className="w-4 h-4" />
                    Payments
                  </Link>
                </>
              )}
              
              {/* Show shopping features only to non-admin users on mobile */}
              {user?.role !== 'admin' && (
                <>
                  {/* Mobile Cart */}
                  <Link 
                    href="/cart" 
                    className="flex items-center gap-2 text-indigo-800 hover:text-indigo-600 transition font-medium hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                        (window as any).incrementInteraction();
                      }
                    }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Cart {clientTotalItems > 0 && `(${clientTotalItems})`}
                  </Link>

                  {/* Mobile Wishlist */}
                  <Link 
                    href="/wishlist" 
                    className="flex items-center gap-2 text-indigo-800 hover:text-pink-500 transition font-medium hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                        (window as any).incrementInteraction();
                      }
                    }}
                  >
                    <Heart className="w-5 h-5 text-pink-500" />
                    Wishlist {clientWishlistCount > 0 && `(${clientWishlistCount})`}
                  </Link>

                  {/* Mobile Compare */}
                  <Link 
                    href="/compare" 
                    className="flex items-center gap-2 text-indigo-800 hover:text-blue-500 transition font-medium hover:scale-105"
                    onClick={() => {
                      if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                        (window as any).incrementInteraction();
                      }
                    }}
                  >
                    <Scale className="w-5 h-5" />
                    Compare {clientCompareCount > 0 && `(${clientCompareCount})`}
                  </Link>
                </>
              )}

              {/* Mobile User Menu */}
              {user ? (
                <>
                  <div className="pt-2 border-t border-indigo-200">
                    <p className="text-sm font-semibold mb-2 text-indigo-800">👤 {user.name}</p>
                    {user.role !== 'admin' && (
                      <>
                        <Link 
                          href="/profile" 
                          className="block py-1 text-indigo-700 hover:text-blue-600 transition ml-4 hover:scale-105"
                          onClick={() => {
                            if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                              (window as any).incrementInteraction();
                            }
                          }}
                        >
                          My Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block py-1 text-indigo-700 hover:text-blue-600 transition ml-4 hover:scale-105"
                          onClick={() => {
                            if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                              (window as any).incrementInteraction();
                            }
                          }}
                        >
                          My Orders
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="block py-1 text-indigo-700 hover:text-blue-600 transition ml-4 text-yellow-600 hover:scale-105"
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                            (window as any).incrementInteraction();
                          }
                        }}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 py-1 text-red-600 hover:text-red-700 transition ml-4 mt-2 hover:scale-105"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="px-4 py-2 rounded-full font-semibold transition-all text-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:animate-pulse hover:scale-105 shadow-lg"
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).incrementInteraction) {
                      (window as any).incrementInteraction();
                    }
                  }}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}