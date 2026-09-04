interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 32, className = "", showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className="rounded-xl overflow-hidden shadow-md flex items-center justify-center shrink-0 border border-white/10"
        style={{ width: size, height: size }}
      >
        <img
          src="/logo.svg"
          alt="AI Interviewer Pro Logo"
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <span className="font-display font-bold tracking-tight text-foreground text-base">
          AI Interviewer <span className="text-primary-glow font-extrabold">Pro</span>
        </span>
      )}
    </div>
  );
}
