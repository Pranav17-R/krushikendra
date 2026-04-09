// ================================================
//  TRISHUL KRUSHI KENDRA – main.js
//  Shared navigation, scroll effects, animations
// ================================================

/* ── Navbar scroll shadow ─────────────────────── */
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ── Mobile nav toggle (.nav-toggle / .nav-links) */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
const navCta    = document.querySelector('.nav-cta');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.textContent = isOpen ? '✕' : '☰';
    // Show/hide CTA in mobile dropdown as well
    if (navCta) navCta.style.display = isOpen ? 'flex' : '';
  });

  // Close on any nav link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.textContent = '☰';
    }
  });
}

/* ── Scroll-to-top button ────────────────────── */
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Intersection Observer – fade-in ─────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ── Animated field rows in hero ─────────────── */
(function buildFieldRows() {
  const fieldEl = document.getElementById('fieldRows');
  if (!fieldEl) return;
  const rows = 5;
  const emojis = ['🌾', '🌿', '🌱'];
  for (let r = 0; r < rows; r++) {
    const row = document.createElement('div');
    row.style.cssText = `
      display:flex; gap:0.8rem; opacity:${0.06 + r * 0.04};
      margin-bottom:4px; animation: scrollField ${8 + r * 2}s linear infinite;
      animation-delay: -${r * 1.5}s;
    `;
    for (let c = 0; c < 24; c++) {
      const span = document.createElement('span');
      span.textContent = emojis[c % emojis.length];
      span.style.fontSize = `${0.9 + r * 0.15}rem`;
      row.appendChild(span);
    }
    fieldEl.appendChild(row);
  }
  // Add keyframe if not already present
  if (!document.getElementById('fieldKeyframe')) {
    const style = document.createElement('style');
    style.id = 'fieldKeyframe';
    style.textContent = `
      @keyframes scrollField {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);
  }
})();

/* ── Product filter search (client-side hint) ─ */
const searchInput = document.querySelector('.search-input');
if (searchInput) {
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchInput.closest('form')?.submit();
    }, 600);
  });
}

/* ── Enquiry page: category tile → preselect ── */
document.querySelectorAll('.cat-tile input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const productSelect = document.getElementById('product');
    if (!productSelect) return;
    // Just visually highlight, real filter via select
  });
});

/* ── Remove input-error on focus ─────────────── */
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => el.classList.remove('input-error'));
  el.addEventListener('focus', () => el.classList.remove('input-error'));
});
