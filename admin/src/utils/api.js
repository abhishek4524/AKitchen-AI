const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/admin/auth/login';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.statusText}`);
  }

  return response.json();
};

// Admin Auth API
export const adminAuthAPI = {
  login: (email, password) =>
    fetch(`${API_URL}${ADMIN_LOGIN_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(r => r.json()),
};

// Recipes API
export const recipesAPI = {
  getAll: () => apiCall('/recipes'),
  getById: (id) => apiCall(`/recipes/${id}`),
  create: (data) => apiCall('/recipes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiCall(`/recipes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/recipes/${id}`, { method: 'DELETE' }),
};

// Users API
export const usersAPI = {
  getAll: () => apiCall('/admin/users'),
  getById: (id) => apiCall(`/admin/users/${id}`),
  updateProfile: (id, data) => apiCall(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Items API
export const itemsAPI = {
  getAll: () => apiCall('/grocery/items'),
  create: (data) => apiCall('/grocery/items', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id) => apiCall(`/grocery/items/${id}`, { method: 'DELETE' }),
};
