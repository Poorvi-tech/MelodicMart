'use client';

import { useState } from 'react';
import { Bell, X } from 'lucide-react';

interface StockAlertButtonProps {
  productId: string;
  productName: string;
  inStock: boolean;
}

export default function StockAlertButton({ productId, productName, inStock }: StockAlertButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (inStock) {
    return null;
  }

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Get user from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login to subscribe to stock alerts');
        setShowModal(false);
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stock-alerts/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSubscribed(true);
        alert('Successfully subscribed! We will notify you when this product is back in stock.');
        setShowModal(false);
      } else {
        alert(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error subscribing to stock alert:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <Bell className="w-5 h-5" />
        {isSubscribed ? 'Alert Set!' : 'Notify When Available'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">Stock Alert</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-2">
                Get notified when <span className="font-bold text-purple-600">{productName}</span> is back in stock!
              </p>
              <p className="text-sm text-gray-500">
                We'll send you an email as soon as this product becomes available.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-xl transition disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
