/* ─────────────────────────────────────
   Dashboard Page — Role-aware
   ───────────────────────────────────── */

import { store } from '../store.js';
import { roomsAPI, complaintsAPI } from '../api.js';
import { navigate } from '../router.js';
import { showToast, renderLayout } from '../main.js';

export async function renderDashboard() {
  const user = store.getUser();
  const isAdmin = store.isAdmin();

  renderLayout('dashboard');

  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-description">Welcome back, ${user.name}. Here's your overview.</p>
    </div>
    <div class="page-body">
      <div class="stats-grid stagger-children" id="stats-grid">
        <div class="loading-container"><div class="spinner"></div></div>
      </div>

      <div class="glass-card-static" style="margin-top:var(--space-lg);" id="recent-section">
        <div class="loading-container"><div class="spinner"></div></div>
      </div>
    </div>
  `;

  try {
    let complaints = [];
    try {
      complaints = await complaintsAPI.getAll();
    } catch { /* tenant may not have complaints yet */ }

    const statsGrid = document.getElementById('stats-grid');

    if (isAdmin) {
      let rooms = [];
      try {
        rooms = await roomsAPI.getAll();
      } catch { /* fail silently */ }

      const totalBeds = rooms.reduce((sum, r) => sum + r.capacity, 0);
      const occupiedBeds = rooms.reduce((sum, r) => sum + r.currentOccupancy, 0);
      const pending = complaints.filter(c => c.status === 'Pending').length;
      const inProgress = complaints.filter(c => c.status === 'In-Progress').length;

      statsGrid.innerHTML = `
        <div class="glass-card stat-card purple animate-fade-in-up">
          <span class="stat-icon">🏢</span>
          <div class="stat-value">${rooms.length}</div>
          <div class="stat-label">Total Rooms</div>
        </div>
        <div class="glass-card stat-card cyan animate-fade-in-up">
          <span class="stat-icon">🛏️</span>
          <div class="stat-value">${occupiedBeds}/${totalBeds}</div>
          <div class="stat-label">Beds Occupied</div>
        </div>
        <div class="glass-card stat-card pink animate-fade-in-up">
          <span class="stat-icon">⚠️</span>
          <div class="stat-value">${pending}</div>
          <div class="stat-label">Pending Complaints</div>
        </div>
        <div class="glass-card stat-card green animate-fade-in-up">
          <span class="stat-icon">🔄</span>
          <div class="stat-value">${inProgress}</div>
          <div class="stat-label">In Progress</div>
        </div>
      `;
    } else {
      // Tenant dashboard
      const myComplaints = complaints.length;
      const pending = complaints.filter(c => c.status === 'Pending').length;
      const resolved = complaints.filter(c => c.status === 'Resolved').length;

      statsGrid.innerHTML = `
        <div class="glass-card stat-card purple animate-fade-in-up">
          <span class="stat-icon">📋</span>
          <div class="stat-value">${myComplaints}</div>
          <div class="stat-label">My Complaints</div>
        </div>
        <div class="glass-card stat-card pink animate-fade-in-up">
          <span class="stat-icon">⏳</span>
          <div class="stat-value">${pending}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="glass-card stat-card green animate-fade-in-up">
          <span class="stat-icon">✅</span>
          <div class="stat-value">${resolved}</div>
          <div class="stat-label">Resolved</div>
        </div>
      `;
    }

    // Recent complaints section
    const recentSection = document.getElementById('recent-section');
    const recentComplaints = complaints.slice(0, 5);

    if (recentComplaints.length === 0) {
      recentSection.innerHTML = `
        <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-md);">Recent Complaints</h2>
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p class="empty-state-text">No complaints yet. ${isAdmin ? '' : 'File one from the Complaints page.'}</p>
        </div>
      `;
    } else {
      recentSection.innerHTML = `
        <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:var(--space-md);">Recent Complaints</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>Title</th>
              ${isAdmin ? '<th>Tenant</th>' : ''}
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${recentComplaints.map(c => {
              const statusClass = c.status === 'Pending' ? 'pending' : c.status === 'In-Progress' ? 'progress' : 'resolved';
              const tenantName = c.tenantId?.name || '—';
              const date = new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              return `
                <tr>
                  <td>${c.title}</td>
                  ${isAdmin ? `<td>${tenantName}</td>` : ''}
                  <td><span class="badge badge-${statusClass}"><span class="badge-dot"></span>${c.status}</span></td>
                  <td>${date}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }

  } catch (err) {
    showToast('Failed to load dashboard data', 'error');
  }
}
