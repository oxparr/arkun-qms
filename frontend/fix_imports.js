
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/ui');

function walk(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            const newContent = content.replace(/from "([^"]+)@\d+\.\d+\.\d+"/g, 'from "$1"');
            if (content !== newContent) {
                console.log(`Fixing ${file}`);
                fs.writeFileSync(fullPath, newContent);
            }
        }
    }
}

walk(dir);
console.log('Done fixing imports.');
