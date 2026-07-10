"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Search, ShieldCheck, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    title: "Instant Guidance",
    description: "No more searching through confusing portals. Get clear, personalised steps for any government service in plain language.",
    icon: Search,
    href: "/chat",
    delay: 0.3,
  },
  {
    title: "Smart Documents",
    description: "Upload a document or form and get it explained or validated. Know exactly what you need before you go.",
    icon: FileText,
    href: "/chat",
    delay: 0.4,
  },
  {
    title: "Civic Complaints",
    description: "Report civic issues easily. AI routes them to the right department and you get a tracking ID instantly.",
    icon: ShieldCheck,
    href: "/complaints",
    delay: 0.5,
  },
];

const STATS = [
  { value: "10k+", label: "Services Mapped" },
  { value: "24/7", label: "AI Availability" },
  { value: "6", label: "Languages" },
  { value: "< 1s", label: "Avg Response Time" },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 pb-16 px-4">
      {/* Hero Section */}
      <section className="max-w-4xl w-full text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 pb-2 block">
              One AI.
            </span>
            <span className="text-foreground">Every Government Service.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-5 leading-relaxed text-pretty">
            Your Personal AI Government Companion. Describe what you need in plain language and let AI handle the bureaucracy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6"
        >
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-3.5 font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-primary/90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            Talk to AI
          </Link>
          <Link
            href="/schemes"
            className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground border border-border px-8 py-3.5 font-semibold shadow-sm hover:bg-muted transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[44px]"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
            Explore Services
          </Link>
        </motion.div>
      </section>

      {/* Statistics — visible without scroll */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-12 w-full max-w-3xl"
        aria-label="Platform statistics"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-y border-border/40 py-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl font-extrabold text-foreground">{stat.value}</span>
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Feature Cards */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full mt-12"
        aria-label="Key features"
      >
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
            >
              <Link
                href={feature.href}
                className="group flex flex-col gap-4 bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full"
              >
                <div className="p-2.5 bg-primary/10 rounded-xl w-fit">
                  <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold mb-2">{feature.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                  Get started
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
