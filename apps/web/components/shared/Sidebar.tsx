import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Lightbulb, 
  FileText, 
  Files, 
  BarChart, 
  Settings, 
  HelpCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "AI Insights", href: "/dashboard", icon: Lightbulb },
  { name: "Schemes", href: "/schemes", icon: FileText },
  { name: "Applications", href: "/applications", icon: Files },
  { name: "Analytics", href: "/analytics", icon: BarChart },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col border-r border-border bg-card px-4 py-6 sticky top-0 shrink-0 shadow-sm z-40">
      <Link href="/" className="flex items-center space-x-2 mb-8 px-2">
        <span className="text-2xl">🏛️</span>
        <span className="font-heading font-bold text-xl tracking-tight text-primary">Civic AI</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-8 pb-4">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Preferences
          </p>
          <div className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="mt-auto pt-6">
        <Link 
          href="/chat"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-premium hover:opacity-90 transition-opacity"
        >
          <Sparkles className="h-4 w-4" />
          Ask AI Assistant
        </Link>
      </div>
    </div>
  );
}
