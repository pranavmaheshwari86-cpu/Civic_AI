const fs = require('fs');

const configPath = 'c:/Users/Pranav/Desktop/Devengers/apps/web/tailwind.config.ts';
let config = fs.readFileSync(configPath, 'utf8');

const newColors = `
        "secondary-fixed": "#dbe1ff",
        "on-tertiary-fixed-variant": "#70380b",
        "on-secondary-fixed-variant": "#003ea8",
        "surface-variant": "#e5e1e9",
        "secondary-container": "#316bf3",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#5f2b00",
        "error-container": "#ffdad6",
        "on-background": "#1b1b21",
        "surface": "#fcf8ff",
        "on-surface": "#1b1b21",
        "tertiary-fixed-dim": "#ffb688",
        "on-secondary-fixed": "#00174b",
        "outline-variant": "#c8c5d3",
        "outline": "#777682",
        "surface-container-low": "#f6f2fa",
        "surface-container-highest": "#e5e1e9",
        "secondary-fixed-dim": "#b4c5ff",
        "on-secondary": "#ffffff",
        "on-tertiary-fixed": "#311300",
        "on-primary-fixed-variant": "#3e3c8f",
        "on-secondary-container": "#fefcff",
        "surface-tint": "#5654a8",
        "inverse-surface": "#303036",
        "on-primary-container": "#9c9af4",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "primary-container": "#312e81",
        "inverse-on-surface": "#f3eff7",
        "on-tertiary-container": "#de915e",
        "surface-container": "#f0ecf4",
        "tertiary-fixed": "#ffdbc7",
        "surface-dim": "#dcd9e0",
        "on-surface-variant": "#474651",
        "primary-fixed": "#e2dfff",
        "inverse-primary": "#c3c0ff",
        "surface-container-lowest": "#ffffff",
        "primary-fixed-dim": "#c3c0ff",
        "surface-bright": "#fcf8ff",
        "surface-container-high": "#eae7ef",
        "on-primary-fixed": "#100563",
`;

const newSpacing = `
        "gutter": "24px",
        "base": "4px",
        "md": "24px",
        "sm": "16px",
        "xl": "64px",
        "xs": "8px",
        "lg": "40px",
        "container-max": "1280px",
`;

const newFonts = `
        "display-lg": ["var(--font-plus-jakarta)", "sans-serif"],
        "headline-lg": ["var(--font-plus-jakarta)", "sans-serif"],
        "headline-lg-mobile": ["var(--font-plus-jakarta)", "sans-serif"],
        "body-md": ["var(--font-inter)", "sans-serif"],
        "body-lg": ["var(--font-inter)", "sans-serif"],
        "label-sm": ["var(--font-inter)", "sans-serif"],
        "headline-md": ["var(--font-plus-jakarta)", "sans-serif"],
        "label-md": ["var(--font-inter)", "sans-serif"],
`;

config = config.replace('colors: {', 'colors: {\n' + newColors);
config = config.replace('spacing: {', 'spacing: {\n' + newSpacing);

if (config.includes('spacing: {')) {
  // It already had spacing
} else {
  config = config.replace('extend: {', 'extend: {\n      spacing: {\n' + newSpacing + '\n      },');
}

config = config.replace('fontFamily: {', 'fontFamily: {\n' + newFonts);

fs.writeFileSync(configPath, config);
console.log('Updated tailwind.config.ts');
