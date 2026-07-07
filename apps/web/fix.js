const fs = require('fs');

let css = fs.readFileSync('app/globals.css', 'utf8');
css = css.replace(/oklch\((.*?)\)/g, '$1');
fs.writeFileSync('app/globals.css', css);

let tw = fs.readFileSync('tailwind.config.ts', 'utf8');
tw = tw.replace(/var\(--([a-zA-Z0-9-]+)\)/g, 'oklch(var(--$1) / <alpha-value>)');
fs.writeFileSync('tailwind.config.ts', tw);
