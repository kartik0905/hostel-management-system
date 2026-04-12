/* ─────────────────────────────────────
   Rooms Page — Admin only
   ───────────────────────────────────── */

import { roomsAPI } from '../api.js';
import { showToast, renderLayout } from '../main.js';

export async function renderRooms() {
  renderLayout('rooms');

  const content = document.getElementById('page-content');
  content.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Room Management</h1>
      <p class="page-description">Add, view, and manage hostel rooms.</p>
    </div>
    <div class="page-body">
      <div class="rooms-header">
        <h2>All Rooms</h2>
        <button class="btn btn-primary" id="add-room-btn">+ Add Room</button>
      </div>
      <div id="rooms-container">
        <div class="loading-container"><div class="spinner"></div></div>
      </div>
    </div>
  `;

  document.getElementById('add-room-btn').addEventListener('click', showAddRoomModal);
  await loadRooms();
}

async function loadRooms() {
  const container = document.getElementById('rooms-container');

  try {
    const rooms = await roomsAPI.getAll();

    if (rooms.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🏢</div>
          <p class="empty-state-text">No rooms added yet. Click "Add Room" to get started.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `<div class="rooms-grid stagger-children">
      ${rooms.map(room => {
        const occupancyPercent = room.capacity > 0 ? Math.round((room.currentOccupancy / room.capacity) * 100) : 0;
        const isFull = room.currentOccupancy >= room.capacity;
        const statusClass = isFull ? 'room-status-full' : 'room-status-available';

        return `
          <div class="glass-card room-card animate-fade-in-up">
            <div class="room-card-header">
              <div>
                <div class="room-number-label">Room</div>
                <div class="room-number">#${room.roomNumber}</div>
              </div>
              <button class="room-edit-btn" data-room-id="${room._id}" data-room-number="${room.roomNumber}" data-capacity="${room.capacity}" data-rent="${room.rentPerBed}" title="Edit Room">✏️</button>
            </div>
            <div class="room-details">
              <div class="room-detail-row">
                <span class="room-detail-label">💰 Rent/bed</span>
                <span class="room-detail-value">₹${room.rentPerBed.toLocaleString('en-IN')}</span>
              </div>
              <div class="room-detail-row">
                <span class="room-detail-label">🛏️ Capacity</span>
                <span class="room-detail-value">${room.capacity} beds</span>
              </div>
              <div class="room-occupancy">
                <div class="occupancy-header">
                  <span class="occupancy-text">Occupancy</span>
                  <span class="occupancy-count ${statusClass}">${room.currentOccupancy} / ${room.capacity}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${occupancyPercent}%;${isFull ? 'background:linear-gradient(135deg,#ef4444,#dc2626)' : ''}"></div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>`;

    // Attach edit handlers
    container.querySelectorAll('.room-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        showEditRoomModal(
          btn.dataset.roomId,
          btn.dataset.roomNumber,
          btn.dataset.capacity,
          btn.dataset.rent
        );
      });
    });

  } catch (err) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">❌</div>
        <p class="empty-state-text">${err.message || 'Failed to load rooms'}</p>
      </div>
    `;
  }
}

function showAddRoomModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'room-modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Add New Room</h3>
        <button class="modal-close" id="modal-close-btn">&times;</button>
      </div>
      <form class="modal-body" id="add-room-form">
        <div class="form-group">
          <label class="form-label" for="room-number-input">Room Number</label>
          <input class="form-input" type="text" id="room-number-input" placeholder="e.g. 101" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="room-capacity-input">Capacity</label>
            <input class="form-input" type="number" id="room-capacity-input" placeholder="e.g. 3" min="1" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="room-rent-input">Rent per Bed (₹)</label>
            <input class="form-input" type="number" id="room-rent-input" placeholder="e.g. 5000" min="0" required />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
          <button type="submit" class="btn btn-primary" id="add-room-submit">Add Room</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('modal-close-btn').addEventListener('click', close);
  document.getElementById('modal-cancel-btn').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.getElementById('add-room-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('add-room-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Adding...';

    try {
      await roomsAPI.add({
        roomNumber: document.getElementById('room-number-input').value.trim(),
        capacity: parseInt(document.getElementById('room-capacity-input').value),
        rentPerBed: parseInt(document.getElementById('room-rent-input').value),
      });
      showToast('Room added successfully!', 'success');
      close();
      await loadRooms();
    } catch (err) {
      showToast(err.message || 'Failed to add room', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Room';
    }
  });
}

function showEditRoomModal(id, roomNumber, capacity, rentPerBed) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Edit Room #${roomNumber}</h3>
        <button class="modal-close" id="edit-modal-close">&times;</button>
      </div>
      <form class="modal-body" id="edit-room-form">
        <div class="form-group">
          <label class="form-label" for="edit-room-number">Room Number</label>
          <input class="form-input" type="text" id="edit-room-number" value="${roomNumber}" required />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="edit-room-capacity">Capacity</label>
            <input class="form-input" type="number" id="edit-room-capacity" value="${capacity}" min="1" required />
          </div>
          <div class="form-group">
            <label class="form-label" for="edit-room-rent">Rent per Bed (₹)</label>
            <input class="form-input" type="number" id="edit-room-rent" value="${rentPerBed}" min="0" required />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="edit-modal-cancel">Cancel</button>
          <button type="submit" class="btn btn-primary" id="edit-room-submit">Save Changes</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  document.getElementById('edit-modal-close').addEventListener('click', close);
  document.getElementById('edit-modal-cancel').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

  document.getElementById('edit-room-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('edit-room-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      await roomsAPI.update(id, {
        roomNumber: document.getElementById('edit-room-number').value.trim(),
        capacity: parseInt(document.getElementById('edit-room-capacity').value),
        rentPerBed: parseInt(document.getElementById('edit-room-rent').value),
      });
      showToast('Room updated successfully!', 'success');
      close();
      await loadRooms();
    } catch (err) {
      showToast(err.message || 'Failed to update room', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Changes';
    }
  });
}
