"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import CustomSelect from "@/components/ui/CustomSelect";

interface ProjectsToolbarProps {
  search: string;
  setSearch: (value: string) => void;

  filter: string;
  setFilter: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;
}

export default function ProjectsToolbar({
  search,
  setSearch,
  filter,
  setFilter,
  sort,
  setSort,
}: ProjectsToolbarProps) {

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-md">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search projects..."
          className="
            w-full
            rounded-xl
            border
            border-white/10
            bg-[#111827]
            py-3
            pl-11
            pr-4
            text-white
            placeholder:text-slate-500
            outline-none
            focus:border-cyan-500
          "
        />
      </div>

      <div className="flex items-center gap-3">
        <CustomSelect
  width="w-48"
  value={filter}
  onChange={setFilter}
  options={[
    { label: "All Projects", value: "All" },
    { label: "Running", value: "Running" },
    { label: "Building", value: "Building" },
    { label: "Testing", value: "Testing" },
    { label: "Completed", value: "Completed" },
  ]}
/>

       <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111827] px-4 py-3">
  <CustomSelect
  width="w-56"
  value={sort}
  onChange={setSort}
  icon={<SlidersHorizontal size={18} className="text-slate-400" />}
  options={[
    { label: "Default", value: "default" },
    { label: "A → Z", value: "az" },
    { label: "Z → A", value: "za" },
    { label: "Progress High", value: "progress-high" },
    { label: "Progress Low", value: "progress-low" },
    { label: "Most Members", value: "members-high" },
    { label: "Least Members", value: "members-low" },
  ]}
/>
</div>
      </div>
    </div>
  );
}