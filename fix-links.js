import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.astro')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let replaced = false;

    if (/import\.meta\.env\.BASE_URL\}(projects|blog|#|favicon\.svg)/.test(content)) {
        content = content.replace(/import\.meta\.env\.BASE_URL\}(projects|blog|#|favicon\.svg)/g, 'import.meta.env.BASE_URL}/$1');
        replaced = true;
    }

    if (replaced) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed:', file);
    }
});
