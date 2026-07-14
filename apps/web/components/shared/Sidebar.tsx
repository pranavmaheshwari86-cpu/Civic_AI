import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: "dashboard" },
  { name: "AI Insights", href: "/dashboard", icon: "temp_preferences_custom" },
  { name: "Schemes", href: "/schemes", icon: "description" },
  { name: "Applications", href: "/applications", icon: "assignment_turned_in" },
  { name: "Analytics", href: "/analytics", icon: "leaderboard" },
];

const secondaryNavigation = [
  { name: "Settings", href: "/settings", icon: "settings" },
  { name: "Help", href: "/help", icon: "help_outline" },
];

export function Sidebar() {
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="hidden md:flex flex-col p-sm gap-base h-[calc(100vh-4rem)] w-72 sticky top-16 z-40 bg-surface-container-lowest dark:bg-surface-container-low border-r border-outline-variant/20 shadow-xl dark:shadow-none duration-200 ease-out overflow-y-auto">
      <div className="px-sm mb-lg mt-4">
        <h2 className="text-headline-md font-headline-md font-extrabold text-primary dark:text-primary-fixed">Civic AI</h2>
        <p className="text-label-sm font-label-sm text-on-surface-variant">Citizen Portal</p>
      </div>
      
      <nav className="flex-1 flex flex-col gap-2">
        {navigation.map((item) => {
          const itemPath = item.href === '/' ? `/${locale}` : `/${locale}${item.href}`;
          const isActive = item.href === '/' 
            ? pathname === itemPath 
            : (pathname === itemPath || pathname.startsWith(`${itemPath}/`));
          return (
            <Link
              key={item.name}
              href={itemPath}
              className={cn(
                "flex items-center gap-3 px-sm py-3 rounded-xl group transition-all",
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold hover:bg-secondary-fixed/10 dark:hover:bg-secondary-fixed-dim/10"
                  : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high hover:bg-secondary-fixed/10 dark:hover:bg-secondary-fixed-dim/10"
              )}
            >
              <span 
                className={cn("material-symbols-outlined", !isActive && "group-hover:text-primary")} 
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className={cn("font-headline-md text-label-md font-label-md", !isActive && "group-hover:text-primary")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-sm border-t border-outline-variant/20 flex flex-col gap-2 pb-4">
        <Link href={`/${locale}/chat`} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:scale-[1.02] transition-transform ai-glow">
          <span className="material-symbols-outlined text-[18px]">temp_preferences_custom</span>
          Ask AI Assistant
        </Link>
        {secondaryNavigation.map((item) => {
          const itemPath = item.href === '/' ? `/${locale}` : `/${locale}${item.href}`;
          const isActive = pathname === itemPath || pathname.startsWith(`${itemPath}/`);
          return (
            <Link
              key={item.name}
              href={itemPath}
              className={cn(
                "flex items-center gap-3 px-sm py-3 rounded-xl group transition-all",
                isActive
                  ? "bg-secondary-container text-on-secondary-container font-bold hover:bg-secondary-fixed/10 dark:hover:bg-secondary-fixed-dim/10"
                  : "text-on-surface-variant dark:text-outline hover:bg-surface-container-high hover:bg-secondary-fixed/10 dark:hover:bg-secondary-fixed-dim/10"
              )}
            >
              <span className={cn("material-symbols-outlined text-[20px]", !isActive && "group-hover:text-primary")}>
                {item.icon}
              </span>
              <span className={cn("font-headline-md text-label-md font-label-md", !isActive && "group-hover:text-primary")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
