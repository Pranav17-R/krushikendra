// ================================================
// public/js/products-api.js
// Dynamically fetch and render products from the
// REST API — used when you want a fully JS-driven
// product listing (e.g. SPA-style pages or the
// home page featured section).
// ================================================

document.addEventListener('DOMContentLoaded', () => {

 // ── 1. Fetch & render into a container ──────────
 /**
 * Load products from the API and inject them into `containerId`.
 * Options: { filter, search, featured, limit }
 */
 async function loadProducts(containerId, options = {}) {
 const container = document.getElementById(containerId);
 if (!container) return;

 // Loading skeleton
 container.innerHTML = `
 <div style="text-align:center;padding:3rem 1rem;color:#6b7280;">
 <div style="font-size:2.5rem;margin-bottom:.75rem;"></div>
 <p>Loading products…</p>
 </div>`;

 const params = {};
 if (options.filter && options.filter !== 'all') params.filter = options.filter;
 if (options.search) params.search = options.search;
 if (options.featured) params.featured = 'true';
 if (options.limit) params.limit = options.limit;

 const result = await TKK.getProducts(params);

 if (!result.ok) {
 container.innerHTML = `<p style="color:#991b1b;text-align:center;">
 ⚠ Could not load products. ${result.message || ''}
 </p>`;
 return;
 }

 let products = result.data || [];

 if (options.exclude) {
 products = products.filter(p => String(p._id) !== String(options.exclude));
 }

 if (products.length === 0) {
 container.innerHTML = `
 <div class="empty-state">
 <div style="font-size:3rem;"></div>
 <h3>No products found</h3>
 <p>Try a different search or filter.</p>
 <a href="/products" class="btn btn-primary">Clear Filters</a>
 </div>`;
 return;
 }

 // Render product cards matching the existing EJS card style
 container.innerHTML = products.map(p => `
 <div class="product-card fade-in">
   <div class="product-img-wrap" style="padding: 0; position: relative; overflow: hidden; height: 180px;">
     ${p.image ? `<img src="${p.image}" alt="${escHtml(p.name)}" class="product-img">` : generateDynamicSVG(p.name)}
     <span class="product-cat-badge">${p.categoryLabel || p.category}</span>
     <span class="stock-badge ${stockClass(p.stock)}">${p.stock || 'In Stock'}</span>
   </div>
   <div class="product-body">
     <h3 class="product-name">${escHtml(p.name)}</h3>
     <p class="product-desc">${p.description.length > 80 ? escHtml(p.description.substring(0, 80)) + '...' : escHtml(p.description)}</p>
     <div class="product-tags">
       ${(p.tags || []).slice(0, 2).map(t => `<span class="tag">${escHtml(t)}</span>`).join('')}
     </div>
     ${p.price ? `<p class="product-price">₹${p.price.toLocaleString('en-IN')}</p>` : ''}
     <div class="product-actions">
       <a href="/enquiry?product=${encodeURIComponent(p.name)}" class="btn btn-primary btn-sm">Enquire</a>
       <a href="/products/${p.slug}" class="btn btn-ghost btn-sm">Details →</a>
     </div>
   </div>
 </div>
 `).join('');

 // Re-observe fade-in elements
 const observer = new IntersectionObserver((entries) => {
 entries.forEach(el => {
 if (el.isIntersecting) { el.target.classList.add('visible'); observer.unobserve(el.target); }
 });
 }, { threshold: 0.1 });
 container.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

 // Update result count if element exists
 const countEl = document.querySelector('[data-product-count]');
 if (countEl) countEl.textContent = `${result.total || products.length} product${result.total !== 1 ? 's' : ''}`;
 }

 // ── 2. Live search + filter bar wiring ──────────
 function wireFilterBar(containerId) {
 const searchInput = document.querySelector('[data-api-search]');
 const filterLinks = document.querySelectorAll('[data-api-filter]');

 let currentFilter = 'all';
 let searchTimeout;

 filterLinks.forEach(link => {
 link.addEventListener('click', (e) => {
 e.preventDefault();
 filterLinks.forEach(l => l.classList.remove('active'));
 link.classList.add('active');
 currentFilter = link.dataset.apiFilter;
 loadProducts(containerId, { filter: currentFilter, search: searchInput?.value });
 });
 });

 if (searchInput) {
 searchInput.addEventListener('input', () => {
 clearTimeout(searchTimeout);
 searchTimeout = setTimeout(() => {
 loadProducts(containerId, { filter: currentFilter, search: searchInput.value });
 }, 400); // 400ms debounce
 });
 }
 }

 // ── 3. Auto-init ────────────────────────────────

 // API-driven product grid: add id="api-products-grid" to your container
 const apiGrid = document.getElementById('api-products-grid');
 if (apiGrid) {
 const initFilter = apiGrid.dataset.filter || 'all';
 const initFeatured = apiGrid.dataset.featured === 'true';
 const initLimit = apiGrid.dataset.limit || undefined;
 loadProducts('api-products-grid', { filter: initFilter, featured: initFeatured, limit: initLimit });
 wireFilterBar('api-products-grid');
 }

 // Featured section on home page: add id="api-featured-grid"
 const featuredGrid = document.getElementById('api-featured-grid');
 if (featuredGrid) {
 loadProducts('api-featured-grid', { featured: true, limit: 6 });
 }

 // Related products section on product page: add id="api-related-products"
 const relatedGrid = document.getElementById('api-related-products');
 if (relatedGrid) {
 const category = relatedGrid.dataset.category || '';
 const exclude = relatedGrid.dataset.exclude || '';
 loadProducts('api-related-products', { filter: category, limit: 4, exclude });
 }

 // Expose for manual use
 window.TKK.loadProducts = loadProducts;
});

