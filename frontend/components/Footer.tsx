'use client';

import Link from 'next/link';
import { Music, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-white relative" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' }}>
      {/* Floating Bubbles in Footer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-blue-300 opacity-20 animate-bubbleFloat" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-6 h-6 rounded-full bg-indigo-300 opacity-30 animate-bubbleFloat" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-10 h-10 rounded-full bg-purple-300 opacity-25 animate-bubbleFloat" style={{ animationDelay: '4s' }}></div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="animate-fadeIn">
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-8 h-8 text-blue-300 animate-bounce-slow" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Music Haven
              </h3>
            </div>
            <p className="text-indigo-100 mb-4">
              Your trusted destination for authentic musical instruments. From traditional to modern, 
              we bring quality and craftsmanship to every musician.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-400 hover:text-white transition hover:scale-110 animate-sway">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-pink-400 hover:text-white transition hover:scale-110 animate-sway">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition hover:scale-110 animate-sway">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition hover:scale-110 animate-sway">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-slide-in-left">
            <h4 className="text-xl font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-indigo-100">
              <li><Link href="/" className="hover:text-blue-300 transition hover:scale-105">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-300 transition hover:scale-105">Instrument Gallery</Link></li>
              <li><Link href="/reviews" className="hover:text-blue-300 transition hover:scale-105">Customer Reviews</Link></li>
              <li><Link href="/blogs" className="hover:text-blue-300 transition hover:scale-105">Blogs & Tutorials</Link></li>
              <li><Link href="/categories/string-instruments" className="hover:text-blue-300 transition hover:scale-105">String Instruments</Link></li>
              <li><Link href="/categories/wind-instruments" className="hover:text-blue-300 transition hover:scale-105">Wind Instruments</Link></li>
              <li><Link href="/categories/percussion-instruments" className="hover:text-blue-300 transition hover:scale-105">Percussion</Link></li>
              <li><Link href="/categories/keyboard-instruments" className="hover:text-blue-300 transition hover:scale-105">Keyboard</Link></li>
              <li><Link href="/about" className="hover:text-blue-300 transition hover:scale-105">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-300 transition hover:scale-105">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="animate-slide-in-right">
            <h4 className="text-xl font-bold mb-4 text-white">Customer Service</h4>
            <ul className="space-y-2 text-indigo-100">
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">Return & Exchange</Link></li>
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">Payment Methods</Link></li>
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">Track Order</Link></li>
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">FAQ</Link></li>
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:text-blue-300 transition hover:scale-105">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fadeIn">
            <h4 className="text-xl font-bold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-3 text-indigo-100">
              <li className="flex items-start gap-3 hover:scale-105 transition">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-blue-300" />
                <span>123 Music Street, Melody District, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-3 hover:scale-105 transition">
                <Phone className="w-5 h-5 flex-shrink-0 text-blue-300" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 hover:scale-105 transition">
                <Mail className="w-5 h-5 flex-shrink-0 text-blue-300" />
                <span>support@musichaven.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h5 className="font-semibold mb-2 text-white">Business Hours</h5>
              <p className="text-indigo-200 text-sm">Monday - Saturday: 9:00 AM - 8:00 PM</p>
              <p className="text-indigo-200 text-sm">Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative" style={{ borderTop: '1px solid #4f46e5' }}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-indigo-200 text-sm">
            <p>&copy; 2025 Music Haven. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="hover:text-blue-300 transition hover:scale-105">Terms of Service</Link>
              <Link href="#" className="hover:text-blue-300 transition hover:scale-105">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-300 transition hover:scale-105">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Security Badges */}
      <div className="py-4 relative" style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6 text-white text-xs font-semibold">
            <span className="flex items-center gap-2 hover:scale-105 transition animate-gentlePulse">
              <span className="w-2 h-2 bg-green-300 rounded-full"></span>
              Secure Payment
            </span>
            <span>|</span>
            <span className="hover:scale-105 transition">💳 Cards Accepted</span>
            <span>|</span>
            <span className="hover:scale-105 transition">📱 UPI Enabled</span>
            <span>|</span>
            <span className="hover:scale-105 transition">💰 Cash on Delivery</span>
            <span>|</span>
            <span className="hover:scale-105 transition">🔒 100% Secure Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  );
}