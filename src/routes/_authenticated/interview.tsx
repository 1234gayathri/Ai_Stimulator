import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check, MessageSquare, Mic, Video } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WorkflowStepper } from "@/components/site/WorkflowStepper";
import { MockTest } from "@/components/interview/MockTest";
import { LiveInterview } from "@/components/interview/LiveInterview";
import { useRequireResume } from "@/hooks/use-require-resume";
import type { RoundType } from "@/lib/interview.functions";

export const Route = createFileRoute("/_authenticated/interview")({
  head: () => ({
    meta: [
      { title: "AI Mock Interview — AI Interview Simulator" },
      { name: "description", content: "Realistic HR, technical, behavioral and coding interviews with voice, video, and text — evaluated on 14 signals in real time." },
      { property: "og:title", content: "AI Mock Interview — AI Interview Simulator" },
      { property: "og:description", content: "Practice like it's the real thing — because it feels like it." },
    ],
  }),
  component: InterviewPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function InterviewPage() {
  useRequireResume("Mock interviews");
  const evalItems = [
    "Technical accuracy",
    "Communication clarity",
    "Confidence trend",
    "Filler words",
    "Eye contact",
    "Problem-solving depth",
    "Grammar",
    "Behavioral fit",
  ];
  const rounds: { id: RoundType; name: string; desc: string }[] = [
    { id: "hr", name: "HR", desc: "Motivation, culture fit, career story" },
    { id: "technical", name: "Technical", desc: "Domain fundamentals from your resume" },
    { id: "behavioral", name: "Behavioral", desc: "STAR-format situational deep-dives" },
    { id: "coding", name: "Coding", desc: "Predict-output, complexity, DS choice" },
    { id: "faang", name: "FAANG-style", desc: "System design + leadership principles" },
    { id: "campus", name: "Campus placement", desc: "Aptitude + core CS + HR blend" },
  ];

  const [activeRound, setActiveRound] = useState<RoundType>("technical");
  const [startKey, setStartKey] = useState(0);
  const mockRef = useRef<HTMLDivElement | null>(null);

  function pickRound(r: RoundType) {
    setActiveRound(r);
    setStartKey((k) => k + 1);
    toast.success(`Starting ${r.toUpperCase()} round — generating fresh questions…`);
    setTimeout(() => mockRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <WorkflowStepper current={3} />

      <section className="px-6 pt-10 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-3">Step 03 · Interview</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight">
            Practice like it's the real thing.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Questions generated from your resume, roadmap, and target role. Never repeated.
            Real-time evaluation on 14 signals — technical, verbal, and non-verbal.
          </p>
        </div>
      </section>

      {/* Round picker */}
      <section className="px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Choose a round · click to start</div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {rounds.map((r) => {
              const active = activeRound === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => pickRound(r.id)}
                  className={`glass rounded-2xl p-4 text-left transition border ${
                    active ? "border-primary/60 bg-white/[0.06]" : "border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="font-display font-semibold">{r.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{r.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Functional AI Mock Test */}
      <section ref={mockRef} className="px-6 py-10 scroll-mt-24">
        <div className="mx-auto max-w-5xl">
          <MockTest round={activeRound} autoStartKey={startKey || undefined} />
        </div>
      </section>



      {/* Live Interactive AI Interview */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Interactive Live Interview Session · Powered by AI & Real-time Media Recording
          </div>
          <LiveInterview round={activeRound} />
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl glass rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Next step</div>
            <div className="font-display text-xl font-semibold mt-1">See your final employability report</div>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 text-white font-medium px-5 py-3 rounded-full glow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            View Report <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
