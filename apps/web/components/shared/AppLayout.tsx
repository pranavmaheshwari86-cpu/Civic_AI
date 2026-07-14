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
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1 mt-16 md:mt-24">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
