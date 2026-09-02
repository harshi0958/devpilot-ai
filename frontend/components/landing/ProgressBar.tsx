interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({
  value,
}: ProgressBarProps) {
  return (
    <div className="space-y-2">

      <div className="flex items-center justify-between">

        <span className="text-sm font-medium text-zinc-300">
          Overall Progress
        </span>

        <span className="text-sm font-semibold text-cyan-400">
          {value}%
        </span>

      </div>

      <div className="h-3 overflow-hidden rounded-full bg-zinc-800">

        <div
          className="h-full rounded-full bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-1000"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}