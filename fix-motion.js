const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

walkDir('apps/web', (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes('from "framer-motion"') || content.includes("from 'framer-motion'") ||
      content.includes('from "motion/react"') || content.includes("from 'motion/react'")) {
    
    const originalContent = content;

    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"](framer-motion|motion\/react)['"]/g, (match, p1, p2) => {
      let inner = p1;
      
      inner = inner.replace(/\bLazyMotion\b\s*,?/g, '').replace(/\bdomAnimation\b\s*,?/g, '');
      
      inner = inner.replace(/,\s*,/g, ',').replace(/,\s*$/, '').trim();
      
      if (/\bmotion\b/.test(inner)) {
        inner = inner.replace(/\bmotion\b/, 'm as motion');
      }
      
      inner = inner.replace(/,\s*$/g, '').replace(/^\s*,/g, '');
      if (inner.endsWith(',')) inner = inner.slice(0, -1);
      
      return `import { ${inner} } from "${p2}"`;
    });
    
    if (content.includes('<LazyMotion') && !filePath.replace(/\\/g, '/').includes('providers.tsx')) {
        content = content.replace(/<LazyMotion[^>]*>/g, '<>');
        content = content.replace(/<\/LazyMotion>/g, '</>');
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
