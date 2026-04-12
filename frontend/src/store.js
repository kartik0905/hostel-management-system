/* ─────────────────────────────────────
   Auth State Store (localStorage)
   ───────────────────────────────────── */

const STORAGE_KEY = 'hms_auth';

export const store = {
  /** Get current user from localStorage */
  getUser() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  /** Save user + token after login/register */
  setUser(userData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  },

  /** Clear auth state (logout) */
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  /** Get JWT token */
  getToken() {
    const user = this.getUser();
    return user?.token || null;
  },

  /** Check if user is authenticated */
  isAuthenticated() {
    return !!this.getToken();
  },

  /** Check if user is admin */
  isAdmin() {
    const user = this.getUser();
    return user?.role === 'Admin';
  },

  /** Get user's display initial */
  getInitial() {
    const user = this.getUser();
    return user?.name?.charAt(0)?.toUpperCase() || '?';
  },
};
