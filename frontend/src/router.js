/* ─────────────────────────────────────
   Hash-based SPA Router
   ───────────────────────────────────── */

import { store } from './store.js';

const routes = {};
let currentCleanup = null;

/**
 * Register a route handler.
 * @param {string} path - Hash path (e.g. 'login', 'dashboard')
 * @param {function} handler - Async function that renders the page. Can return a cleanup function.
 */
export function addRoute(path, handler) {
  routes[path] = handler;
}

/**
 * Navigate to a hash route.
 * @param {string} path
 */
export function navigate(path) {
  window.location.hash = `#/${path}`;
}

/**
 * Get current hash path.
 */
function getCurrentPath() {
  const hash = window.location.hash.slice(2) || '';
  return hash || 'login';
}

/**
 * Resolve the current route.
 */
async function resolve() {
  // Cleanup previous page
  if (typeof currentCleanup === 'function') {
    currentCleanup();
    currentCleanup = null;
  }

  const path = getCurrentPath();
  const isAuth = store.isAuthenticated();

  // Auth guard: redirect to login if not authenticated
  const publicRoutes = ['login', 'register'];
  if (!publicRoutes.includes(path) && !isAuth) {
    navigate('login');
    return;
  }

  // Already logged in? redirect to dashboard
  if (publicRoutes.includes(path) && isAuth) {
    navigate('dashboard');
    return;
  }

  const handler = routes[path];
  if (handler) {
    const cleanup = await handler();
    if (typeof cleanup === 'function') {
      currentCleanup = cleanup;
    }
  } else {
    // 404 → go to dashboard or login
    navigate(isAuth ? 'dashboard' : 'login');
  }
}

/**
 * Initialize the router.
 */
export function initRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}
