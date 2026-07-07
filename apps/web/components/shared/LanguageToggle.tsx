"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.startsWith("/hi") ? "hi" : "en";

  const toggleLanguage = () => {
    const nextLocale = currentLocale === "en" ? "hi" : "en";
    let newPathname = pathname;
    if (pathname.startsWith("/en")) {
      newPathname = pathname.replace(/^\/en/, `/${nextLocale}`);
    } else if (pathname.startsWith("/hi")) {
      newPathname = pathname.replace(/^\/hi/, `/${nextLocale}`);
    } else {
      newPathname = `/${nextLocale}${pathname}`;
    }
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    router.push(newPathname);
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition-colors gap-1.5 text-sm font-medium"
      aria-label="Switch language"
    >
      <Languages className="h-5 w-5" />
      <span>{currentLocale === "en" ? "हिंदी" : "English"}</span>
    </button>
  );
}
