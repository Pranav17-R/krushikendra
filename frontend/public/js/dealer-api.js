// ================================================
// public/js/dealer-api.js
// Handles dealer applications and dynamic loading
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[action="/become-dealer"]');
  if (!form) return; // Only runs on the become-dealer page

  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn ? submitBtn.textContent : 'Submit Application';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear old errors
    TKK.showFieldErrors(form, {});

    const fd = new FormData(form);
    const payload = {
      name: (fd.get('dealerName') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      village: (fd.get('village') || '').trim(),
      shopName: (fd.get('shopName') || '').trim(),
      district: (fd.get('district') || '').trim().toLowerCase(),
      experience: (fd.get('experience') || '').trim(),
      message: (fd.get('message') || '').trim(),
    };

    TKK.setButtonLoading(submitBtn, true, btnText);

    const result = await TKK.submitDealerApplication(payload);

    TKK.setButtonLoading(submitBtn, false, btnText);

    if (result.ok) {
      // Replace form card with success box
      const box = document.createElement('div');
      box.className = 'success-box';
      box.innerHTML = `
        <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
        <h2>Application Submitted!</h2>
        <p>Thank you! Our team will review your application and contact you within 2–3 business days.</p>
        <a href="/" class="btn btn-primary" style="margin-top:1.25rem;">← Back to Home</a>
      `;
      form.closest('.form-card').replaceWith(box);
      TKK.showToast('Dealer application submitted successfully!', 'success');
    } else {
      if (result.errors && Object.keys(result.errors).length > 0) {
        // Map API field name back to form field name (API uses 'name', form uses 'dealerName')
        const mappedErrors = {};
        Object.entries(result.errors).forEach(([k, v]) => {
          mappedErrors[k === 'name' ? 'dealerName' : k] = v;
        });
        TKK.showFieldErrors(form, mappedErrors);
        TKK.showToast('Please fix the highlighted fields.', 'error');
      } else {
        TKK.showToast(result.message || 'Something went wrong. Please try again.', 'error');
      }
    }
  });
});

// --- Dynamic Dealer Grid ---
async function loadDealers() {
  const grid = document.getElementById('api-dealers-grid');
  if (!grid) return; // Only runs on dealers page

  const district = grid.dataset.district || 'all';
  
  try {
    const result = await TKK.getDealers({ district });
    if (!result.ok) throw new Error(result.message || 'Failed to load dealers');

    const dealers = result.data;

    const countEl = document.getElementById('api-result-count');
    if (countEl) countEl.innerHTML = `${dealers.length} dealer${dealers.length !== 1 ? 's' : ''}`;

    if (dealers.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1;">
          <div style="font-size:3rem;">🏬</div>
          <h3>No dealers found</h3>
          <p>Try selecting a different district.</p>
          <a href="/dealers" class="btn btn-primary">Show All</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = dealers.map((d, index) => {
      const verifiedHtml = d.verified ? `<span class="verified-badge" title="Verified">✓</span>` : '';
      const districtLabel = d.district.charAt(0).toUpperCase() + d.district.slice(1);
      const areasHtml = (d.areas || []).map(a => `<span class="area-tag">${a}</span>`).join('');
      const cleanContact = (d.contact || '').replace(/\D/g, '');
      const delayClass = index < 9 ? `delay-${(index % 3) + 1}` : '';

      return `
        <div class="dealer-card ${d.district}-card fade-up ${delayClass}">
          <!-- Premium Watermark -->
          <div class="cat-bg-pattern" style="opacity: 0.05;">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>

          <div class="dealer-card-head">
            <div class="dealer-emoji">${d.emoji || '🏬'}</div>
            <div>
              <div class="dealer-name">${d.name} ${verifiedHtml}</div>
              <div class="dealer-village">${d.village}, ${districtLabel}</div>
            </div>
          </div>
          <div class="dealer-areas">${areasHtml}</div>
          <div class="dealer-info-row">
            <span>📞 ${d.contact}</span>
            <span>Since ${d.since || '2020'}</span>
          </div>
          <div class="dealer-actions">
            <a href="tel:${cleanContact}" class="btn btn-primary btn-sm">Call Now</a>
            <a href="/enquiry?dealer=${encodeURIComponent(d.name)}" class="btn btn-ghost btn-sm">Enquiry</a>
          </div>
        </div>
      `;
    }).join('');

    // Trigger fade-up
    setTimeout(() => {
      grid.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
    }, 50);

    // Fetch total count for stats strip
    if (district !== 'all') {
      const resultAll = await TKK.getDealers();
      if (resultAll.ok) {
        const totalEl = document.getElementById('dstat-total');
        if (totalEl) totalEl.textContent = resultAll.data.length;
      }
    } else {
      const totalEl = document.getElementById('dstat-total');
      if (totalEl) totalEl.textContent = dealers.length;
    }

  } catch (err) {
    grid.innerHTML = `
      <div style="text-align:center;padding:3rem 1rem;color:#ef4444;grid-column:1/-1;">
        <p>⚠ Failed to load dealers: ${err.message}</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', loadDealers);
