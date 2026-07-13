import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <div className="w-full max-w-[1400px] bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] h-[72px] flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-[28px] leading-none text-[#12122b] dark:text-white">🏛️</span>
            <span className="font-heading font-bold text-[22px] tracking-tight text-[#12122b] dark:text-white">Civic AI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-[40px] text-[15px] font-semibold text-[#5a5a72] dark:text-gray-300 absolute left-1/2 -translate-x-1/2">
          <Link href="/dashboard" className="hover:text-[#12122b] dark:hover:text-white transition-colors">Dashboard</Link>
          <Link href="/schemes" className="hover:text-[#12122b] dark:hover:text-white transition-colors">Schemes</Link>
          <Link href="/complaints" className="hover:text-[#12122b] dark:hover:text-white transition-colors">Complaints</Link>
          <Link href="/support" className="hover:text-[#12122b] dark:hover:text-white transition-colors">Support</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 flex items-center justify-center text-[#5a5a72] dark:text-gray-300 hover:text-[#12122b] dark:hover:text-white hover:bg-[#f0f3fc] dark:hover:bg-white/10 rounded-full transition-colors" aria-label="Notifications">
            <Bell className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center text-[#5a5a72] dark:text-gray-300 hover:text-[#12122b] dark:hover:text-white hover:bg-[#f0f3fc] dark:hover:bg-white/10 rounded-full transition-colors" aria-label="User Profile">
            <User className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
          <div className="pl-1">
            <ThemeToggle />
          </div>
          <button className="md:hidden p-2 rounded-md hover:bg-muted" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
