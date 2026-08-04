"use client";

import { Plus } from "lucide-react";

export default function NewProjectButton() {
  return (
    <button
      className="
        flex
        items-center
        gap-2
        rounded-xl
        bg-cyan-500
        px-5
        py-3
        font-semibold
        text-black
        transition-all
        duration-300
        hover:scale-105
        hover:bg-cyan-400
      "
    >
      <Plus size={18} />
      New Project
    </button>
  );
}