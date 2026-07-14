const fs = require('fs');

let html = `
<!-- TopNavBar -->
<header class="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none transition-all duration-300">
<div class="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
<!-- Brand Logo -->
<div class="flex items-center gap-xs cursor-pointer">
<span class="material-symbols-outlined text-primary" data-weight="fill" style="font-variation-settings: 'FILL' 1;">assured_workload</span>
<span class="text-headline-md font-headline-md font-bold tracking-tight text-primary dark:text-primary-fixed">Civic AI</span>
</div>
<!-- Navigation Links (Desktop) -->
<nav class="hidden md:flex items-center gap-md font-display-lg text-body-md font-body-md">
<a class="text-secondary font-semibold border-b-2 border-secondary pb-1 transition-colors" href="#">Dashboard</a>
<a class="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95" href="#">Schemes</a>
<a class="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95" href="#">Complaints</a>
<a class="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95" href="#">Support</a>
</nav>
<!-- Search & Actions -->
<div class="flex items-center gap-sm">
<!-- Mobile Menu Toggle -->
<button class="md:hidden text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low/50 transition-colors">
<span class="material-symbols-outlined">menu</span>
</button>
<!-- Trailing Icons -->
<div class="hidden sm:flex items-center gap-xs text-primary dark:text-primary-fixed-dim">
<button aria-label="notifications" class="p-2 rounded-full hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button aria-label="account_circle" class="p-2 rounded-full hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</div>
</div>
</header>
<!-- Main Content -->
<main class="flex-grow pt-[104px] pb-xl flex flex-col gap-xl">
<!-- Hero Section -->
<section class="max-w-container-max mx-auto w-full px-gutter relative pt-md pb-xl">
<!-- Background Elements -->
<div class="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
<div class="w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-primary-fixed/30 to-secondary-fixed/30 blur-3xl opacity-50 absolute top-[-20%] right-[-10%]"></div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center relative z-10">
<!-- Hero Text -->
<div class="flex flex-col gap-md">
<div class="flex items-center gap-xs">
<span class="bg-primary/10 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full border border-primary/20 uppercase flex items-center gap-1">
<span class="material-symbols-outlined text-[14px]">public</span>
                            Built for India
                        </span>
</div>
<h1 class="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
                        The Future of <br/>
<span class="gradient-text">Digital Public Services</span>
</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-[500px]">
                        Empowering every citizen with AI-driven insights, schemes, and seamless governance. Experience the next generation of civic interaction.
                    </p>
<div class="flex flex-wrap items-center gap-sm mt-sm">
<button class="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2">
                            Launch Citizen Portal
                            <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
<button class="bg-transparent text-secondary font-label-md text-label-md px-6 py-3 rounded-lg border border-secondary transition-all duration-300 hover:bg-secondary/5 flex items-center gap-2">
<span class="material-symbols-outlined text-[18px]">play_circle</span>
                            See How it Works
                        </button>
</div>
<!-- Trust Indicators -->
<div class="mt-lg flex items-center gap-md text-on-surface-variant opacity-70">
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-primary">50M+</span>
<span class="font-label-sm text-label-sm uppercase">Citizens Served</span>
</div>
<div class="w-px h-10 bg-outline-variant/50"></div>
<div class="flex flex-col">
<span class="font-headline-md text-headline-md text-primary">0.2s</span>
<span class="font-label-sm text-label-sm uppercase">AI Response Time</span>
</div>
</div>
</div>
<!-- Hero Visual -->
<div class="relative w-full aspect-square md:aspect-[4/3] flex justify-center items-center ai-aura">
<div class="w-full h-full glass-panel rounded-[2rem] overflow-hidden relative shadow-2xl p-4 flex items-center justify-center bg-gradient-to-br from-white/60 to-white/20">
<!-- The AI Orb Placeholder / Floating Visual -->
<img class="w-full h-full object-cover rounded-xl" data-alt="A pristine, glowing AI orb floating organically in a clean, brightly lit, modernist architectural space. The orb emits a soft blue and indigo aura. The environment is minimalist, featuring smooth white curves and glass elements, creating a sense of advanced technology serving humanity. High quality, photorealistic, cinematic lighting." src="/upscaled-hero-new-v2.png" style={{ mixBlendMode: 'multiply' }}/>
<!-- Floating UI Elements over image -->
<div class="absolute top-8 right-8 glass-panel rounded-lg p-3 flex items-center gap-3 animate-pulse shadow-lg">
<div class="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
<span class="material-symbols-outlined">verified_user</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">Identity Verified</span>
<span class="font-body-md text-[10px] text-on-surface-variant">Instant Aadhaar Sync</span>
</div>
</div>
<div class="absolute bottom-8 left-8 glass-panel rounded-lg p-3 flex items-center gap-3 shadow-lg" style={{ animation: 'pulse-aura 3s ease-in-out infinite alternate-reverse' }}>
<div class="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
<span class="material-symbols-outlined">description</span>
</div>
<div class="flex flex-col">
<span class="font-label-sm text-label-sm text-on-surface">Scheme Found</span>
<span class="font-body-md text-[10px] text-on-surface-variant">PM Kisan Samman</span>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Features Bento Grid -->
<section class="max-w-container-max mx-auto w-full px-gutter py-xl">
<div class="text-center mb-xl max-w-[600px] mx-auto">
<h2 class="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">Intelligent Governance</h2>
<p class="font-body-lg text-body-lg text-on-surface-variant">Seamlessly integrated services designed to reduce friction and bring government closer to you.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-md auto-rows-[250px]">
<!-- Feature 1: Wide -->
<div class="md:col-span-2 glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
<div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
<div class="z-10">
<div class="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-[24px]">model_training</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">AI-Powered Schemes</h3>
<p class="font-body-md text-body-md text-on-surface-variant max-w-[400px]">Personalized government scheme recommendations based on your unique profile and eligibility, analyzed in real-time.</p>
</div>
</div>
<!-- Feature 2: Square -->
<div class="glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-surface-container-lowest">
<div class="z-10">
<div class="w-12 h-12 rounded-xl bg-[#fff3e0] text-[#e65100] flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-[24px]">chat_bubble</span>
</div>
<h3 class="font-headline-md text-[20px] font-semibold text-on-surface mb-2">Smart Complaints</h3>
<p class="font-body-md text-[14px] text-on-surface-variant">NLP-driven grievance routing ensures your voice reaches the right official instantly.</p>
</div>
</div>
<!-- Feature 3: Square -->
<div class="glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-surface-container-lowest">
<div class="z-10">
<div class="w-12 h-12 rounded-xl bg-[#e3f2fd] text-[#1565c0] flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-[24px]">fact_check</span>
</div>
<h3 class="font-headline-md text-[20px] font-semibold text-on-surface mb-2">Instant Verification</h3>
<p class="font-body-md text-[14px] text-on-surface-variant">Zero-touch document validation linked securely with national databases.</p>
</div>
</div>
<!-- Feature 4: Wide -->
<div class="md:col-span-2 glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-surface to-surface-container-low border border-outline-variant/30">
<div class="absolute bottom-0 right-0 w-1/2 h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1a146b 0, #1a146b 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
<div class="z-10 flex flex-col h-full justify-center">
<div class="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-md">
<span class="material-symbols-outlined text-[24px]">monitoring</span>
</div>
<h3 class="font-headline-md text-headline-md text-on-surface mb-2">Real-time Analytics</h3>
<p class="font-body-md text-body-md text-on-surface-variant max-w-[400px]">Transparent tracking of application status and civic metrics at your fingertips.</p>
</div>
</div>
</div>
</section>
</main>
<!-- Footer Component from JSON -->
<footer class="w-full py-xl mt-xl bg-surface-container-highest dark:bg-surface-container-low border-t border-outline-variant/50 flat no shadows font-body-md text-label-sm font-label-sm text-on-surface-variant dark:text-outline">
<div class="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-md">
<div class="flex flex-col gap-sm">
<span class="font-headline-md text-headline-md text-primary dark:text-primary-fixed font-bold tracking-tight">Civic AI</span>
<p>© 2024 Civic AI (Smart Bharat). Government of India Initiative.</p>
</div>
<div class="flex flex-wrap md:justify-end gap-md">
<a class="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Privacy Policy</a>
<a class="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Terms of Service</a>
<a class="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Accessibility</a>
<a class="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Contact Us</a>
</div>
</div>
</footer>
`;

html = html.replace(/class=/g, 'className=');
html = html.replace(/<br>/g, '<br />');

let reactTemplate = `import Link from "next/link";
import { ThemeToggle } from "../../components/shared/ThemeToggle";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col fractal-pattern">
        ${html}
      </div>
    </>
  );
}
`;

fs.writeFileSync('c:/Users/Pranav/Desktop/Devengers/apps/web/app/[locale]/page.tsx', reactTemplate);
console.log('React component generated successfully!');
