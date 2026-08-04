import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function Logo({
  size = 40,
  showText = true,
}: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 select-none"
    >
      <Image
        src="/branding/app-icon.png"
        alt="DevPilot AI"
        width={size}
        height={size}
        priority
      />

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-bold tracking-tight text-white">
            DevPilot
          </span>

          <span className="text-sm bg-linear-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent font-semibold">
            AI
          </span>
        </div>
      )}
    </Link>
  );
}