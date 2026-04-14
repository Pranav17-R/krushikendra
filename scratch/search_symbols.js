const fs = require('fs');
const path = require('path');

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                searchFiles(fullPath);
            }
        } else {
            if (fullPath.endsWith('.ejs') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes('\ufffd')) {
                    console.log(`Found symbol in: ${fullPath}`);
                }
            }
        }
    });
}

searchFiles('.');
