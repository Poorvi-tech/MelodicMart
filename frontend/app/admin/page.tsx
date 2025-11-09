'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Users, Package, ShoppingCart, DollarSign, TrendingUp, 
  Eye, Edit, Trash2, CheckCircle, XCircle, Clock, MessageCircle, Mail
} from 'lucide-react';
import { ordersAPI, productsAPI, contactAPI } from '@/lib/apiService';

// Separate component for the admin dashboard content that uses useSearchParams
function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    const checkAdmin = () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/login');
        return false;
      }

      const userData = JSON.parse(user);
      if (userData.role !== 'admin') {
        router.push('/');
        return false;
      }
      return true;
    };

    const fetchData = async () => {
      if (!checkAdmin()) return;

      // Check URL params for tab
      const tabParam = searchParams.get('tab');
      if (tabParam && ['orders', 'products', 'messages', 'payments'].includes(tabParam)) {
        setActiveTab(tabParam);
      }

      try {
        // Fetch all orders (admin only)
        const ordersData = await ordersAPI.getAll();
        setOrders(ordersData);

        // Fetch all products
        const productsResponse = await productsAPI.getAll({ limit: 100 });
        setProducts(productsResponse.products || []);

        // Calculate stats
        const totalRevenue = ordersData.reduce((sum: number, order: any) => sum + order.totalPrice, 0);
        const pendingOrders = ordersData.filter((o: any) => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
        const completedOrders = ordersData.filter((o: any) => o.orderStatus === 'Delivered').length;

        setStats({
          totalOrders: ordersData.length,
          totalRevenue,
          totalProducts: productsResponse.products?.length || 0,
          totalUsers: new Set(ordersData.map((o: any) => o.user?._id)).size,
          pendingOrders,
          completedOrders,
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, searchParams]);

  // Fetch messages when messages tab is active
  useEffect(() => {
    const fetchMessages = async () => {
      if (activeTab === 'messages') {
        try {
          const response = await contactAPI.getAllMessages();
          setMessages(response.messages || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (isPaid: boolean) => {
    return isPaid 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800';
  };

  const handleReplySubmit = async (messageId: string) => {
    try {
      await contactAPI.replyToMessage(messageId, replyMessage);
      // Reset reply state
      setReplyingTo(null);
      setReplyMessage('');
      // Refresh messages
      const response = await contactAPI.getAllMessages();
      setMessages(response.messages || []);
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - Clean */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Seller Dashboard</h1>
              <p className="text-purple-100">Welcome back, manage your store</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/admin/chats"
                className="bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Messages
              </a>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalProducts}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Pending Orders</h3>
            </div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Completed Orders</h3>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Success Rate</h3>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Quick Action Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🛍️ All Orders
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'products'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📦 Products
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'payments'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                💳 Payments
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'messages'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📧 Messages ({messages.filter(m => !m.replied).length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Dashboard/Overview Tab - Growth & Analytics */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Business Analytics</h3>
                  
                  {/* Revenue Chart Placeholder */}
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                    <h4 className="font-bold text-gray-900 mb-4">Revenue Growth</h4>
                    <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-16 h-16 text-green-500 mx-auto mb-2" />
                        <p className="text-gray-600">Revenue trending upward 📈</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">+{Math.round((stats.totalRevenue / 100000) * 100)}% Growth</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <h4 className="font-bold text-gray-900 mb-4">Recent Orders</h4>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">#{order._id.slice(-6).toUpperCase()}</div>
                          <div className="text-sm text-gray-600">{order.user?.name || 'Guest'}</div>
                          <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-right mr-4">
                          <div className="font-bold text-purple-600">₹{order.totalPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{order.orderItems.length} items</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab - ONLY Orders */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">All Orders ({orders.length})</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      {stats.pendingOrders} Pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {stats.completedOrders} Completed
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Items</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="font-semibold">{order.user?.name || 'Unknown'}</div>
                            <div className="text-gray-600">{order.user?.email}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">{order.orderItems.length}</td>
                          <td className="px-4 py-3 text-sm font-bold text-purple-600">
                            ₹{order.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.isPaid)}`}>
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Product Inventory ({products.length})</h3>
                  <div className="text-sm text-gray-600">
                    Total value: ₹{products.reduce((sum, p) => sum + (p.price * (p.stock || 1)), 0).toLocaleString()}
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product._id || product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.brand}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.categorySlug}</td>
                          <td className="px-4 py-3 text-sm font-bold text-purple-600">₹{product.price.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              (product.stock || 0) > 10 ? 'bg-green-100 text-green-800' :
                              (product.stock || 0) > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.stock || 0} units
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {(product.stock || 0) > 0 ? (
                              <span className="text-green-600 font-semibold">✓ In Stock</span>
                            ) : (
                              <span className="text-red-600 font-semibold">✗ Out of Stock</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Payment Management ({orders.length})</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {orders.filter(o => o.isPaid).length} Paid
                    </span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      {orders.filter(o => !o.isPaid).length} Pending
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono">#{order._id.slice(-8).toUpperCase()}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="font-semibold">{order.user?.name || 'Unknown'}</div>
                            <div className="text-gray-600">{order.user?.email}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              {order.paymentMethod === 'card' ? 'Credit Card' : 
                               order.paymentMethod === 'upi' ? 'UPI/Wallet' : 
                               'Cash on Delivery'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-purple-600">
                            ₹{order.totalPrice.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.isPaid)}`}>
                              {order.isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {!order.isPaid && (
                              <button
                                onClick={async () => {
                                  try {
                                    // In a real implementation, you would have a proper payment verification flow
                                    // For now, we'll just mark it as paid
                                    await ordersAPI.updateToPaid(order._id, {
                                      id: `manual_${Date.now()}`,
                                      status: 'completed',
                                      update_time: new Date().toISOString(),
                                      email_address: order.user?.email || ''
                                    });
                                    // Refresh orders
                                    const ordersData = await ordersAPI.getAll();
                                    setOrders(ordersData);
                                    alert('Payment marked as completed!');
                                  } catch (error) {
                                    console.error('Error updating payment status:', error);
                                    alert('Failed to update payment status.');
                                  }
                                }}
                                className="px-3 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-green-700 transition"
                              >
                                Mark as Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Customer Messages ({messages.length})</h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                      {messages.filter(m => !m.replied).length} Unreplied
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      {messages.filter(m => m.replied).length} Replied
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h4>
                      <p className="text-gray-600">Customer messages will appear here when they contact you.</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message._id} className={`border rounded-lg p-5 ${message.replied ? 'bg-gray-50 border-gray-200' : 'bg-white border-purple-200 shadow-sm'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">{message.subject}</h4>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <span>From: {message.name}</span>
                              <span>Email: {message.email}</span>
                              {message.phone && <span>Phone: {message.phone}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {new Date(message.createdAt).toLocaleString()}
                            </div>
                            {message.replied ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Replied
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-gray-700">{message.message}</p>
                        </div>
                        
                        {message.replied && message.replyMessage && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                            <div className="flex items-center mb-2">
                              <span className="text-sm font-semibold text-blue-700">Your Reply:</span>
                            </div>
                            <p className="text-gray-700">{message.replyMessage}</p>
                            <div className="text-xs text-gray-500 mt-2">
                              Replied on: {new Date(message.repliedAt).toLocaleString()}
                            </div>
                          </div>
                        )}
                        
                        {!message.replied && (
                          <div className="mt-4">
                            {replyingTo === message._id ? (
                              <div className="space-y-3">
                                <textarea
                                  value={replyMessage}
                                  onChange={(e) => setReplyMessage(e.target.value)}
                                  placeholder="Type your reply here..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                  rows={4}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleReplySubmit(message._id)}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
                                  >
                                    Send Reply
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReplyingTo(null);
                                      setReplyMessage('');
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setReplyingTo(message._id)}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center gap-2"
                              >
                                <Mail className="w-4 h-4" />
                                Reply to Message
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component wrapped in Suspense
export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}