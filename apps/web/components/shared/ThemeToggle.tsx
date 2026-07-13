"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center bg-[#e4e8f1] dark:bg-[#202030] rounded-full p-1 shadow-inner h-[32px] w-[64px] relative cursor-pointer" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      <div className={`absolute left-1 right-1 flex justify-between items-center px-[2px]`}>
        <div className={`z-10 flex items-center justify-center w-[24px] h-[24px] rounded-full transition-colors ${theme === 'dark' ? 'text-white' : 'text-[#8888a0]'}`}>
          <Moon className="w-[14px] h-[14px]" strokeWidth={2.5} />
        </div>
        <div className={`z-10 flex items-center justify-center w-[24px] h-[24px] rounded-full transition-colors ${theme === 'light' ? 'text-white' : 'text-[#8888a0]'}`}>
          <Sun className="w-[14px] h-[14px]" strokeWidth={2.5} />
        </div>
      </div>
      <div className={`w-[26px] h-[26px] bg-[#12122b] dark:bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${theme === 'light' ? 'translate-x-[30px]' : 'translate-x-0'} flex items-center justify-center`}>
        {theme === 'light' ? <Sun className="w-[14px] h-[14px] text-white" strokeWidth={2.5} /> : <Moon className="w-[14px] h-[14px] text-[#12122b]" strokeWidth={2.5} />}
      </div>
    </div>
  );
}
