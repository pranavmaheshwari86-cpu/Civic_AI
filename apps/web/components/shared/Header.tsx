"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { Menu, X, ShieldCheck, MessageSquare, BookOpen, AlertCircle, Home, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/chat", label: "AI Assistant", icon: MessageSquare },
  { href: "/schemes", label: "Government Services", icon: BookOpen },
  { href: "/complaints", label: "Complaints", icon: AlertCircle },
  { href: "/track", label: "Track Complaint", icon: MapPin },
];

export function Header() {
  const pathname = usePathname();
  const { accessToken } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Trap focus inside drawer when open; close on Escape
  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Move focus into drawer
    const firstFocusable = drawerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    firstFocusable?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    // Strip locale prefix for comparison
    const stripped = pathname.replace(/^\/(en|hi)/, "") || "/";
    if (href === "/") return stripped === "/";
    return stripped.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" />
              <span className="font-bold text-xl tracking-tight text-primary">CivicAI</span>
            </Link>

            {/* Desktop Nav */}
            <nav
              aria-label="Main navigation"
              className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground ml-4"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive(link.href) && "text-foreground bg-muted font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {accessToken && (
                <Link
                  href="/admin"
                  aria-current={isActive("/admin") ? "page" : undefined}
                  className={cn(
                    "px-3 py-1.5 rounded-md hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive("/admin") && "text-foreground bg-muted font-semibold"
                  )}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              className="md:hidden p-2 rounded-md hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed top-14 right-0 bottom-0 z-50 w-72 bg-background border-l border-border shadow-xl md:hidden transition-transform duration-300 ease-in-out flex flex-col",
          mobileOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
      >
        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
          {accessToken && (
            <Link
              href="/admin"
              aria-current={isActive("/admin") ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive("/admin")
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              Admin
            </Link>
          )}
        </nav>

        {/* Close button at the bottom of drawer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="w-4 h-4" aria-hidden="true" />
            Close menu
          </button>
        </div>
      </div>
    </>
  );
}
