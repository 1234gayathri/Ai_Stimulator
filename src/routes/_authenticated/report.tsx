import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Download,
  FileCheck,
  Loader2,
  Mic,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Trophy,
  Video,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WorkflowStepper } from "@/components/site/WorkflowStepper";
import { useRequireResume } from "@/hooks/use-require-resume";
import { listAnalyses } from "@/lib/resume.functions";
import { getRoadmap } from "@/lib/roadmap.functions";
import { ROUND_TYPES, type RoundType } from "@/lib/interview.functions";
import { formatSalary } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/report")({
  head: () => ({
    meta: [
      { title: "Employability Report — AI Interview Simulator" },
      { name: "description", content: "Your recruiter-ready report generated from your uploaded resume, interview performance, skills, gaps, salary, and 30/60/90 plan." },
    ],
  }),
  component: ReportPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

type Gap = { skill: string; why_it_matters?: string; hours_to_learn?: number; priority?: string };
type Skill = { name: string; level: string };
type Salary = { currency: string; min: number; max: number; region: string };

interface InterviewTurn {
  question: string;
  answer: string;
  mode: "text" | "voice" | "video";
  topic?: string;
  audioUrl?: string;
  videoUrl?: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  wpm?: number;
  filler_count?: number;
  confidence_rating?: string;
  created_at: string;
}

interface RoundStats {
  round: string;
  turns: InterviewTurn[];
  avgScore: number;
  bestScore: number;
  worstScore: number;
  avgWpm: number;
  totalFillers: number;
  confidenceCounts: { High: number; Medium: number; Low: number };
}

function loadAllInterviewTurns(): { allTurns: InterviewTurn[]; byRound: Record<string, InterviewTurn[]> } {
  const byRound: Record<string, InterviewTurn[]> = {};
  const allTurns: InterviewTurn[] = [];

  if (typeof window === "undefined") return { allTurns, byRound };

  for (const round of ROUND_TYPES) {
    try {
      const raw = localStorage.getItem(`interview_turns_${round}`);
      if (raw) {
        const parsed: InterviewTurn[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          byRound[round] = parsed;
          allTurns.push(...parsed);
        }
      }
    } catch {
      // ignore corrupted data
    }
  }

  return { allTurns, byRound };
}

function computeRoundStats(round: string, turns: InterviewTurn[]): RoundStats {
  const scores = turns.map((t) => t.score ?? 0);
  const wpms = turns.filter((t) => typeof t.wpm === "number").map((t) => t.wpm!);
  const fillers = turns.reduce((sum, t) => sum + (t.filler_count ?? 0), 0);
  const confCounts = { High: 0, Medium: 0, Low: 0 };
  turns.forEach((t) => {
    const c = (t.confidence_rating || "Medium") as keyof typeof confCounts;
    if (c in confCounts) confCounts[c]++;
  });

  return {
    round,
    turns,
    avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    bestScore: scores.length > 0 ? Math.max(...scores) : 0,
    worstScore: scores.length > 0 ? Math.min(...scores) : 0,
    avgWpm: wpms.length > 0 ? Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length) : 0,
    totalFillers: fillers,
    confidenceCounts: confCounts,
  };
}

function aggregateStrImprovements(turns: InterviewTurn[]): { topStrengths: string[]; topImprovements: string[] } {
  const strMap = new Map<string, number>();
  const impMap = new Map<string, number>();

  turns.forEach((t) => {
    t.strengths?.forEach((s) => {
      const key = s.trim().toLowerCase();
      strMap.set(key, (strMap.get(key) ?? 0) + 1);
    });
    t.improvements?.forEach((imp) => {
      const key = imp.trim().toLowerCase();
      impMap.set(key, (impMap.get(key) ?? 0) + 1);
    });
  });

  const topStrengths = [...strMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));
  const topImprovements = [...impMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1));

  return { topStrengths, topImprovements };
}

