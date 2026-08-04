"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  icon?: React.ReactNode;
  width?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  icon,
  width = "w-56",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  const selected =
    options.find((o) => o.value === value) ??
    options[0];

  return (
    <div
      ref={ref}
      className={`relative ${width}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          border
          border-white/10
          bg-[#111827]
          px-4
          py-3
          text-white
          transition
          hover:border-cyan-500
        "
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{selected.label}</span>
        </div>

        <ChevronDown
          size={18}
          className={`transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-xl
            border
            border-white/10
            bg-[#111827]
            shadow-2xl
            animate-in
            fade-in
            zoom-in-95
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="
                flex
                w-full
                items-center
                justify-between
                px-4
                py-3
                text-left
                text-white
                transition
                hover:bg-cyan-500/10
              "
            >
              {option.label}

              {value === option.value && (
                <Check
                  size={16}
                  className="text-cyan-400"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}