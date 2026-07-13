"use client";

import { AnimatePresence, m as motion } from "motion/react";
import { usePathname } from "next/navigation";

/**
 * PageTransition — wraps page content with a subtle fade + slide-up entry.
 * Usage: wrap the `{children}` in any layout with <PageTransition>.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
