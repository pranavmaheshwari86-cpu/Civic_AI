const fs = require('fs');
const path = require('path');

const EXCLUDES = ['node_modules', '.git', '.next', 'dist', 'build', 'coverage', 'out', '.cache', 'tmp'];

function generateTree(dir, prefix = '') {
  let output = '';
  const files = fs.readdirSync(dir);
  const filtered = files.filter(f => !EXCLUDES.includes(f));
  
  filtered.forEach((file, index) => {
    const isLast = index === filtered.length - 1;
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    
    output += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
    
    if (stats.isDirectory()) {
      output += generateTree(fullPath, prefix + (isLast ? '    ' : '│   '));
    }
  });
  return output;
}

const tree = '.\n' + generateTree('.');
fs.writeFileSync('FINAL_PROJECT_TREE.md', '```\n' + tree + '\n```\n');
console.log('Tree written to FINAL_PROJECT_TREE.md');
