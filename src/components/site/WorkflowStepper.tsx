import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";

const STEPS = [
  { to: "/resume", n: "01", label: "Resume" },
  { to: "/roadmap", n: "02", label: "Roadmap" },
  { to: "/interview", n: "03", label: "Interview" },
  { to: "/report", n: "04", label: "Report" },
] as const;

export function WorkflowStepper({ current }: { current: 1 | 2 | 3 | 4 }) {
  return (
    <div className="mx-auto max-w-5xl px-6 pt-28 no-print print:hidden">
      <div className="glass rounded-2xl p-3 flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => {
          const stepNum = (i + 1) as 1 | 2 | 3 | 4;
          const isDone = stepNum < current;
          const isActive = stepNum === current;
          return (
            <Link
              key={s.n}
              to={s.to}
              className={`flex-1 min-w-[140px] flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${
                isActive
                  ? "bg-white/[0.06]"
                  : "hover:bg-white/[0.04]"
              }`}
            >
              <div
                className={`size-8 rounded-lg grid place-items-center text-xs font-mono shrink-0 ${
                  isActive
                    ? "text-white"
                    : isDone
                    ? "bg-accent/20 text-accent"
                    : "bg-white/[0.04] text-muted-foreground"
                }`}
                style={isActive ? { background: "var(--gradient-primary)" } : undefined}
              >
                {isDone ? <Check className="size-4" /> : s.n}
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Step {stepNum}
                </div>
                <div className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
