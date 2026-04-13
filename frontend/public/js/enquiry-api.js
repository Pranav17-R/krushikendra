// ================================================
// public/js/enquiry-api.js
// Intercepts the enquiry form and submits via
// the REST API instead of a full page POST.
// ================================================

document.addEventListener('DOMContentLoaded', () => {
 const form = document.querySelector('form[action="/enquiry"]');
 if (!form) return; // Only runs on the enquiry page

 const submitBtn = form.querySelector('button[type="submit"]');
 const btnText = submitBtn ? submitBtn.textContent : ' Submit Enquiry';
 const successBox = document.querySelector('.success-box');

 form.addEventListener('submit', async (e) => {
 e.preventDefault(); // Stop traditional POST

 // Clear old errors
 TKK.showFieldErrors(form, {});

 // Collect form data
 const fd = new FormData(form);
 const payload = {
 name: (fd.get('name') || '').trim(),
 phone: (fd.get('phone') || '').trim(),
 village: (fd.get('village') || '').trim(),
 product: (fd.get('product') || '').trim(),
 crop: (fd.get('crop') || '').trim(),
 message: (fd.get('message') || '').trim(),
 };

 // Loading state
 TKK.setButtonLoading(submitBtn, true, btnText);

 const result = await TKK.submitEnquiry(payload);

 TKK.setButtonLoading(submitBtn, false, btnText);

 if (result.ok) {
 // Show success UI — replace form with success box if it exists
 if (successBox) {
 form.closest('.form-card').style.display = 'none';
 successBox.style.display = 'block';
 } else {
 // Fallback: inject a success box above the form
 const box = document.createElement('div');
 box.className = 'success-box';
 box.innerHTML = `
 <div style="font-size:3rem;margin-bottom:1rem;"></div>
 <h2>Enquiry Submitted!</h2>
 <p>Thank you! Our team will contact you within 24 hours.</p>
 <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap;justify-content:center;">
 <a href="/enquiry" class="btn btn-ghost btn-sm">New Enquiry</a>
 <a href="/products" class="btn btn-ghost btn-sm">Browse Products</a>
 </div>
 `;
 form.closest('.form-card').replaceWith(box);
 }
 TKK.showToast('Enquiry submitted! We will call you back within 24 hours.', 'success');
 form.reset();
 } else {
 // Show field errors or a generic toast
 if (result.errors && Object.keys(result.errors).length > 0) {
 TKK.showFieldErrors(form, result.errors);
 TKK.showToast('Please fix the errors below.', 'error');
 } else {
 TKK.showToast(result.message || 'Something went wrong. Please try again.', 'error');
 }
 }
 });

 // Load products for dropdown
 loadProductsDropdown();
});

async function loadProductsDropdown() {
 const select = document.getElementById('product');
 if (!select) return;

 const preselect = select.dataset.preselect || '';
 const formPreselect = select.dataset.formProduct || '';
 const targetVal = preselect || formPreselect;

 try {
 const result = await TKK.getProducts();
 
 if (result.ok && result.data) {
 const options = result.data.map(p => {
 const isSelected = (p.name === targetVal) ? 'selected' : '';
 return `<option value="${p.name}" ${isSelected}>${p.emoji || ''} ${p.name} (${p.categoryLabel})</option>`;
 });
 select.innerHTML = '<option value="">— Select a product —</option>' + options.join('') + '<option value="Other">Other / Not Listed</option>';
 } else {
 select.innerHTML = '<option value="">— Failed to load —</option><option value="Other">Other / Not Listed</option>';
 }
 } catch (err) {
 select.innerHTML = '<option value="">— Error loading products —</option><option value="Other">Other / Not Listed</option>';
 }
}
