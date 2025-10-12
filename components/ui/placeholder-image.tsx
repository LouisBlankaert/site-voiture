import React from "react";

interface PlaceholderImageProps {
  className?: string;
}

export function PlaceholderImage({ className = "" }: PlaceholderImageProps) {
  return (
    <div className={`flex items-center justify-center bg-muted ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/50"
      >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.6-1.2-.9-1.9-.9H8c-.7 0-1.5.3-2 .8L3.9 9.9C3.3 10.4 3 11.2 3 12v5c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    </div>
  );
}
