const fs = require('fs');
const filePath = 'c:/Users/Pranav/Desktop/Devengers/apps/web/app/[locale]/page.tsx';

let content = fs.readFileSync(filePath, 'utf8');
content = content.replace(/<!--(.*?)-->/g, '{/* $1 */}');

fs.writeFileSync(filePath, content);
console.log('Fixed HTML comments in page.tsx');
