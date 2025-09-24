import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsAPI = {
  getAll: (params = {}) => apiClient.get('/products', { params }),
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`)
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
  create: (data) => apiClient.post('/categories', data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data)
};

// Cart API
export const cartAPI = {
  get: (sessionId) => apiClient.get(`/cart/${sessionId}`),
  addItem: (sessionId, item) => apiClient.post(`/cart/${sessionId}/items`, item),
  updateItem: (sessionId, productId, quantity) => 
    apiClient.put(`/cart/${sessionId}/items/${productId}`, { quantity }),
  removeItem: (sessionId, productId) => 
    apiClient.delete(`/cart/${sessionId}/items/${productId}`),
  clear: (sessionId) => apiClient.delete(`/cart/${sessionId}`)
};

// Auth API
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  verify: (token) => apiClient.post('/auth/verify', { token }),
  logout: () => apiClient.post('/auth/logout')
};

// Payment API
export const paymentAPI = {
  createOrder: (orderData) => apiClient.post('/payment/create-order', orderData),
  getOrderStatus: (orderId) => apiClient.get(`/payment/order/${orderId}`),
  simulatePayment: (orderId) => apiClient.post(`/payment/simulate-payment/${orderId}`)
};

// Session management
export const generateSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `tambar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export default apiClient;