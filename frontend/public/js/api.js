// ================================================
// public/js/api.js
// Shared API client — reusable fetch helpers
// for all Trishul Krushi Kendra frontend pages
// ================================================

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? '/api/v1' 
  : 'https://krushikendra-3.onrender.com/api/v1';

/**
 * Core fetch wrapper — returns { ok, data, errors, message }
 * Never throws; always resolves.
 */
async function apiFetch(endpoint, options = {}) {
 try {
 const res = await fetch(`${API_BASE}${endpoint}`, {
 headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
 ...options,
 });
 const json = await res.json();
 return { ok: res.ok, status: res.status, ...json };
 } catch (err) {
 return { ok: false, message: 'Network error. Please check your connection.', errors: {} };
 }
}

// ── Resource helpers ─────────────────────────────

/** GET /api/v1/products (supports filters, search, pagination) */
async function getProducts(params = {}) {
 const qs = new URLSearchParams(params).toString();
 return apiFetch(`/products${qs ? '?' + qs : ''}`);
}

/** GET /api/v1/products/:idOrSlug */
async function getProduct(idOrSlug) {
 return apiFetch(`/products/${idOrSlug}`);
}

/** POST /api/v1/enquiries */
async function submitEnquiry(payload) {
 return apiFetch('/enquiries', { method: 'POST', body: JSON.stringify(payload) });
}

/** POST /api/v1/dealers/apply */
async function submitDealerApplication(payload) {
 return apiFetch('/dealers/apply', { method: 'POST', body: JSON.stringify(payload) });
}

/** GET /api/v1/dealers */
async function getDealers(params = {}) {
 const qs = new URLSearchParams(params).toString();
 return apiFetch(`/dealers${qs ? '?' + qs : ''}`);
}

// ── UI helpers ───────────────────────────────────

/**
 * Show a styled toast notification.
 * type: 'success' | 'error' | 'info'
 */
function showToast(message, type = 'success', duration = 4500) {
 // Remove existing toasts
 document.querySelectorAll('.tkk-toast').forEach(t => t.remove());

 const icons = { success: '', error: '❌', info: 'ℹ' };
 const toast = document.createElement('div');
 toast.className = `tkk-toast tkk-toast--${type}`;
 toast.setAttribute('role', 'alert');
 toast.innerHTML = `<span class="tkk-toast__icon">${icons[type] || '•'}</span>
 <span class="tkk-toast__msg">${message}</span>
 <button class="tkk-toast__close" aria-label="Close">✕</button>`;

 // Inline styles so no extra CSS file needed
 Object.assign(toast.style, {
 position: 'fixed',
 bottom: '1.5rem',
 right: '1.5rem',
 zIndex: '9999',
 display: 'flex',
 alignItems: 'center',
 gap: '.6rem',
 padding: '.85rem 1.1rem',
 borderRadius: '10px',
 boxShadow: '0 4px 20px rgba(0,0,0,.15)',
 maxWidth: '360px',
 fontFamily: 'inherit',
 fontSize: '.9rem',
 fontWeight: '500',
 lineHeight: '1.4',
 animation: 'tkkSlideIn .3s ease',
 background: type === 'success' ? '#166534' : type === 'error' ? '#991b1b' : '#1e3a5f',
 color: '#fff',
 });

 // Inject keyframe once
 if (!document.getElementById('tkk-toast-style')) {
 const s = document.createElement('style');
 s.id = 'tkk-toast-style';
 s.textContent = `
 @keyframes tkkSlideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:none; } }
 .tkk-toast__close { background:none; border:none; color:#fff; cursor:pointer; font-size:1rem; margin-left:.25rem; opacity:.7; }
 .tkk-toast__close:hover { opacity:1; }
 `;
 document.head.appendChild(s);
 }

 document.body.appendChild(toast);
 toast.querySelector('.tkk-toast__close').addEventListener('click', () => toast.remove());

 const timer = setTimeout(() => toast.remove(), duration);
 toast.addEventListener('mouseenter', () => clearTimeout(timer));
}

/**
 * Show inline field errors below their inputs.
 * errors: { fieldName: "error message", ... }
 */
function showFieldErrors(formEl, errors = {}) {
 // Clear previous
 formEl.querySelectorAll('.api-field-error').forEach(el => el.remove());
 formEl.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

 Object.entries(errors).forEach(([field, msg]) => {
 const input = formEl.querySelector(`[name="${field}"]`);
 if (!input) return;
 input.classList.add('input-error');
 const span = document.createElement('span');
 span.className = 'field-error api-field-error';
 span.textContent = msg;
 input.insertAdjacentElement('afterend', span);
 // Remove error styling on user input
 input.addEventListener('input', () => {
 input.classList.remove('input-error');
 span.remove();
 }, { once: true });
 });
}

/**
 * Set a button's loading state.
 */
function setButtonLoading(btn, loading, originalText) {
 btn.disabled = loading;
 btn.textContent = loading ? '⏳ Please wait…' : originalText;
}

// Export to window so other scripts can use them
window.TKK = {
 getProducts,
 getProduct,
 getDealers,
 submitEnquiry,
 submitDealerApplication,
 showToast,
 showFieldErrors,
 setButtonLoading,
};
