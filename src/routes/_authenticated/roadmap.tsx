import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, Clock, Flame, GraduationCap, Loader2, PlayCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WorkflowStepper } from "@/components/site/WorkflowStepper";
import { useRequireResume } from "@/hooks/use-require-resume";
import { generateNewRoadmap, getRoadmap, updateModuleProgress } from "@/lib/roadmap.functions";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({
    meta: [
      { title: "Personalized Learning Roadmap — AI Interview Simulator" },
      { name: "description", content: "A prioritized, adaptive learning roadmap with topics, difficulty, time estimates, and progress tracking — built from your resume and target role." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  useRequireResume("Your roadmap");
  const qc = useQueryClient();

  const getRoadmapFn = useServerFn(getRoadmap);
  const generateNewFn = useServerFn(generateNewRoadmap);
  const updateProgressFn = useServerFn(updateModuleProgress);

  const roadmapQ = useQuery({
    queryKey: ["roadmap"],
    queryFn: () => getRoadmapFn(),
  });

  const generateM = useMutation({
    mutationFn: () => generateNewFn(),
    onSuccess: () => {
      toast.success("New personalized roadmap generated!");
      qc.invalidateQueries({ queryKey: ["roadmap"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Generation failed."),
  });

  const progressM = useMutation({
    mutationFn: ({ moduleId, progressPct }: { moduleId: string; progressPct: number }) =>
      updateProgressFn({ data: { moduleId, progressPct } }),
    onSuccess: () => {
      toast.success("Module progress updated!");
      qc.invalidateQueries({ queryKey: ["roadmap"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed."),
  });

  const roadmap = roadmapQ.data?.roadmap;
  const modules = roadmapQ.data?.modules || [];

  const totalWeeks = modules.reduce((acc: number, m: any) => acc + (m.estimated_weeks || 1), 0);
  const completedCount = modules.filter((m: any) => m.completed || m.progress_pct >= 100).length;

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <WorkflowStepper current={2} />

      <section className="px-6 pt-10 pb-10">
        <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-3">Step 02 · Roadmap</div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight">
              Your personalized learning path.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              {roadmap?.summary ||
                `Customized learning roadmap generated for "${roadmap?.target_role || "your target role"}". Prioritized by impact to bridge your resume skill gaps.`}
            </p>
          </div>

          <button
            onClick={() => generateM.mutate()}
            disabled={generateM.isPending || roadmapQ.isLoading}
            className="inline-flex items-center gap-2 text-xs font-medium glass rounded-full px-4 py-2 hover:bg-white/10 transition shrink-0"
          >
            {generateM.isPending ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-primary-glow" /> Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="size-3.5" /> Re-generate AI Roadmap
              </>
            )}
          </button>
        </div>
      </section>

      {/* Loading state */}
      {roadmapQ.isLoading && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl glass rounded-3xl p-10 text-center flex flex-col items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary-glow mb-4" />
            <div className="text-lg font-medium">Generating your custom roadmap from your resume...</div>
            <div className="text-sm text-muted-foreground mt-1">Analyzing skill gaps & structuring learning modules...</div>
          </div>
        </section>
      )}

      {/* Error state */}
      {roadmapQ.isError && (
        <section className="px-6 py-12">
          <div className="mx-auto max-w-5xl glass rounded-3xl p-8 text-center text-red-400">
            {roadmapQ.error instanceof Error ? roadmapQ.error.message : "Failed to load roadmap."}
          </div>
        </section>
      )}

      {!roadmapQ.isLoading && !roadmapQ.isError && (
        <>
          {/* Overview stats */}
          <section className="px-6">
            <div className="mx-auto max-w-5xl grid sm:grid-cols-3 gap-4">
              {[
                { icon: BookOpen, label: "Total Modules", val: `${modules.length} modules` },
                { icon: Clock, label: "Estimated Time", val: `${totalWeeks} weeks` },
                { icon: Flame, label: "Completed", val: `${completedCount} of ${modules.length}` },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="size-11 rounded-xl grid place-items-center bg-primary/15 text-primary-glow">
                    <s.icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
                    <div className="font-display text-2xl font-semibold">{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Modules */}
          <section className="px-6 py-14">
            <div className="mx-auto max-w-5xl">
              <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Prioritized Modules for {roadmap?.target_role || "Target Role"}
                  </h2>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    Tailored specifically to fix your uploaded resume's skill gaps
                  </div>
                </div>
                <span className="text-xs glass rounded-full px-3 py-1 text-primary-glow font-medium">
                  {completedCount === modules.length && modules.length > 0 ? "All Modules Completed! 🎉" : "In Progress"}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {modules.map((m: any, i: number) => {
                  const topics = (m.topics || []) as string[];
                  const isCompleted = m.completed || m.progress_pct >= 100;

                  return (
                    <motion.div
                      key={m.id || i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="glass rounded-3xl p-6 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-xs uppercase tracking-wider text-primary-glow font-medium">
                              Priority {i + 1} · {m.difficulty || "Intermediate"}
                            </div>
                            <h3 className="font-display text-xl font-semibold mt-1">{m.title}</h3>
                          </div>
                          <div className="size-10 rounded-xl grid place-items-center bg-primary/15 text-primary-glow shrink-0">
                            {isCompleted ? <CheckCircle2 className="size-5 text-accent" /> : <GraduationCap className="size-5" />}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs">
                          <span className="glass rounded-full px-2.5 py-1 text-muted-foreground">
                            {m.estimated_weeks || 2} weeks estimated
                          </span>
                          {isCompleted && (
                            <span className="glass rounded-full px-2.5 py-1 text-accent font-medium">
                              Completed
                            </span>
                          )}
                        </div>

                        <div className="mt-5">
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{m.progress_pct || 0}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${m.progress_pct || 0}%` }}
                              transition={{ duration: 0.6 }}
                              className="h-full rounded-full"
                              style={{ background: isCompleted ? "var(--color-accent, #10b981)" : "var(--gradient-primary)" }}
                            />
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-1.5">
                          {topics.map((t: string) => (
                            <span key={t} className="text-xs glass rounded-full px-2.5 py-1 text-muted-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            const next = isCompleted ? 0 : Math.min(100, (m.progress_pct || 0) + 50);
                            progressM.mutate({ moduleId: m.id, progressPct: next });
                          }}
                          disabled={progressM.isPending}
                          className="inline-flex items-center gap-2 text-xs font-medium text-white px-4 py-2 rounded-full transition-transform active:scale-95"
                          style={{ background: "var(--gradient-primary)" }}
                        >
                          <PlayCircle className="size-3.5" />
                          {isCompleted ? "Mark Incomplete" : m.progress_pct > 0 ? "Update Progress" : "Start Module"}
                        </button>

                        <button
                          onClick={() => progressM.mutate({ moduleId: m.id, progressPct: 100 })}
                          disabled={progressM.isPending || isCompleted}
                          className="text-xs text-muted-foreground hover:text-white transition"
                        >
                          Mark Done ✓
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="mx-auto max-w-5xl glass rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Next step</div>
                <div className="font-display text-xl font-semibold mt-1">Practice with an AI Mock Interview</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Test your newly acquired skills against realistic interview questions tailored to {roadmap?.target_role || "your role"}.
                </div>
              </div>
              <Link
                to="/interview"
                className="inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-full glow-primary transition-transform hover:scale-105"
                style={{ background: "var(--gradient-primary)" }}
              >
                Continue to Interview <ArrowRight className="size-4" />
              </Link>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
