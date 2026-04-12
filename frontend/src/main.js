/* ─────────────────────────────────────
   Main Entry — Bootstrap & Layout
   ───────────────────────────────────── */

// ── Styles ──
import './styles/index.css';
import './styles/components.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/rooms.css';
import './styles/complaints.css';

// ── Modules ──
import { addRoute, initRouter, navigate } from './router.js';
import { store } from './store.js';

// ── Pages ──
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderRooms } from './pages/rooms.js';
import { renderComplaints } from './pages/complaints.js';

/* ═══════════════════════════════════════════
   TOAST SYSTEM
   ═══════════════════════════════════════════ */

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} type
 */
export function showToast(message, type = 'info') {
  const container = ensureToastContainer();

  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span style="font-size:1.1rem;font-weight:700">${icon}</span><span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-exit');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ═══════════════════════════════════════════
   APP LAYOUT (Sidebar + Main Content)
   ═══════════════════════════════════════════ */

/**
 * Render the dashboard layout shell.
 * @param {string} activePage - current page name for nav highlighting
 */
export function renderLayout(activePage) {
  const app = document.getElementById('app');
  const user = store.getUser();
  const isAdmin = store.isAdmin();
  const initial = store.getInitial();

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    ...(isAdmin ? [{ id: 'rooms', icon: '🏢', label: 'Rooms' }] : []),
    { id: 'complaints', icon: '📋', label: 'Complaints' },
  ];

  app.innerHTML = `
    <!-- Mobile Header -->
    <div class="mobile-header">
      <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
      <span style="font-weight:700;font-size:0.95rem;">HMS</span>
      <div style="width:40px"></div>
    </div>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <div class="app-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <div class="sidebar-logo">🏠</div>
            <div>
              <div class="sidebar-brand-text">Hostel HMS</div>
              <div class="sidebar-brand-sub">Management System</div>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section">Menu</div>
          ${navItems.map(item => `
            <a class="nav-link ${activePage === item.id ? 'active' : ''}" data-page="${item.id}" id="nav-${item.id}">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `).join('')}
        </nav>

        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-avatar">${initial}</div>
            <div class="sidebar-user-info">
              <div class="sidebar-user-name">${user?.name || 'User'}</div>
              <div class="sidebar-user-role">${user?.role || 'Unknown'}</div>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm logout-btn" id="logout-btn">
            Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content" id="page-content">
        <div class="loading-container"><div class="spinner"></div></div>
      </main>
    </div>
  `;

  // Nav clicks
  navItems.forEach(item => {
    document.getElementById(`nav-${item.id}`)?.addEventListener('click', () => {
      closeSidebar();
      navigate(item.id);
    });
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    store.clear();
    showToast('Logged out successfully', 'info');
    navigate('login');
  });

  // Mobile menu
  document.getElementById('mobile-menu-btn')?.addEventListener('click', toggleSidebar);
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);
}

function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('open');
}

/* ═══════════════════════════════════════════
   ROUTE REGISTRATION & INIT
   ═══════════════════════════════════════════ */

addRoute('login', renderLogin);
addRoute('register', renderRegister);
addRoute('dashboard', renderDashboard);
addRoute('rooms', renderRooms);
addRoute('complaints', renderComplaints);

// Boot
initRouter();
