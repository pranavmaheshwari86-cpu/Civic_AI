"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAppRoute = pathname?.includes("/dashboard") || 
                     pathname?.includes("/schemes") || 
                     pathname?.includes("/chat") ||
                     pathname?.includes("/analytics") ||
                     pathname?.includes("/applications");

  if (isAppRoute) {
    return (
      <div className="flex min-h-screen bg-muted/20">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    );
  }

  const isHomeRoute = pathname === "/" || pathname === "/en" || pathname === "/hi";

  return (
    <>
      {!isHomeRoute && <Header />}
      <main className="flex-1">{children}</main>
      {!isHomeRoute && <Footer />}
    </>
  );
}
