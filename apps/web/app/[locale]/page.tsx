export default function Home() {
  return (
    <div className="flex-grow pt-[104px] pb-xl flex flex-col gap-xl">
      {/* Hero Section */}
      <section className="max-w-container-max mx-auto w-full px-gutter relative pt-md pb-xl">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-center items-center">
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-primary-fixed/30 to-secondary-fixed/30 blur-3xl opacity-50 absolute top-[-20%] right-[-10%]"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center relative z-10">
          {/* Hero Text */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-xs">
              <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full border border-primary/20 uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">public</span>
                Built for India
              </span>
            </div>
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-surface">
              The Future of <br/>
              <span className="gradient-text">Digital Public Services</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[500px]">
              Empowering every citizen with AI-driven insights, schemes, and seamless governance. Experience the next generation of civic interaction.
            </p>
            <div className="flex flex-wrap items-center gap-sm mt-sm">
              <button className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2">
                Launch Citizen Portal
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
              <button className="bg-transparent text-secondary font-label-md text-label-md px-6 py-3 rounded-lg border border-secondary transition-all duration-300 hover:bg-secondary/5 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">play_circle</span>
                See How it Works
              </button>
            </div>
            {/* Trust Indicators */}
            <div className="mt-lg flex items-center gap-md text-on-surface-variant opacity-70">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-primary">50M+</span>
                <span className="font-label-sm text-label-sm uppercase">Citizens Served</span>
              </div>
              <div className="w-px h-10 bg-outline-variant/50"></div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md text-primary">0.2s</span>
                <span className="font-label-sm text-label-sm uppercase">AI Response Time</span>
              </div>
            </div>
          </div>
          {/* Hero Visual */}
          <div className="relative w-full aspect-square md:aspect-[4/3] flex justify-center items-center ai-aura">
            <div className="w-full h-full glass-panel rounded-[2rem] overflow-hidden relative shadow-2xl p-4 flex items-center justify-center bg-gradient-to-br from-white/60 to-white/20">
              <img 
                className="w-full h-full object-cover rounded-xl" 
                alt="A pristine, glowing AI orb floating organically in a clean, brightly lit, modernist architectural space." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgYISmgxVXv77yGRk9AeyK8lUpOigM2OKjxlxelmik4J2tEJWRivg52zNERz99LNcpDOZSSVNVlWqsL9ZxWhAyVxYxysmnkVwVvQBezc-kcjUGyidtBCUHQDuqk4orOMk0cnSg73A3ccal_chSZ1fatfww3rAcOww1tXr1mM-eVuNVgKP-uswN1vsbUtEUayIXsztyGNVoHZsJsTvBc2YBwxkWmIgh_AciYzwCY1ICO_RjnwxiWLbM" 
                style={{ mixBlendMode: 'multiply' }}
              />
              <div className="absolute top-8 right-8 glass-panel rounded-lg p-3 flex items-center gap-3 animate-pulse shadow-lg">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface">Identity Verified</span>
                  <span className="font-body-md text-[10px] text-on-surface-variant">Instant Aadhaar Sync</span>
                </div>
              </div>
              <div className="absolute bottom-8 left-8 glass-panel rounded-lg p-3 flex items-center gap-3 shadow-lg" style={{ animation: 'pulse-aura 3s ease-in-out infinite alternate-reverse' }}>
                <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface">Scheme Found</span>
                  <span className="font-body-md text-[10px] text-on-surface-variant">PM Kisan Samman</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="max-w-container-max mx-auto w-full px-gutter py-xl">
        <div className="text-center mb-xl max-w-[600px] mx-auto">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">Intelligent Governance</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Seamlessly integrated services designed to reduce friction and bring government closer to you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md auto-rows-[250px]">
          {/* Feature 1: Wide */}
          <div className="md:col-span-2 glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="z-10">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">model_training</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">AI-Powered Schemes</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[400px]">Personalized government scheme recommendations based on your unique profile and eligibility, analyzed in real-time.</p>
            </div>
          </div>
          {/* Feature 2: Square */}
          <div className="glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-surface-container-lowest">
            <div className="z-10">
              <div className="w-12 h-12 rounded-xl bg-[#fff3e0] text-[#e65100] flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-2">Smart Complaints</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant">NLP-driven grievance routing ensures your voice reaches the right official instantly.</p>
            </div>
          </div>
          {/* Feature 3: Square */}
          <div className="glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-surface-container-lowest">
            <div className="z-10">
              <div className="w-12 h-12 rounded-xl bg-[#e3f2fd] text-[#1565c0] flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">fact_check</span>
              </div>
              <h3 className="font-headline-md text-[20px] font-semibold text-on-surface mb-2">Instant Verification</h3>
              <p className="font-body-md text-[14px] text-on-surface-variant">Zero-touch document validation linked securely with national databases.</p>
            </div>
          </div>
          {/* Feature 4: Wide */}
          <div className="md:col-span-2 glass-panel rounded-2xl p-lg flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-surface to-surface-container-low border border-outline-variant/30">
            <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #1a146b 0, #1a146b 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }}></div>
            <div className="z-10 flex flex-col h-full justify-center">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-[24px]">monitoring</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Real-time Analytics</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[400px]">Transparent tracking of application status and civic metrics at your fingertips.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
