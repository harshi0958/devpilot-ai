    import { ReactNode } from "react";

interface AgentStatusCardProps {
  icon: ReactNode;
  title: string;
  status: string;
  color: string;
}

export default function AgentStatusCard({
  icon,
  title,
  status,
  color,
}: AgentStatusCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10">
      <div className="flex items-center gap-4">
        <div className="text-2xl">{icon}</div>

        <div>
          <h3 className="font-semibold text-white">{title}</h3>

          <p className="text-sm text-gray-400">{status}</p>
        </div>
      </div>

      <div
        className={`h-3 w-3 rounded-full ${color} animate-pulse`}
      />
    </div>
  );
}