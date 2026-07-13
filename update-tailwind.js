const fs = require('fs');

const path = 'apps/web/tailwind.config.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace boxShadow
const newBoxShadow = `boxShadow: {
        "elevation-resting": "0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 4px -1px rgba(15, 23, 42, 0.02)",
        "elevation-hover": "0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)",
        "elevation-floating": "0 16px 40px -8px rgba(15, 23, 42, 0.12), 0 8px 20px -4px rgba(15, 23, 42, 0.06)",
        "elevation-modal": "0 24px 64px -12px rgba(15, 23, 42, 0.16), 0 12px 32px -6px rgba(15, 23, 42, 0.08)",
        "premium": "0 4px 20px -2px rgba(14, 16, 61, 0.05)",
        "ambient": "0 12px 34px -10px rgba(15, 23, 42, 0.08)",
        "glow": "0 0 20px rgba(37, 99, 235, 0.2)",
      }`;
content = content.replace(/boxShadow:\s*\{[\s\S]*?\},/, newBoxShadow + ',');

// Replace spacing
const newSpacing = `spacing: {
        "2xs": "4px",
        "xs": "8px",
        "sm": "16px",
        "md": "24px",
        "lg": "32px",
        "xl": "48px",
        "2xl": "64px",
        "gutter": "24px",
        "base": "4px",
        "container-max": "1280px"
      }`;
content = content.replace(/spacing:\s*\{[\s\S]*?\},/, newSpacing + ',');

// Replace fontFamily
const newFontFamily = `fontFamily: {
        "display": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body": ["var(--font-inter)", "Inter", "sans-serif"],
        // Retain old for backwards compatibility during migration
        "display-lg": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "headline-lg-mobile": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "body-md": ["var(--font-inter)", "Inter", "sans-serif"],
        "body-lg": ["var(--font-inter)", "Inter", "sans-serif"],
        "label-sm": ["var(--font-inter)", "Inter", "sans-serif"],
        "headline-md": ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        "label-md": ["var(--font-inter)", "Inter", "sans-serif"]
      }`;
content = content.replace(/fontFamily:\s*\{[\s\S]*?\},/, newFontFamily + ',');

// Replace fontSize
const newFontSize = `fontSize: {
        "display": ["56px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        // Retain old
        "display-lg": ["64px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "headline-lg": ["40px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-sm": ["12px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "label-md": ["14px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }]
      }`;
content = content.replace(/fontSize:\s*\{[\s\S]*?\}/, newFontSize);

fs.writeFileSync(path, content);
console.log('Updated tailwind.config.ts');
