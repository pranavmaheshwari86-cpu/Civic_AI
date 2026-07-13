const fs = require('fs');
const path = 'apps/web/app/[locale]/globals.css';

let content = fs.readFileSync(path, 'utf8');

const newRootTokens = `    /* Civic AI Design Tokens */
    --error: #ba1a1a;
    --success: #198754;

    /* ── Track 1: Government/Official (Blue/Neutral) ── */
    --gov-primary: 221 83% 53%;
    --gov-surface: 0 0% 100%;
    --gov-border: 214 32% 91%;
    --gov-text-main: 222 47% 11%;
    --gov-text-muted: 215 16% 47%;
    
    /* ── Track 2: AI Assistant (Indigo to Violet Gradient) ── */
    --ai-indigo: 239 84% 67%;
    --ai-violet: 270 95% 75%;
    --ai-surface: 240 20% 98%;

    /* Keep old tokens for backwards compatibility during migration */
    --secondary-fixed: #dbe1ff;
    --on-tertiary-fixed-variant: #70380b;
    --secondary: #0051d5;
    --on-secondary-fixed-variant: #003ea8;
    --secondary-container: #316bf3;
    --on-tertiary: #ffffff;
    --tertiary-container: #5f2b00;
    --error-container: #ffdad6;
    --tertiary-fixed-dim: #ffb688;
    --on-secondary-fixed: #00174b;
    --secondary-fixed-dim: #b4c5ff;
    --on-secondary: #ffffff;
    --on-tertiary-fixed: #311300;
    --on-primary-fixed-variant: #3e3c8f;
    --on-secondary-container: #fefcff;
    --surface-tint: #5654a8;
    --on-primary-container: #9c9af4;
    --on-primary: #ffffff;
    --on-error: #ffffff;
    --on-error-container: #93000a;
    --primary-container: #312e81;
    --on-tertiary-container: #de915e;
    --tertiary-fixed: #ffdbc7;
    --tertiary: #3e1a00;
    --primary-fixed: #e2dfff;
    --inverse-primary: #c3c0ff;
    --primary: #1a146b;
    --primary-fixed-dim: #c3c0ff;
    --on-primary-fixed: #100563;
`;

const newDarkTokens = `    /* Civic AI Design Tokens */
    --error: #ffb4ab;
    --success: #198754;

    /* ── Track 1: Government/Official Dark ── */
    --gov-primary: 217 91% 60%;
    --gov-surface: 222 47% 11%;
    --gov-border: 215 28% 17%;
    --gov-text-main: 210 40% 98%;
    --gov-text-muted: 215 20% 65%;
    
    /* ── Track 2: AI Assistant Dark ── */
    --ai-indigo: 239 84% 67%;
    --ai-violet: 270 95% 75%;
    --ai-surface: 240 30% 12%;

    /* Keep old tokens for backwards compatibility during migration */
    --secondary-fixed: #dbe1ff;
    --on-tertiary-fixed-variant: #70380b;
    --secondary: #b4c5ff;
    --on-secondary-fixed-variant: #003ea8;
    --secondary-container: #003ea8;
    --on-tertiary: #5f2b00;
    --tertiary-container: #814115;
    --error-container: #93000a;
    --tertiary-fixed-dim: #ffb688;
    --on-secondary-fixed: #00174b;
    --secondary-fixed-dim: #b4c5ff;
    --on-secondary: #002a78;
    --on-tertiary-fixed: #311300;
    --on-primary-fixed-variant: #3e3c8f;
    --on-secondary-container: #dbe1ff;
    --surface-tint: #c3c0ff;
    --on-primary-container: #e2dfff;
    --on-primary: #27247a;
    --on-error: #690005;
    --on-error-container: #ffdad6;
    --primary-container: #3e3c8f;
    --on-tertiary-container: #ffdbc7;
    --tertiary-fixed: #ffdbc7;
    --tertiary: #ffb688;
    --primary-fixed: #e2dfff;
    --inverse-primary: #5654a8;
    --primary: #c3c0ff;
    --primary-fixed-dim: #c3c0ff;
    --on-primary-fixed: #100563;
`;

let newContent = fs.readFileSync(path, 'utf8');
const rootMatch = newContent.match(/:root\s*\{([\s\S]*?)\}/);
if (rootMatch) {
  let rootTokens = rootMatch[1];
  rootTokens = rootTokens.replace(/\/\* Civic AI Design Tokens \*\/[\s\S]*$/, newRootTokens);
  newContent = newContent.replace(rootMatch[1], rootTokens);
}

const darkMatch = newContent.match(/\.dark\s*\{([\s\S]*?)\}/);
if (darkMatch) {
  let darkTokens = darkMatch[1];
  darkTokens = darkTokens.replace(/\/\* Civic AI Design Tokens \*\/[\s\S]*$/, newDarkTokens);
  newContent = newContent.replace(darkMatch[1], darkTokens);
}

const aiGradients = "\n/* AI Gradient Utility */\n@layer utilities {\n  .ai-gradient-bg {\n    background: linear-gradient(135deg, hsl(var(--ai-indigo)), hsl(var(--ai-violet)));\n  }\n  .ai-gradient-text {\n    background: linear-gradient(135deg, hsl(var(--ai-indigo)), hsl(var(--ai-violet)));\n    -webkit-background-clip: text;\n    -webkit-text-fill-color: transparent;\n  }\n}\n";

if (!newContent.includes('ai-gradient-bg')) {
  newContent += aiGradients;
}

fs.writeFileSync(path, newContent);
console.log('Updated globals.css');
