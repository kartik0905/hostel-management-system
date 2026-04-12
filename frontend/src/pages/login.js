/* ─────────────────────────────────────
   Login Page
   ───────────────────────────────────── */

import { authAPI } from '../api.js';
import { store } from '../store.js';
import { navigate } from '../router.js';
import { showToast } from '../main.js';

export async function renderLogin() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="auth-logo-icon">🏠</div>
            <h1 class="auth-title">Welcome Back</h1>
            <p class="auth-subtitle">Sign in to your hostel management account</p>
          </div>

          <form class="auth-form" id="login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <input
                class="form-input"
                type="email"
                id="login-email"
                placeholder="yourname@geu.ac.in"
                required
                autocomplete="email"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input
                class="form-input"
                type="password"
                id="login-password"
                placeholder="Enter your password"
                required
                autocomplete="current-password"
              />
            </div>

            <button type="submit" class="btn btn-primary auth-submit" id="login-submit">
              Sign In
            </button>
          </form>

          <div class="auth-footer">
            Don't have an account?
            <a href="#/register">Create one</a>
          </div>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('login-form');
  const submitBtn = document.getElementById('login-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email.endsWith('@geu.ac.in')) {
      showToast('Email must end with @geu.ac.in', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';

    try {
      const data = await authAPI.login(email, password);
      store.setUser(data);
      showToast(`Welcome back, ${data.name}!`, 'success');
      navigate('dashboard');
    } catch (err) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
}
