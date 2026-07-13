"use client";

import { motion } from "framer-motion";
import { Settings, PlayCircle, Users, Clock, ArrowRight, Bell, User } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#f4f6fc] selection:bg-[#4f80ff] selection:text-white">
      {/* Soft premium background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#f2f4fc] via-[#f7f8fd] to-[#f4f6fc]" />
      
      {/* Upscaled Hero Image (Masked) */}
      <div className="absolute top-0 right-0 w-[100vw] lg:w-[65vw] h-full z-0 pointer-events-none flex items-center justify-end mix-blend-normal">
        <Image 
          src="/upscaled-hero-new.png" 
          alt="Glowing 3D Orb" 
          fill
          className="object-cover object-right opacity-100"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 45%, black 65%), linear-gradient(to bottom, transparent 0%, transparent 12%, black 20%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 45%, black 65%), linear-gradient(to bottom, transparent 0%, transparent 12%, black 20%)',
            maskComposite: 'intersect',
            WebkitMaskComposite: 'source-in'
          }}
          priority
        />
      </div>

      {/* Floating Header */}
      <header className="absolute top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
        <div className="w-full max-w-[1400px] h-[72px] flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-[28px] leading-none text-[#12122b]">🏛️</span>
              <span className="font-heading font-bold text-[22px] tracking-tight text-[#12122b]">Civic AI</span>
            </a>
          </div>
          
          <nav className="hidden md:flex items-center gap-[40px] text-[15px] font-semibold text-[#5a5a72] absolute left-1/2 -translate-x-1/2">
            <a href="/dashboard" className="hover:text-[#12122b] transition-colors">Dashboard</a>
            <a href="/schemes" className="hover:text-[#12122b] transition-colors">Schemes</a>
            <a href="/complaints" className="hover:text-[#12122b] transition-colors">Complaints</a>
            <a href="/support" className="hover:text-[#12122b] transition-colors">Support</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 flex items-center justify-center text-[#5a5a72] hover:text-[#12122b] hover:bg-[#e4ebfc] rounded-full transition-colors" aria-label="Notifications">
              <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-[#5a5a72] hover:text-[#12122b] hover:bg-[#e4ebfc] rounded-full transition-colors" aria-label="User Profile">
              <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto min-h-screen flex items-center px-8 md:px-16 pt-[120px] pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full h-full items-center">
          
          {/* Left Column - Hero Content */}
          <motion.div 
            className="flex flex-col items-start w-full max-w-[640px]"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-[10px] rounded-full bg-gradient-to-r from-[#eef2fa] to-[#e4ebfc] border border-white/60 shadow-[0_4px_20px_rgba(100,120,180,0.1)] backdrop-blur-md">
                <Settings className="w-4 h-4 text-[#4f80ff] animate-[spin_4s_linear_infinite]" />
                <span className="text-[13px] font-bold text-[#12122b] tracking-wider uppercase">Built for India</span>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.h1 variants={itemVariants} className="text-[64px] md:text-[86px] leading-[1.05] font-heading font-extrabold tracking-[-0.03em] text-[#12122b] mb-6">
              The Future of <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5a32fa] via-[#4f80ff] to-[#4690ff]">
                Digital Public
              </span> <br />
              Services
            </motion.h1>

            {/* Paragraph */}
            <motion.p variants={itemVariants} className="text-[18px] md:text-[20px] leading-[1.6] text-[#5a5a72] max-w-[540px] mb-12 font-medium">
              Empowering every citizen with AI-driven insights, schemes, and seamless governance. Experience the next generation of civic interaction.
            </motion.p>

            {/* Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 mb-16 w-full sm:w-auto">
              <button className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 h-[60px] bg-gradient-to-b from-[#3a35e8] to-[#1e19d6] hover:from-[#433df2] hover:to-[#2823e2] text-white rounded-[20px] text-[17px] font-semibold transition-all duration-300 shadow-[0_8px_30px_rgba(58,53,232,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:shadow-[0_12px_40px_rgba(58,53,232,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:-translate-y-[2px]">
                Launch Citizen Portal
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              
              <button className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 h-[60px] bg-white/40 hover:bg-white/70 backdrop-blur-xl border border-white/60 text-[#12122b] rounded-[20px] text-[17px] font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-[2px]">
                <PlayCircle className="w-5 h-5 text-[#3a35e8]" />
                See How it Works
              </button>
            </motion.div>

            {/* Statistics */}
            <motion.div variants={itemVariants} className="w-full">
              <div className="flex items-center gap-8 px-8 py-6 rounded-[28px] bg-[#fdfdff] border border-white shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-[#eef2fa] flex items-center justify-center text-[#3a35e8]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[24px] font-extrabold text-[#12122b] leading-tight">50M+</div>
                    <div className="text-[12px] font-bold text-[#8888a0] uppercase tracking-wider">Citizens Served</div>
                  </div>
                </div>
                
                <div className="w-[1px] h-12 bg-black/5" />
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[16px] bg-[#eef2fa] flex items-center justify-center text-[#3a35e8]">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[24px] font-extrabold text-[#12122b] leading-tight">0.2s</div>
                    <div className="text-[12px] font-bold text-[#8888a0] uppercase tracking-wider">AI Response Time</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column Spacer */}
          <div className="hidden lg:block w-full h-full" />
          
        </div>
      </div>
    </main>
  );
}
