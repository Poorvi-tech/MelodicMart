// API Service for MelodicMart
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  // Try to get token from localStorage first, then check cookies as fallback
  let token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // If no token in localStorage, try to get it from cookies
  if (!token && typeof window !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token') {
        token = value;
        break;
      }
    }
  }
  
  // Check if this is a multipart/form-data request
  const isFormData = options.body instanceof FormData;
  
  const config = {
    ...options,
    headers: {
      // Only set Content-Type to application/json if it's not a FormData request
      ...!isFormData && {
        'Content-Type': 'application/json',
      },
      ...token && {
        Authorization: `Bearer ${token}`
      },
      ...options.headers
    }
  };

  // Ensure endpoint starts with / and remove any double slashes
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_URL}${normalizedEndpoint}`.replace(/([^:]\/)\/+/g, "$1");
  
  console.log('Making API request to:', url); // Debug line

  const response = await fetch(url, config);
  
  if (!response.ok) {
    // Instead of redirecting to login here, we'll throw the error
    // and let the middleware handle the redirect
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

  verifyOTP: async (data: { email: string; otp: string }) => {
    return fetchAPI('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resendOTP: async (data: { email: string }) => {
    return fetchAPI('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  forgotPassword: async (data: { email: string }) => {
    return fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (data: { email: string; otp: string; newPassword: string }) => {
    return fetchAPI('/auth/reset-password', {
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
  
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return fetchAPI('/auth/profile/avatar', {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header, let browser set it with boundary
      headers: {}
    });
  },
  
  getUserStats: async () => {
    return fetchAPI('/auth/profile/stats');
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

// Wishlist API
export const wishlistAPI = {
  getAll: async () => {
    return fetchAPI('/wishlist');
  },

  addItem: async (productId: string) => {
    return fetchAPI('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },

  removeItem: async (productId: string) => {
    return fetchAPI(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
  
  getCount: async () => {
    const response = await fetchAPI('/wishlist');
    return response.count || 0;
  },
};

// Stock Alert API
export const stockAlertAPI = {
  create: async (data: { productId: string; email: string }) => {
    return fetchAPI('/stock-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Contact API
export const contactAPI = {
  sendMessage: async (data: { name: string; email: string; phone?: string; subject: string; message: string }) => {
    return fetchAPI('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getAllMessages: async () => {
    return fetchAPI('/contact/messages');
  },
  
  replyToMessage: async (id: string, replyMessage: string) => {
    return fetchAPI(`/contact/messages/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  }
};

// Order API
export const orderAPI = {
  create: async (data: any) => {
    return fetchAPI('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return fetchAPI('/orders');
  },
  
  getMyOrders: async () => {
    return fetchAPI('/orders/myorders');
  },

  getById: async (id: string) => {
    return fetchAPI(`/orders/${id}`);
  },
  
  updateToPaid: async (id: string, paymentResult: any) => {
    return fetchAPI(`/orders/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify(paymentResult),
    });
  },
  
  updateStatus: async (id: string, statusData: any) => {
    return fetchAPI(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }
};
