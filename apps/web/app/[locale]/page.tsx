"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Search, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-20 pb-16 px-4">
      {/* Hero Section */}
      <section className="max-w-4xl text-center space-y-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 pb-2">
            One AI.<br className="md:hidden" /> Every Government Service.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Your Personal AI Government Companion. Describe what you need in plain language, and let AI handle the bureaucracy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
        >
          <Link
            href="/chat"
            className="rounded-full bg-primary text-primary-foreground px-8 py-4 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Talk to AI
          </Link>
          <Link
            href="/schemes"
            className="rounded-full bg-secondary text-secondary-foreground border border-border px-8 py-4 font-semibold shadow-sm hover:bg-muted transition-all flex items-center gap-2"
          >
            <Search className="w-5 h-5" />
            Explore Services
          </Link>
        </motion.div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mt-24">
        {[
          {
            title: "Instant Guidance",
            description: "No more searching through confusing portals. Get clear, personalized steps instantly.",
            icon: <Search className="w-8 h-8 text-blue-500" />,
            delay: 0.3
          },
          {
            title: "Smart Documents",
            description: "Upload a document or form and get it explained or validated in plain language.",
            icon: <FileText className="w-8 h-8 text-green-500" />,
            delay: 0.4
          },
          {
            title: "Civic Complaints",
            description: "Report issues easily. AI routes them to the right department automatically.",
            icon: <ShieldCheck className="w-8 h-8 text-orange-500" />,
            delay: 0.5
          }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: feature.delay }}
            className="bg-card text-card-foreground border border-border/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm bg-white/50 dark:bg-black/20 flex flex-col gap-4 hover:border-primary/50 transition-colors"
          >
            <div className="p-3 bg-muted rounded-xl w-fit">{feature.icon}</div>
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Animated Statistics */}
      <section className="mt-24 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-border/40 py-12"
        >
          {[
            { value: "10k+", label: "Services Mapped" },
            { value: "24/7", label: "AI Availability" },
            { value: "6", label: "Languages" },
            { value: "< 1s", label: "Avg Response Time" }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-4xl font-extrabold text-foreground">{stat.value}</span>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
