"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sparkles, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { m as motion, AnimatePresence } from "motion/react";

export function MobileNav() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const p = (path: string) => `/${locale}${path}`;

  const items = [
    { name: "Home", href: p("/dashboard"), icon: LayoutDashboard },
    { name: "AI", href: p("/chat"), icon: Sparkles },
    { name: "Schemes", href: p("/schemes"), icon: FileText },
  ];

  return (
    <motion.nav
      initial={{ y: 64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 flex justify-around items-center h-16 px-gutter z-50 pb-safe"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <motion.div
            key={item.name}
            whileTap={{ scale: 0.82 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="relative flex flex-col items-center"
          >
            <Link
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 pt-1 pb-0.5 transition-colors relative",
                isActive
                  ? "text-secondary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "stroke-2")} />
              <span className="text-[10px] font-label-sm">{item.name}</span>

              {/* Active dot indicator */}
              <AnimatePresence>
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
