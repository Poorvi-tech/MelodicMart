// Determine API URL based on environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://melodicmart.onrender.com/api');

console.log('API_URL being used:', API_URL); // Debug line

// Utility function to get token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Utility function to handle fetch
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  // Ensure endpoint starts with / and remove any double slashes
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${normalizedEndpoint}`.replace(/([^:]\/)\/+/g, "$1");

  console.log('Making API request to:', url); // Debug line

  const response = await fetch(url, config);
  
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
};

// Auth API
export const authAPI = {
  register: async (data: { name: string; email: string; password: string; phone?: string }) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async () => {
    return fetchAPI('/auth/profile');
  },

  updateProfile: async (data: any) => {
    return fetchAPI('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: { category?: string; search?: string; featured?: boolean; sort?: string; limit?: number; page?: number }) => {
    const queryString = new URLSearchParams(params as any).toString();
    return fetchAPI(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getBySlug: async (slug: string) => {
    return fetchAPI(`/products/${slug}`);
  },

  create: async (data: any) => {
    return fetchAPI('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchAPI(`/products/id/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI(`/products/id/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (featured?: boolean) => {
    return fetchAPI(`/categories${featured ? '?featured=true' : ''}`);
  },

  getBySlug: async (slug: string) => {
    return fetchAPI(`/categories/${slug}`);
  },

  create: async (data: any) => {
    return fetchAPI('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return fetchAPI(`/categories/id/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchAPI(`/categories/id/${id}`, {
      method: 'DELETE',
    });
  },
};

// Orders API
export const ordersAPI = {
  create: async (data: {
    orderItems: any[];
    shippingAddress: any;
    paymentMethod: string;
    itemsPrice: number;
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
  }) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getById: async (id: string) => {
    return fetchAPI(`/orders/${id}`);
  },

  getMyOrders: async () => {
    return fetchAPI('/orders/myorders');
  },

  getAll: async () => {
    return fetchAPI('/orders');
  },

  updateStatus: async (id: string, status: string, trackingNumber?: string) => {
    return fetchAPI(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, trackingNumber }),
    });
  },

  updateToPaid: async (id: string, paymentResult: any) => {
    return fetchAPI(`/orders/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify(paymentResult),
    });
  },
};

// Contact Messages API
export const contactAPI = {
  getAllMessages: async () => {
    return fetchAPI('/contact/messages');
  },

  getMessageById: async (id: string) => {
    return fetchAPI(`/contact/messages/${id}`);
  },

  replyToMessage: async (id: string, replyMessage: string) => {
    return fetchAPI(`/contact/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  },
};



export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI,
  orders: ordersAPI,
  contact: contactAPI,
};