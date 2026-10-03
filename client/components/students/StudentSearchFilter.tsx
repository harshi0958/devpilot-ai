'use client';

interface StudentSearchFilterProps {
  search: string;
  setSearch: (val: string) => void;
  department: string;
  setDepartment: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
}

export const StudentSearchFilter = ({
  search,
  setSearch,
  department,
  setDepartment,
  status,
  setStatus,
}: StudentSearchFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search by name, email, or enrollment ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-4 py-2 border rounded-md w-full md:w-1/3 bg-background text-foreground"
      />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        className="px-4 py-2 border rounded-md w-full md:w-1/4 bg-background text-foreground"
      >
        <option value="">All Departments</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Engineering">Engineering</option>
        <option value="Business">Business</option>
        <option value="Mathematics">Mathematics</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="px-4 py-2 border rounded-md w-full md:w-1/4 bg-background text-foreground"
      >
        <option value="">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="GRADUATED">Graduated</option>
      </select>
    </div>
  );
};