// ── Utility helpers ──────────────────────────────
function stockClass(stock) {
 if (stock === 'Out of Stock') return 'stock-out';
 if (stock === 'Low Stock') return 'stock-low';
 return 'stock-in';
}

function escHtml(str) {
 if (!str) return '';
 return String(str)
 .replace(/&/g, '&amp;').replace(/</g, '&lt;')
 .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateDynamicSVG(seedStr) {
  if (!seedStr) seedStr = "Product";
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    ['#E8F5E9', '#A5D6A7', '#4CAF50'], // Organic/Green
    ['#E3F2FD', '#90CAF9', '#2196F3'], // Chemical/Blue
    ['#FFF8E1', '#FFE082', '#FF9800'], // Crop/Orange
    ['#F3E5F5', '#CE93D8', '#9C27B0'], // Pesticide/Purple
    ['#EFEBE9', '#BCAAA4', '#795548']  // Soil/Brown
  ];
  const colorSet = colors[Math.abs(hash) % colors.length];
  
  // Abstract shape options (leaves, abstract drops, grids)
  const shapes = [
    `<path fill="url(#grad)" d="M50 0C50 0 100 50 100 100C50 100 0 50 0 0Z" transform="translate(10, 10) scale(0.8) rotate(45)"/>`,
    `<circle cx="50" cy="50" r="40" fill="url(#grad)" opacity="0.8"/> <circle cx="70" cy="50" r="20" fill="${colorSet[2]}" opacity="0.4"/>`,
    `<path fill="url(#grad)" d="M0 100 Q 50 0 100 100 Z"/><path fill="${colorSet[2]}" d="M20 100 Q 50 40 80 100 Z" opacity="0.3"/>`,
    `<rect x="20" y="20" width="60" height="60" rx="15" fill="url(#grad)" transform="rotate(${(hash%180)} 50 50)"/>`
  ];
  
  const selectedShape = shapes[Math.abs(hash) % shapes.length];

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style="display:block; background:${colorSet[0]};">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colorSet[1]}" />
          <stop offset="100%" stop-color="${colorSet[2]}" />
        </linearGradient>
      </defs>
      ${selectedShape}
    </svg>
  `;
}
