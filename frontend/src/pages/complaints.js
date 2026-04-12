/* ─────────────────────────────────────
   Complaints Page
   ───────────────────────────────────── */

import { complaintsAPI } from '../api.js';
import { store } from '../store.js';
import { showToast, renderLayout } from '../main.js';

let currentFilter = 'All';

export async function renderComplaints() {
  const isAdmin = store.isAdmin();

  renderLayout('complaints');

  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Complaints</h1>
      <p class="page-description">${isAdmin ? 'Manage and resolve complaints from tenants.' : 'View and submit your complaints.'}</p>
    </div>
    <div class="page-body">
      <div class="complaints-header">
        <div class="complaints-filters">
          <button class="filter-btn active" data-filter="All">All</button>
          <button class="filter-btn" data-filter="Pending">Pending</button>
          <button class="filter-btn" data-filter="In-Progress">In Progress</button>
          <button class="filter-btn" data-filter="Resolved">Resolved</button>
        </div>
        ${!isAdmin ? '<button class="btn btn-primary" id="new-complaint-btn">+ New Complaint</button>' : ''}
      </div>
      <div id="complaints-container">
        <div class="loading-container"><div class="spinner"></div></div>
      </div>
    </div>
  `;

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      loadComplaints();
    });
  });

  // New complaint button (tenant only)
  if (!isAdmin) {
    document.getElementById('new-complaint-btn')?.addEventListener('click', showNewComplaintModal);
  }

  currentFilter = 'All';
  await loadComplaints();
}

async function loadComplaints() {
  const container = document.getElementById('complaints-container');
  const isAdmin = store.isAdmin();

  try {
    let complaints = await complaintsAPI.getAll();

    if (currentFilter !== 'All') {
      complaints = complaints.filter(c => c.status === currentFilter);
    }

    if (complaints.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <p class="empty-state-text">${currentFilter === 'All' ? 'No complaints found.' : `No ${currentFilter.toLowerCase()} complaints.`}</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="complaints-list stagger-children">
      ${complaints.map(c => {
        const statusClass = c.status === 'Pending' ? 'pending' : c.status === 'In-Progress' ? 'in-progress' : 'resolved';
        const badgeClass = c.status === 'Pending' ? 'badge-pending' : c.status === 'In-Progress' ? 'badge-progress' : 'badge-resolved';
        const tenantName = c.tenantId?.name || 'You';
        const tenantEmail = c.tenantId?.email || '';
        const initial = tenantName.charAt(0).toUpperCase();
        const date = new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        const time = new Date(c.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        return `
          <div class="glass-card complaint-card animate-fade-in-up">
            <div class="complaint-card-header">
              <div>
                <div class="complaint-title">${c.title}</div>
                <div class="complaint-meta">
                  <span class="complaint-meta-item">📅 ${date}</span>
                  <span class="complaint-meta-item">🕐 ${time}</span>
                </div>
              </div>
              ${isAdmin
                ? `<select class="form-select status-select ${statusClass}" data-complaint-id="${c._id}" id="status-${c._id}">
                    <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In-Progress" ${c.status === 'In-Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                  </select>`
                : `<span class="badge ${badgeClass}"><span class="badge-dot"></span>${c.status}</span>`
              }
            </div>
            <div class="complaint-description">${c.description}</div>
            ${isAdmin ? `
              <div class="complaint-footer">
                <div class="complaint-tenant-info">
                  <div class="complaint-tenant-avatar">${initial}</div>
                  <div>
                    <div style="font-weight:600;color:var(--text-primary)">${tenantName}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted)">${tenantEmail}</div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>`;

    // Admin: status change handlers
    if (isAdmin) {
      container.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
          const id = e.target.dataset.complaintId;
          const newStatus = e.target.value;

          try {
            await complaintsAPI.updateStatus(id, newStatus);
            showToast(`Status updated to ${newStatus}`, 'success');
            await loadComplaints();
          } catch (err) {
            showToast(err.message || 'Failed to update status', 'error');
            await loadComplaints(); // revert UI
          }
        });
      });
    }

  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❌</div>
        <p class="empty-state-text">${err.message || 'Failed to load complaints'}</p>
      </div>
    `;
  }
}

function showNewComplaintModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">File a Complaint</h3>
        <button class="modal-close" id="complaint-modal-close">&times;</button>
      </div>
      <form class="modal-body new-complaint-form" id="new-complaint-form">
        <div class="form-group">
          <label class="form-label" for="complaint-title">Title</label>
          <input class="form-input" type="text" id="complaint-title" placeholder="Brief title of your complaint" required />
        </div>
        <div class="form-group">
          <label class="form-label" for="complaint-desc">Description</label>
          <textarea class="form-input" id="complaint-desc" placeholder="Describe the issue in detail..." required rows="4"></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="complaint-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="complaint-submit">Submit</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('complaint-modal-close').addEventListener('click', close);
  document.getElementById('complaint-modal-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.getElementById('new-complaint-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('complaint-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    try {
      await complaintsAPI.create({
        title: document.getElementById('complaint-title').value.trim(),
        description: document.getElementById('complaint-desc').value.trim(),
      });
      showToast('Complaint submitted successfully!', 'success');
      close();
      await loadComplaints();
    } catch (err) {
      showToast(err.message || 'Failed to submit complaint', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
}