function scoreGrade(score: number) {
  if (score >= 85) return { label: "Excellent", color: "text-emerald-400", bar: "bg-emerald-500", border: "border-emerald-500/40", print: "text-emerald-700" };
  if (score >= 70) return { label: "Good", color: "text-blue-400", bar: "bg-blue-500", border: "border-blue-500/40", print: "text-blue-700" };
  if (score >= 50) return { label: "Average", color: "text-amber-400", bar: "bg-amber-500", border: "border-amber-500/40", print: "text-amber-700" };
  return { label: "Needs Work", color: "text-red-400", bar: "bg-red-500", border: "border-red-500/40", print: "text-red-700" };
}

const ROUND_LABELS: Record<string, string> = {
  hr: "HR",
  technical: "Technical",
  behavioral: "Behavioral",
  coding: "Coding",
  faang: "FAANG-Style",
  campus: "Campus Placement",
};

function ReportPage() {
  useRequireResume("Your report");
  const listAnalysesFn = useServerFn(listAnalyses);
  const getRoadmapFn = useServerFn(getRoadmap);

  const analysesQ = useQuery({ queryKey: ["analyses"], queryFn: () => listAnalysesFn() });
  const roadmapQ = useQuery({ queryKey: ["roadmap"], queryFn: () => getRoadmapFn() });

  const latest = analysesQ.data?.[0];
  const isLoading = analysesQ.isLoading;

  // Load real interview data from localStorage
  const { allTurns, byRound } = useMemo(() => loadAllInterviewTurns(), []);
  const hasInterviewData = allTurns.length > 0;

  // Compute stats
  const roundStats = useMemo(() => {
    return Object.entries(byRound).map(([round, turns]) => computeRoundStats(round, turns));
  }, [byRound]);

  const overallInterviewStats = useMemo(() => {
    if (!hasInterviewData) return null;
    return computeRoundStats("all", allTurns);
  }, [allTurns, hasInterviewData]);

  const { topStrengths, topImprovements } = useMemo(() => aggregateStrImprovements(allTurns), [allTurns]);

  function handleDownloadPDF() {
    toast.dismiss();
    const origTitle = document.title;
    const roleSlug = (latest?.target_role || "Candidate").replace(/[^a-zA-Z0-9]/g, "_");
    document.title = `AI_Employability_Report_${roleSlug}_${new Date().toISOString().split("T")[0]}`;
    window.print();
    document.title = origTitle;
  }

  function handleShare() {
    if (navigator.share) {
      navigator
        .share({
          title: `Employability Report for ${latest?.target_role || "Candidate"}`,
          text: `Overall Score: ${latest?.overall_score || 0}/100 — Generated by AI Interview Simulator`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Report link copied to clipboard!");
    }
  }

  if (isLoading || !latest) {
    return (
      <div className="min-h-screen text-foreground">
        <Nav />
        <WorkflowStepper current={4} />
        <div className="mx-auto max-w-5xl px-6 py-24 flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary-glow" />
          Generating your dynamic employability report…
        </div>
        <Footer />
      </div>
    );
  }

  const raw = (latest.raw ?? {}) as {
    readiness_percent?: number;
    knowledge_remaining_percent?: number;
    estimated_learning_weeks?: number;
    readiness_verdict?: string;
  };
  const overall = Math.round(latest.overall_score ?? 0);
  const ats = Math.round(latest.ats_score ?? 0);

  // Use REAL interview readiness if we have interview data, otherwise fall back to resume estimate
  const interviewAvg = overallInterviewStats?.avgScore ?? 0;
  const ready = hasInterviewData
    ? interviewAvg
    : Math.max(0, Math.min(100, Math.round(raw.readiness_percent ?? overall)));
  const remaining = Math.max(0, Math.min(100, 100 - ready));
  const weeks = Math.max(0, Math.round(raw.estimated_learning_weeks ?? Math.ceil(remaining / 10)));
  const skills = (latest.skills ?? []) as Skill[];
  const strengths = (latest.strengths ?? []) as string[];
  const gaps = (latest.gaps ?? []) as Gap[];
  const salary = latest.salary_estimate as Salary | null;
  const salaryInfo = formatSalary(salary);

  // Calculate dynamic roadmap completion
  const modules = (roadmapQ.data?.modules ?? []) as any[];
  const completedCount = modules.filter((m) => m.completed || m.progress_pct >= 100).length;
  const totalModules = modules.length;
  const roadmapPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0;

  const certId = `EMP-VERIFIED-${latest.id.substring(0, 8).toUpperCase()}`;
  const reportDate = new Date(latest.created_at || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const scores = [
    { label: "Overall employability", val: overall },
    { label: "ATS parseability", val: ats },
    { label: "Interview readiness", val: ready, dynamic: hasInterviewData },
    { label: "Learning roadmap progress", val: roadmapPct },
  ];

  // Build smarter 30/60/90 plan using real interview weaknesses
  const critical = gaps.filter((g) => (g.priority ?? "medium").toLowerCase() === "critical");
  const high = gaps.filter((g) => (g.priority ?? "medium").toLowerCase() === "high");
  const rest = gaps.filter((g) => !["critical", "high"].includes((g.priority ?? "medium").toLowerCase()));

  const plan = [
    {
      period: "30 days",
      focus: topImprovements.length > 0
        ? `Address top interview weaknesses: ${topImprovements.slice(0, 3).join(", ")}. ${critical.length ? `Bridge critical gaps: ${critical.slice(0, 2).map((g) => g.skill).join(", ")}.` : ""}`
        : critical.length ? `Bridge critical skill gaps: ${critical.slice(0, 3).map((g) => g.skill).join(", ")}` : "Reinforce core strengths and build 2 production portfolio artifacts.",
    },
    {
      period: "60 days",
      focus: hasInterviewData && interviewAvg < 70
        ? `Intensify mock interview practice (current avg: ${interviewAvg}/100). ${high.length ? `Level up: ${high.slice(0, 2).map((g) => g.skill).join(", ")}.` : "Focus on communication clarity and STAR method."}`
        : high.length ? `Level up key target skills: ${high.slice(0, 3).map((g) => g.skill).join(", ")}` : "Practice AI mock interviews 2× weekly to refine communication articulation.",
    },
    {
      period: "90 days",
      focus: hasInterviewData
        ? `Target ${interviewAvg >= 80 ? "final polish" : "consistent 80+"} scores across all round types. ${rest.length ? `Master: ${rest.slice(0, 2).map((g) => g.skill).join(", ")}.` : ""} Begin recruiter outreach and applications.`
        : rest.length ? `Master supporting capabilities: ${rest.slice(0, 3).map((g) => g.skill).join(", ")}` : "Target recruiter outreach and high-priority interview applications.",
    },
  ];

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden print:bg-white print:text-black">
      <Nav />
      <WorkflowStepper current={4} />

      {/* Web Interactive View */}
      <div className="print:hidden">
        {/* Header */}
        <section className="px-6 pt-10 pb-8">
          <div className="mx-auto max-w-5xl flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-3">Step 04 · Report</div>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight">
                Your employability report.
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                Dynamically generated for <span className="text-foreground font-medium">{latest.target_role}</span> based on your resume, roadmap, and{" "}
                {hasInterviewData ? (
                  <span className="text-accent font-medium">{allTurns.length} live interview answers</span>
                ) : (
                  "mock interviews"
                )}.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 glass px-4 py-2.5 rounded-full text-sm font-medium hover:bg-white/[0.06] transition"
              >
                <Share2 className="size-4" /> Share
              </button>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg transition hover:brightness-110 active:scale-95"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Download className="size-4" /> Download PDF
              </button>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto max-w-5xl px-6 space-y-6">
          {/* Verified Badge */}
          <div className="glass-strong rounded-2xl p-4 border border-primary/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-accent shrink-0" />
              <div>
                <span className="font-semibold text-foreground">Verified AI Career Report</span> · Issued {reportDate}
                <div className="text-muted-foreground text-[11px]">Credential Reference: {certId}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 glass rounded-full px-3 py-1 text-primary-glow font-medium">
              <FileCheck className="size-3.5" /> Target Role: {latest.target_role}
            </div>
          </div>

          {/* Overall Score Card */}
          <section>
            <motion.div {...fadeUp} className="glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 size-72 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
              <div className="relative grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Overall Employability Score</div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <div className="font-display text-8xl font-semibold text-gradient">{overall}</div>
                    <div className="text-2xl text-muted-foreground">/100</div>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent font-medium">
                    <TrendingUp className="size-4" /> Ready today: {ready}% · {weeks} wks estimated to placement
                  </div>
                  {hasInterviewData && (
                    <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                      <Sparkles className="size-3 text-amber-400" /> Interview readiness based on {allTurns.length} real answers
                    </div>
                  )}
                  {latest.summary && <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{latest.summary}</p>}
                </div>

                <div className="space-y-4">
                  {scores.map((s) => {
                    const grade = scoreGrade(s.val);
                    return (
                      <div key={s.label}>
                        <div className="flex justify-between text-sm mb-1.5 font-medium">
                          <span className="text-muted-foreground flex items-center gap-1.5">
                            {s.label}
                            {(s as any).dynamic && <span className="text-[9px] glass rounded px-1 py-0.5 text-accent font-bold uppercase">Live</span>}
                          </span>
                          <span className={grade.color}>{s.val}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.val}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full ${grade.bar}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {salaryInfo && (
                    <div className="pt-4 border-t border-white/5">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">Estimated Market Salary</div>
                      <div className="text-lg font-semibold mt-1 text-accent">
                        {salaryInfo.formatted}
                      </div>
                      <div className="text-xs text-muted-foreground">{salaryInfo.subtext}</div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </section>

          {/* ═══════════════════════════════════════════════════ */}
          {/* INTERVIEW PERFORMANCE SECTION — Dynamic from real data */}
          {/* ═══════════════════════════════════════════════════ */}
          {hasInterviewData && overallInterviewStats && (
            <section className="py-4 space-y-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="size-5 text-accent" />
                <h2 className="font-display text-2xl font-semibold">Live Interview Performance</h2>
                <span className="glass rounded-full px-2.5 py-0.5 text-[10px] font-bold text-accent border border-accent/30 uppercase">
                  {allTurns.length} Answers Evaluated
                </span>
              </div>

              {/* Big Interview Score Card */}
              <motion.div {...fadeUp} className={`glass-strong rounded-3xl p-6 md:p-8 border ${scoreGrade(overallInterviewStats.avgScore).border}`}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Avg Score */}
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Average Interview Score</div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className={`font-display text-6xl font-bold ${scoreGrade(overallInterviewStats.avgScore).color}`}>
                        {overallInterviewStats.avgScore}
                      </span>
                      <span className="text-lg text-muted-foreground">/ 100</span>
                    </div>
                    <div className={`text-sm font-semibold mt-1 ${scoreGrade(overallInterviewStats.avgScore).color}`}>
                      {scoreGrade(overallInterviewStats.avgScore).label}
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${overallInterviewStats.avgScore}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className={`h-full rounded-full ${scoreGrade(overallInterviewStats.avgScore).bar}`}
                      />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="space-y-3">
                    <div className="glass rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Best Score</span>
                      <span className="font-bold text-emerald-400">{overallInterviewStats.bestScore}/100</span>
                    </div>
                    <div className="glass rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Lowest Score</span>
                      <span className="font-bold text-red-400">{overallInterviewStats.worstScore}/100</span>
                    </div>
                    <div className="glass rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Avg Speaking Pace</span>
                      <span className="font-bold text-foreground">{overallInterviewStats.avgWpm} WPM</span>
                    </div>
                    <div className="glass rounded-xl p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total Filler Words</span>
                      <span className="font-bold text-amber-400">{overallInterviewStats.totalFillers}</span>
                    </div>
                  </div>

                  {/* Confidence Distribution */}
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Confidence Distribution</div>
                    {(["High", "Medium", "Low"] as const).map((level) => {
                      const count = overallInterviewStats.confidenceCounts[level];
                      const pct = allTurns.length > 0 ? Math.round((count / allTurns.length) * 100) : 0;
                      const color = level === "High" ? "bg-emerald-500" : level === "Medium" ? "bg-amber-500" : "bg-red-500";
                      const textColor = level === "High" ? "text-emerald-400" : level === "Medium" ? "text-amber-400" : "text-red-400";
                      return (
                        <div key={level}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`font-medium ${textColor}`}>{level} Confidence</span>
                            <span className="text-muted-foreground">{count} ({pct}%)</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}

                    {/* Mode breakdown */}
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {["text", "voice", "video"].map((m) => {
                        const count = allTurns.filter((t) => t.mode === m).length;
                        if (count === 0) return null;
                        const Icon = m === "text" ? MessageSquare : m === "voice" ? Mic : Video;
                        return (
                          <span key={m} className="glass rounded-full px-2.5 py-1 text-[10px] font-medium flex items-center gap-1 text-muted-foreground">
                            <Icon className="size-3" /> {m}: {count}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Per-Round Breakdown */}
              {roundStats.length > 0 && (
                <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Performance by Round Type</div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {roundStats.map((rs) => {
                      const grade = scoreGrade(rs.avgScore);
                      return (
                        <div key={rs.round} className={`glass rounded-2xl p-4 border ${grade.border} transition hover:bg-white/[0.03]`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-display font-semibold text-sm">{ROUND_LABELS[rs.round] || rs.round}</span>
                            <span className={`font-display text-xl font-bold ${grade.color}`}>{rs.avgScore}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-2">
                            <div className={`h-full rounded-full ${grade.bar}`} style={{ width: `${rs.avgScore}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{rs.turns.length} answers</span>
                            <span className={grade.color}>{grade.label}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                            <span>Best: {rs.bestScore}</span>
                            <span>Worst: {rs.worstScore}</span>
                            <span>{rs.avgWpm} WPM</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Interview Strengths & Improvements */}
              {(topStrengths.length > 0 || topImprovements.length > 0) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {topStrengths.length > 0 && (
                    <motion.div {...fadeUp} className="glass rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="size-5 text-emerald-400" />
                        <h3 className="font-display text-lg font-semibold">Interview Strengths</h3>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {topStrengths.map((s, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {topImprovements.length > 0 && (
                    <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="glass rounded-3xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="size-5 text-amber-400" />
                        <h3 className="font-display text-lg font-semibold">Areas to Improve</h3>
                      </div>
                      <ul className="space-y-2 text-sm">
                        {topImprovements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <TrendingDown className="size-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* No Interview Data Banner */}
          {!hasInterviewData && (
            <motion.div {...fadeUp} className="glass rounded-2xl p-5 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-300 text-sm">No live interview data yet</div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Complete some interview rounds on the{" "}
                  <Link to="/interview" className="text-accent underline">
                    Interview page
                  </Link>{" "}
                  to see your real performance scores, strengths, weaknesses, and per-round breakdowns here.
                </p>
              </div>
            </motion.div>
          )}

          {/* Resume Strengths & Gaps */}
          <section className="py-4">
            <div className="grid md:grid-cols-2 gap-4">
              <motion.div {...fadeUp} className="glass rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Trophy className="size-5 text-accent" />
                  <h2 className="font-display text-xl font-semibold">Resume Strengths</h2>
                </div>
                <ul className="space-y-2 text-sm">
                  {strengths.length ? (
                    strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="size-4 text-accent shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No strengths detected yet.</li>
                  )}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                  {skills.map((s, i) => (
                    <span key={i} className="text-xs glass rounded-full px-2.5 py-1">
                      {s.name} <span className="text-muted-foreground">· {s.level}</span>
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="glass rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="size-5 text-primary-glow" />
                  <h2 className="font-display text-xl font-semibold">Priority Skill Gaps</h2>
                </div>
                <ul className="space-y-3 text-sm">
                  {gaps.length ? (
                    gaps.map((g, i) => (
                      <li key={i}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{g.skill}</span>
                          {typeof g.hours_to_learn === "number" && g.hours_to_learn > 0 && (
                            <span className="text-[10px] uppercase tracking-wider glass rounded-full px-2 py-0.5 text-muted-foreground">
                              ~{g.hours_to_learn}h · {g.priority ?? "medium"}
                            </span>
                          )}
                        </div>
                        {g.why_it_matters && <div className="text-muted-foreground text-xs mt-0.5">{g.why_it_matters}</div>}
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No gaps identified.</li>
                  )}
                </ul>
              </motion.div>
            </div>
          </section>

          {/* 30/60/90 Day Plan */}
          <section className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="size-5 text-primary-glow" />
              <h2 className="font-display text-2xl font-semibold">Personalized 30 / 60 / 90 Day Action Plan</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {plan.map((p, i) => (
                <motion.div key={p.period} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="glass rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-primary-glow font-medium">
                    <Award className="size-4" />
                    <div className="text-xs uppercase tracking-widest">{p.period} Target</div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">{p.focus}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Next Step CTA */}
        <section className="px-6 py-14">
          <div className="mx-auto max-w-5xl glass rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Next Step</div>
              <div className="font-display text-xl font-semibold mt-1">
                {hasInterviewData && interviewAvg < 80
                  ? "Keep Practicing — Target 80+ Average"
                  : "Keep Practicing Mock Interviews"}
              </div>
            </div>
            <div className="flex gap-3">
              <Link to="/roadmap" className="inline-flex items-center gap-2 glass px-4 py-2.5 rounded-full text-sm font-medium">
                View Roadmap
              </Link>
              <Link
                to="/interview"
                className="inline-flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-full glow-primary text-sm"
                style={{ background: "var(--gradient-primary)" }}
              >
                Start New Interview <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* PRINT-ONLY PDF DOCUMENT */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="hidden print:block p-4 bg-white text-slate-900 font-sans max-w-4xl mx-auto space-y-3 leading-snug">
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Logo" className="size-8 object-contain" />
              <span className="text-lg font-bold tracking-tight text-slate-900">AI INTERVIEWER PRO</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1 uppercase tracking-wide">
              Official Student Employability Scorecard
            </h1>
            <div className="text-xs text-slate-600 mt-0.5 font-medium">
              Target Career Role: <span className="text-slate-900 font-bold">{latest.target_role}</span>
            </div>
          </div>

          <div className="text-right text-xs text-slate-700 space-y-0.5">
            <div className="font-bold text-slate-900">Verification Ref: {certId}</div>
            <div>Issued Date: {reportDate}</div>
            <div className="inline-block bg-slate-100 text-slate-800 font-semibold px-2 py-0.5 rounded text-[10px] border border-slate-300">
              OFFICIAL CERTIFIED REPORT
            </div>
          </div>
        </div>

        {/* Scores Grid */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="col-span-1 border-r border-slate-200 pr-3">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Overall Student Score</div>
            <div className="text-4xl font-black text-indigo-700 mt-0.5">{overall}<span className="text-lg font-normal text-slate-500">/100</span></div>
            <div className="text-[11px] font-bold text-emerald-700 mt-1">
              Status: {overall >= 75 ? "Placement Ready" : "Developing Candidate"}
            </div>
          </div>

          <div className="col-span-2 space-y-1 text-xs pl-1">
            <div className="flex justify-between py-0.5 border-b border-slate-200">
              <span className="font-semibold text-slate-600">ATS Resume Score:</span>
              <span className="font-bold text-slate-900">{ats}%</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Interview Readiness Score:</span>
              <span className="font-bold text-slate-900">{ready}% {hasInterviewData ? "(Live)" : "(Estimated)"}</span>
            </div>
            <div className="flex justify-between py-0.5 border-b border-slate-200">
              <span className="font-semibold text-slate-600">Roadmap Progress:</span>
              <span className="font-bold text-slate-900">{roadmapPct}%</span>
            </div>
            {salaryInfo && (
              <div className="flex justify-between py-0.5">
                <span className="font-semibold text-slate-600">Estimated Market Salary:</span>
                <span className="font-bold text-slate-900">{salaryInfo.formatted} ({salaryInfo.subtext})</span>
              </div>
            )}
          </div>
        </div>

        {/* Interview Performance (Print) */}
        {hasInterviewData && overallInterviewStats && (
          <div className="border border-slate-200 rounded-lg p-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">
              Live Interview Performance ({allTurns.length} Answers)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Avg Score</div>
                <div className="text-xl font-black text-indigo-700">{overallInterviewStats.avgScore}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Best</div>
                <div className="text-xl font-black text-emerald-700">{overallInterviewStats.bestScore}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Avg WPM</div>
                <div className="text-xl font-black text-slate-800">{overallInterviewStats.avgWpm}</div>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                <div className="text-[10px] font-semibold text-slate-500 uppercase">Fillers</div>
                <div className="text-xl font-black text-amber-700">{overallInterviewStats.totalFillers}</div>
              </div>
            </div>
            {roundStats.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
                {roundStats.map((rs) => (
                  <div key={rs.round} className="bg-slate-50 p-1.5 rounded border border-slate-200 flex justify-between">
                    <span className="font-semibold">{ROUND_LABELS[rs.round] || rs.round}</span>
                    <span className="font-bold text-indigo-700">{rs.avgScore}/100 ({rs.turns.length})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Strengths & Gaps */}
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 border-b pb-1">
              {hasInterviewData ? "Top Strengths (Resume + Interview)" : "Top Student Strengths"}
            </h3>
            <ul className="text-xs space-y-1 text-slate-700">
              {[...new Set([...topStrengths, ...strengths])].slice(0, 5).map((s, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 border-b pb-1">
              {hasInterviewData ? "Priority Improvements (Resume + Interview)" : "Priority Skill Gaps to Bridge"}
            </h3>
            <ul className="text-xs space-y-1 text-slate-700">
              {[...new Set([...topImprovements, ...gaps.slice(0, 3).map((g) => g.skill)])].slice(0, 5).map((item, i) => (
                <li key={i} className="flex items-start gap-1">
                  <span className="text-amber-600 font-bold shrink-0">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 30/60/90 Day Plan */}
        <div className="border border-slate-200 rounded-lg p-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-b pb-1">
            Student 30 / 60 / 90 Day Action Plan
          </h3>
          <div className="grid grid-cols-3 gap-2.5 text-xs">
            {plan.map((p) => (
              <div key={p.period} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="font-bold text-indigo-700 uppercase tracking-wider text-[10px] mb-0.5">{p.period} Goal</div>
                <div className="text-slate-700 text-[11px] leading-snug">{p.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Footer */}
        <div className="pt-3 border-t-2 border-slate-800 flex justify-between items-end text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-900 text-xs">AI Interviewer Pro Verification System</div>
            <div className="text-[11px]">Automated Evaluation Engine & Candidate Analytics</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Generated securely via AI Interviewer Pro Platform</div>
          </div>
          <div className="text-center border-2 border-indigo-900 text-indigo-950 px-3 py-1.5 rounded-lg bg-indigo-50/50">
            <div className="text-[9px] uppercase tracking-widest font-black text-indigo-900">Verified Stamp</div>
            <div className="text-xs font-bold tracking-tight text-indigo-900 mt-0.5">SCORE VERIFIED</div>
            <div className="text-[8px] text-indigo-700">{reportDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
