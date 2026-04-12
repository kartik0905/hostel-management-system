/* ─────────────────────────────────────
   API Client — fetch wrapper + JWT
   ───────────────────────────────────── */

import { store } from './store.js';

const BASE_URL = '/api';

/**
 * Make an API request with automatic JWT injection.
 * @param {string} endpoint - e.g. '/auth/login'
 * @param {object} options - { method, body, ... }
 * @returns {Promise<object>}
 */
async function request(endpoint, options = {}) {
  const { method = 'GET', body } = options;

  const headers = {
    'Content-Type': 'application/json',
  };

  const token = store.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

/* ── Auth Endpoints ── */
export const authAPI = {
  login(email, password) {
    return request('/auth/login', { method: 'POST', body: { email, password } });
  },

  register(userData) {
    return request('/auth/register', { method: 'POST', body: userData });
  },
};

/* ── Room Endpoints ── */
export const roomsAPI = {
  getAll() {
    return request('/rooms');
  },

  add(roomData) {
    return request('/rooms', { method: 'POST', body: roomData });
  },

  update(id, roomData) {
    return request(`/rooms/${id}`, { method: 'PUT', body: roomData });
  },
};

/* ── Complaint Endpoints ── */
export const complaintsAPI = {
  getAll() {
    return request('/complaints');
  },

  create(complaintData) {
    return request('/complaints', { method: 'POST', body: complaintData });
  },

  updateStatus(id, status) {
    return request(`/complaints/${id}`, { method: 'PUT', body: { status } });
  },
};
