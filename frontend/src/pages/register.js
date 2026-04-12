/* ─────────────────────────────────────
   Register Page
   ───────────────────────────────────── */

import { authAPI } from '../api.js';
import { showToast } from '../main.js';
import { navigate } from '../router.js';

export async function renderRegister() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="auth-logo-icon">✨</div>
            <h1 class="auth-title">Create Account</h1>
            <p class="auth-subtitle">Join the hostel management system</p>
          </div>

          <form class="auth-form" id="register-form">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name</label>
              <input
                class="form-input"
                type="text"
                id="reg-name"
                placeholder="Your full name"
                required
                autocomplete="name"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-email">Email Address</label>
              <input
                class="form-input"
                type="email"
                id="reg-email"
                placeholder="yourname@geu.ac.in"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="reg-password">Password</label>
              <input
                class="form-input"
                type="password"
                id="reg-password"
                placeholder="Create a strong password"
                required
                minlength="6"
                autocomplete="new-password"
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="reg-contact">Contact Number</label>
                <input
                  class="form-input"
                  type="tel"
                  id="reg-contact"
                  placeholder="Phone number"
                  autocomplete="tel"
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="reg-role">Role</label>
                <select class="form-select" id="reg-role">
                  <option value="Tenant">Tenant</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-primary auth-submit" id="register-submit">
              Create Account
            </button>
          </form>

          <div class="auth-footer">
            Already have an account?
            <a href="#/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('register-form');
  const submitBtn = document.getElementById('register-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const contactNumber = document.getElementById('reg-contact').value.trim();
    const role = document.getElementById('reg-role').value;

    if (!email.endsWith('@geu.ac.in')) {
      showToast('Email must end with @geu.ac.in', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';

    try {
      await authAPI.register({ name, email, password, contactNumber, role });
      showToast('Account created! Please sign in.', 'success');
      navigate('login');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
}
