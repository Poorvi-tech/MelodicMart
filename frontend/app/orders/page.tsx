'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { orderAPI } from '@/lib/apiService';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await orderAPI.getAll();
        setOrders(ordersData);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
        // Redirect to login if unauthorized
        if (err.message === 'API request failed') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'Shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'Processing':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-full font-semibold text-white transition-all transform hover:scale-105"
              style={{ background: 'linear-gradient(to right, #667eea, #764ba2)' }}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-sm opacity-90 mb-1">Order ID</div>
                      <div className="font-bold text-lg">#{order._id.slice(-8).toUpperCase()}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90 mb-1">Date</div>
                      <div className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm opacity-90 mb-1">Total</div>
                      <div className="font-bold text-xl">₹{order.totalPrice.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.orderStatus)} font-semibold`}>
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.orderItems.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-purple-600">₹{item.price.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">₹{(item.price * item.quantity).toLocaleString()} total</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-gray-700">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                      <div className="font-semibold">{order.paymentMethod}</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Payment Status</div>
                      <div className={`font-semibold ${order.isPaid ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.isPaid ? '✓ Paid' : 'Pending'}
                      </div>
                    </div>
                    {order.trackingNumber && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Tracking Number</div>
                        <div className="font-semibold">{order.trackingNumber}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}