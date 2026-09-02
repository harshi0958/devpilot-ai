"use client";

interface TaskToolbarProps {
  search: string;
  setSearch: (value: string) => void;

  priority: string;
  setPriority: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;
}

export default function TaskToolbar({
  search,
  setSearch,
  priority,
  setPriority,
  status,
  setStatus,
}: TaskToolbarProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111827] p-5 lg:flex-row">

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="flex-1 rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white outline-none"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white"
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-white"
      >
        <option value="All">All Status</option>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Review">Review</option>
        <option value="Done">Done</option>
      </select>

    </div>
  );
}