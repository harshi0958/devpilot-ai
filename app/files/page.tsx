import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import Link from "next/link";
import {
  FileCode2,
  FileJson,
  FileText,
  Search,
  Download,
  Eye,
} from "lucide-react";

const files = [
  {
    id: 1,
    name: "LandingPage.tsx",
    type: "TSX",
    updated: "2 min ago",
    icon: FileCode2,
  },
  {
    id: 2,
    name: "Navbar.tsx",
    type: "TSX",
    updated: "10 min ago",
    icon: FileCode2,
  },
  {
    id: 3,
    name: "Dashboard.tsx",
    type: "TSX",
    updated: "25 min ago",
    icon: FileCode2,
  },
  {
    id: 4,
    name: "package.json",
    type: "JSON",
    updated: "1 hour ago",
    icon: FileJson,
  },
  {
    id: 5,
    name: "README.md",
    type: "Markdown",
    updated: "Yesterday",
    icon: FileText,
  },
];

export default function FilesPage() {
  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">

          {/* Header */}

          <div className="flex items-center justify-between">

            <div>
              <h1 className="text-4xl font-bold text-white">
                Files
              </h1>

              <p className="mt-2 text-slate-400">
                Browse and manage project files.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl border border-cyan-500/30 px-5 py-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
            >
              Back to Dashboard
            </Link>

          </div>

          {/* Search */}

          <div className="relative mt-8 max-w-lg">

            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />

            <input
              placeholder="Search files..."
              className="w-full rounded-xl border border-white/10 bg-[#101827] py-3 pl-11 pr-4 text-white outline-none focus:border-cyan-500"
            />

          </div>

          {/* File List */}

          <div className="mt-8 space-y-4">

            {files.map((file) => {
              const Icon = file.icon;

              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#101827] p-5 transition hover:border-cyan-500/30"
                >

                  <div className="flex items-center gap-4">

                    <div className="rounded-xl bg-cyan-500/10 p-3">
                      <Icon className="text-cyan-400" size={22} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {file.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {file.type} • {file.updated}
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-3">

                    <button className="rounded-lg border border-white/10 p-2 hover:border-cyan-500">
                      <Eye className="text-white" size={18} />
                    </button>

                    <button className="rounded-lg border border-white/10 p-2 hover:border-cyan-500">
                      <Download className="text-white" size={18} />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </main>

      </div>
    </div>
  );
}