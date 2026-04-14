const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../frontend/views/admin.ejs');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add CSS
const cssTarget = ".sid-badge { margin-left:auto;background:#f59e0b;color:#fff;border-radius:20px;padding:1px 7px;font-size:.65rem;font-weight:700; }";
const cssReplacement = cssTarget + "\n  .sid-item i { width: 18px; height: 18px; opacity: 0.7; }\n  .sid-item.active i { opacity: 1; color: #4caf6f; }\n  .stat-ic i { width: 22px; height: 22px; }";
content = content.replace(cssTarget, cssReplacement);

// 2. Update Sidebar
const sidebarTarget = `<aside class="sidebar">
 <div class="sid-label">Main</div>
 <div class="sid-item active" data-sec="secDash"><span>📊</span><span>Dashboard</span></div>
 <div class="sid-label">Catalogue</div>
 <div class="sid-item" data-sec="secProducts"><span></span><span>Manage Products</span></div>
 <div class="sid-label">Engagement</div>
 <div class="sid-item" data-sec="secEnquiries"><span></span><span>Farmer Enquiries</span><span class="sid-badge" id="badgeEnq" style="display:none"></span></div>
 <div class="sid-item" data-sec="secDealers"><span>🤝</span><span>Dealers</span></div>
 <div class="sid-item" data-sec="secApps"><span>📑</span><span>Dealer Applications</span><span class="sid-badge" id="badgeApp" style="display:none"></span></div>
</aside>`;

const sidebarReplacement = `<aside class="sidebar">
 <div class="sid-label">Main</div>
 <div class="sid-item active" data-sec="secDash"><i data-lucide="layout-dashboard"></i><span>Dashboard</span></div>
 <div class="sid-label">Catalogue</div>
 <div class="sid-item" data-sec="secProducts"><i data-lucide="package"></i><span>Manage Products</span></div>
 <div class="sid-label">Engagement</div>
 <div class="sid-item" data-sec="secEnquiries"><i data-lucide="message-square"></i><span>Farmer Enquiries</span><span class="sid-badge" id="badgeEnq" style="display:none"></span></div>
 <div class="sid-item" data-sec="secDealers"><i data-lucide="users"></i><span>Dealers</span></div>
 <div class="sid-item" data-sec="secApps"><i data-lucide="file-text"></i><span>Dealer Applications</span><span class="sid-badge" id="badgeApp" style="display:none"></span></div>
</aside>`;

// Normalize whitespace for matching
const normalize = s => s.replace(/\s+/g, ' ').trim();
if (normalize(content).includes(normalize(sidebarTarget))) {
    // We need exact match for .replace to work reliably if not using regex
    // So let's use a simpler approach for sidebar
}

// Alternative Sidebar replacement using regex
content = content.replace(/<aside class="sidebar">[\s\S]*?<\/aside>/, sidebarReplacement);

// 3. Update Stats
const statsTargetRegex = /<div class="stats">([\s\S]*?)<\/div>/;
const statsReplacement = `<div class="stats">
 <div class="stat"><div class="stat-ic" style="background:#dcfce7; color:#166534;"><i data-lucide="package"></i></div><div><div class="stat-val"><%= stats.products %></div><div class="stat-lbl">Total Products</div></div></div>
 <div class="stat"><div class="stat-ic" style="background:#dbeafe; color:#1e40af;"><i data-lucide="message-square"></i></div><div><div class="stat-val"><%= stats.enquiries %></div><div class="stat-lbl">Enquiries</div><div class="stat-trend" style="color:#3b82f6;">● 3 new</div></div></div>
 <div class="stat"><div class="stat-ic" style="background:#fef3c7; color:#92400e;"><i data-lucide="users"></i></div><div><div class="stat-val"><%= stats.dealers %></div><div class="stat-lbl">Active Dealers</div></div></div>
 <div class="stat"><div class="stat-ic" style="background:#fee2e2; color:#991b1b;"><i data-lucide="file-text"></i></div><div><div class="stat-val"><%= stats.applications %></div><div class="stat-lbl">Pending Applications</div></div></div>
 </div>`;
content = content.replace(statsTargetRegex, statsReplacement);

// 4. Initialize Lucide
content = content.replace('initProds(); initEnq(); initDealers(); initApps();', 'initProds(); initEnq(); initDealers(); initApps();\n lucide.createIcons();');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Improved admin.ejs symbols with Lucide icons');
