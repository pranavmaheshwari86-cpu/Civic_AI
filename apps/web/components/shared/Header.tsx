import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLocale } from "next-intl";

export function Header() {
  const locale = useLocale();
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl border-b border-outline-variant/30 dark:border-outline/20 shadow-sm dark:shadow-none transition-all duration-300">
      <div className="flex justify-between items-center h-16 px-gutter max-w-container-max mx-auto">
        <Link href={`/${locale}`} className="flex items-center gap-xs cursor-pointer">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>assured_workload</span>
          <span className="text-headline-md font-headline-md font-bold tracking-tight text-primary dark:text-primary-fixed">Civic AI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-md font-display-lg text-body-md font-body-md">
          <Link href={`/${locale}/dashboard`} className="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">Dashboard</Link>
          <Link href={`/${locale}/schemes`} className="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">Schemes</Link>
          <Link href={`/${locale}/complaints`} className="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">Complaints</Link>
          <Link href={`/${locale}/support`} className="text-on-surface-variant dark:text-outline hover:text-primary transition-colors hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 rounded-lg px-3 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">Support</Link>
        </nav>
        
        <div className="flex items-center gap-sm">
          <button className="md:hidden text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low/50 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-xs text-primary dark:text-primary-fixed-dim">
            <button aria-label="notifications" className="p-2 rounded-full hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button aria-label="account_circle" className="p-2 rounded-full hover:bg-surface-container-low/50 dark:hover:bg-surface-container-high/20 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-95">
              <span className="material-symbols-outlined">account_circle</span>
            </button>
            <div className="pl-2 flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
