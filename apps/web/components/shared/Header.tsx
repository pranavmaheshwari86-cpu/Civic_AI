import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight text-primary">CivicAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground ml-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/chat" className="hover:text-foreground transition-colors">AI Assistant</Link>
            <Link href="/schemes" className="hover:text-foreground transition-colors">Government Services</Link>
            <Link href="/documents" className="hover:text-foreground transition-colors">Documents</Link>
            <Link href="/complaints" className="hover:text-foreground transition-colors">Complaints</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="md:hidden p-2 rounded-md hover:bg-muted" aria-label="Menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
