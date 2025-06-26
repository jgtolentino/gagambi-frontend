import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper to ensure we always return arrays
function ensureArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export async function fetchEnrichments() {
  try {
    const res = await api.get('/api/v1/enrichments');
    return ensureArray(res.data);
  } catch (error) {
    console.error('Error fetching enrichments:', error);
    return [];
  }
}

export async function fetchScrapedPosts() {
  try {
    const res = await api.get('/api/v1/scraped-posts');
    return ensureArray(res.data);
  } catch (error) {
    console.error('Error fetching scraped posts:', error);
    return [];
  }
}

export async function fetchJudgeResults() {
  try {
    const res = await api.get('/api/v1/judge-results');
    return ensureArray(res.data);
  } catch (error) {
    console.error('Error fetching judge results:', error);
    return [];
  }
}

export async function enrichPost(postId) {
  const res = await api.post(`/api/v1/enrich/${postId}`);
  return res.data;
}

export async function login(username, password) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const res = await api.post('/api/v1/auth/login', formData);
  if (res.data.access_token) {
    localStorage.setItem('token', res.data.access_token);
  }
  return res.data;
}

export default api;
