"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative hidden md:flex items-center w-full max-w-md">
      <Search
        size={18}
        className="absolute left-4 text-muted-foreground"
      />

      <input
        type="text"
        placeholder="Search projects, agents, files..."
        className="
          w-full
          rounded-xl
          border
          border-border
          bg-background/60
          backdrop-blur-md
          py-2.5
          pl-11
          pr-16
          text-sm
          outline-none
          transition-all
          duration-300
          focus:border-cyan-500
          focus:ring-2
          focus:ring-cyan-500/20
          placeholder:text-muted-foreground
        "
      />

      <div
        className="
          absolute
          right-3
          rounded-md
          border
          border-border
          bg-muted
          px-2
          py-1
          text-[10px]
          font-medium
          text-muted-foreground
        "
      >
        Ctrl K
      </div>
    </div>
  );
}