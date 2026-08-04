import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen bg-[#070B14]">
      <Sidebar />

      <div className="flex-1">
        <TopNavbar />

        <main className="p-8">
          <h1 className="text-4xl font-bold text-white">
            AI Chat
          </h1>

          <p className="mt-2 text-slate-400">
            Collaborate with your AI assistants in real time.
          </p>
        </main>
      </div>
    </div>
  );
}