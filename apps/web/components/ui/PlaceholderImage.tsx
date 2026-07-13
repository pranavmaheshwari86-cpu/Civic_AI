import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderImageProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  text?: string;
}

export function PlaceholderImage({ className, width = "100%", height = "100%", text = "Image" }: PlaceholderImageProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center bg-surface-container-high/50 text-outline border border-outline-variant/30 rounded-xl",
        className
      )}
      style={{ width, height }}
    >
      <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
      <span className="font-label-sm text-xs opacity-60 uppercase tracking-wider">{text}</span>
    </div>
  );
}
