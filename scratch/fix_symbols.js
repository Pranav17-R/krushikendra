const fs = require('fs');
const path = require('path');

function fixFile(relativeFile, replacements) {
    const filePath = path.join(__dirname, '..', relativeFile);
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(r => {
        content = content.split(r.target).join(r.replacement);
    });
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${relativeFile} symbols`);
}

// admin.ejs
fixFile('frontend/views/admin.ejs', [
    { target: '<div class="avatar">\ufffd</div>', replacement: '<div class="avatar">👤</div>' },
    { target: '<span>\ufffd</span><span>Dashboard</span>', replacement: '<span>📊</span><span>Dashboard</span>' },
    { target: '<span>\ufffd</span><span>Dealers</span>', replacement: '<span>🤝</span><span>Dealers</span>' },
    { target: '<span>\ufffd</span><span>Dealer Applications</span>', replacement: '<span>📑</span><span>Dealer Applications</span>' },
    { target: '<div class="stat-ic" style="background:#fef3c7">\ufffd</div>', replacement: '<div class="stat-ic" style="background:#fef3c7">🏢</div>' },
    { target: '<div class="stat-ic" style="background:#fee2e2">\ufffd</div>', replacement: '<div class="stat-ic" style="background:#fee2e2">📂</div>' },
    { target: '<span class="acard-title">\ufffd Dealer Applications</span>', replacement: '<span class="acard-title">📑 Dealer Applications</span>' },
    { target: '<div class="fchip" data-ef="new">\ufffd New</div>', replacement: '<div class="fchip" data-ef="new">✨ New</div>' },
    { target: '<div class="fchip" data-ef="seen">\ufffd Seen</div>', replacement: '<div class="fchip" data-ef="seen">👁️ Seen</div>' },
    { target: '<div class="fchip" data-ef="replied">\ufffd Replied</div>', replacement: '<div class="fchip" data-ef="replied">💬 Replied</div>' },
    { target: 'onclick="saveProduct()">\ufffd Save Product', replacement: 'onclick="saveProduct()">💾 Save Product' },
    { target: 'onclick="sendEnqReply()">\ufffd Send Reply', replacement: 'onclick="sendEnqReply()">📤 Send Reply' },
    { target: ".textContent = '\ufffd Save Product'", replacement: ".textContent = '💾 Save Product'" },
    { target: 'onclick="openEnqModal(${e._i})">\ufffd Reply', replacement: 'onclick="openEnqModal(${e._i})">💬 Reply' },
    { target: "sendBtn.textContent='\ufffd Send Reply'", replacement: "sendBtn.textContent='📤 Send Reply'" }
]);

// dealers.ejs
fixFile('frontend/views/dealers.ejs', [
    { target: 'font-size:2.5rem;margin-bottom:.75rem;">\ufffd</div>', replacement: 'font-size:2.5rem;margin-bottom:.75rem;">🏬</div>' },
    { target: 'font-size:2.5rem;margin-bottom:1rem;">\ufffd</div>', replacement: 'font-size:2.5rem;margin-bottom:1rem;">🤝</div>' },
    { target: '"> \ufffd Pune</a>', replacement: '"> Pune</a>' }, // If it's a broken char before Pune
    { target: '"> \ufffd Nashik</a>', replacement: '"> Nashik</a>' },
    { target: '"> \ufffd Ahmednagar</a>', replacement: '"> Ahmednagar</a>' }
]);

// Handle remaining \ufffd in strings
const searchFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') searchFiles(fullPath);
        } else if (fullPath.endsWith('.ejs') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('\ufffd')) {
                // Simple replacement if still present
                content = content.replace(/\ufffd/g, ''); 
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Removed remaining symbols in: ${fullPath}`);
            }
        }
    });
}
searchFiles(path.join(__dirname, '../frontend/views'));
searchFiles(path.join(__dirname, '../backend'));
