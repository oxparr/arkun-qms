
const fs = require('fs');
const path = require('path');

// Go up one level from CWD if needed, or assume CWD is frontend
const dir = path.join(__dirname, 'src/components/ui');

if (!fs.existsSync(dir)) {
    console.error("Directory not found:", dir);
    process.exit(1);
}

function walk(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Regex to match imports ending in @version
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
