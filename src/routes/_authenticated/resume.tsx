import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, FileUp, Loader2, Sparkles, Target, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WorkflowStepper } from "@/components/site/WorkflowStepper";
import { supabase } from "@/integrations/supabase/client";
import { getLocalUser } from "@/lib/auth-helpers";
import { analyzeResume, analyzeResumeLocal, deleteResume, listAnalyses, listResumes } from "@/lib/resume.functions";
import { formatSalary } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({
    meta: [
      { title: "Resume Analysis — AI Interview Simulator" },
      { name: "description", content: "Upload your resume and get an instant AI-powered ATS score, skill map, gap analysis and salary estimate." },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [targetRole, setTargetRole] = useState(
    () => (typeof window !== "undefined" ? localStorage.getItem("target_role") ?? "Software Engineer" : "Software Engineer")
  );
  const [uploading, setUploading] = useState(false);
  // Local-user analysis stored in state (mirrors what Supabase-backed users get from DB)
  const [localAnalysis, setLocalAnalysis] = useState<any>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("latest_resume_analysis");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const listResumesFn = useServerFn(listResumes);
  const listAnalysesFn = useServerFn(listAnalyses);
  const analyzeFn = useServerFn(analyzeResume);
  const analyzeLocalFn = useServerFn(analyzeResumeLocal);
  const deleteFn = useServerFn(deleteResume);

  // Check if current user is a real Supabase user or a local session user
  const isLocalUser = (): boolean => {
    const lu = getLocalUser();
    if (!lu) return false;
    // Local users have IDs starting with usr_ (not a UUID)
    return lu.id.startsWith("usr_");
  };

  const resumesQ = useQuery({
    queryKey: ["resumes"],
    queryFn: () => (isLocalUser() ? Promise.resolve([]) : listResumesFn()),
  });
  const analysesQ = useQuery({
    queryKey: ["analyses"],
    queryFn: () => (isLocalUser() ? Promise.resolve([]) : listAnalysesFn()),
  });

  const analyzeM = useMutation({
    mutationFn: (resumeId: string) => analyzeFn({ data: { resumeId, targetRole } }),
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("target_role", targetRole);
        if (data) {
          localStorage.setItem("latest_resume_analysis", JSON.stringify(data));
        }
      }
      toast.success("Analysis complete!", {
        description: "Your resume indexing and skill analysis are ready.",
        action: {
          label: "Go to Roadmap ➔",
          onClick: () => router.navigate({ to: "/roadmap" }),
        },
      });
      qc.invalidateQueries({ queryKey: ["analyses"] });
      router.invalidate();
    },
    onError: async (e, resumeId) => {
      toast.error(e instanceof Error ? e.message : "Analysis failed.");
      try {
        await deleteFn({ data: { resumeId } });
        qc.invalidateQueries({ queryKey: ["resumes"] });
        router.invalidate();
      } catch {
        // ignore fallback error
      }
    },
  });

  // Local mutation: reads file → base64 encodes → sends to server → stores result in localStorage
  const analyzeLocalM = useMutation({
    mutationFn: async ({ file, role }: { file: File; role: string }) => {
      // Convert file to base64 string (avoids huge JSON byte array)
      const fileBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data:...;base64, prefix
          resolve(result.split(",")[1] ?? result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      return analyzeLocalFn({
        data: { fileBase64, mimeType: file.type || "application/pdf", filename: file.name, targetRole: role },
      });
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("target_role", targetRole);
        localStorage.setItem("latest_resume_analysis", JSON.stringify(data));
      }
      setLocalAnalysis(data);
      toast.success("Analysis complete!", {
        description: "Resume analyzed successfully.",
        action: {
          label: "Go to Roadmap ➔",
          onClick: () => router.navigate({ to: "/roadmap" }),
        },
      });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    },
  });

  const deleteM = useMutation({
    mutationFn: (resumeId: string) => deleteFn({ data: { resumeId } }),
    onSuccess: () => {
      toast.success("Resume removed.");
      qc.invalidateQueries({ queryKey: ["resumes"] });
      qc.invalidateQueries({ queryKey: ["analyses"] });
      router.invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed."),
  });

  async function handleFile(file: File) {
    // Strict resume validation — PDF/DOC/DOCX only, ≤10 MB, non-empty
    const MAX_BYTES = 10 * 1024 * 1024;
    const allowedMimes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const name = file.name.toLowerCase();
    const extOk = name.endsWith(".pdf") || name.endsWith(".doc") || name.endsWith(".docx");
    const mimeOk = allowedMimes.includes(file.type) || file.type === "";
    if (!extOk || !mimeOk) {
      toast.error("Invalid File Format", {
        description: "Only resume document formats (.pdf, .doc, .docx) are allowed.",
      });
      return;
    }

    // Pre-check for non-resume filenames
    const nonResumeKeywords = [
      "marksheet", "transcript", "invoice", "receipt", "bill", "certificate",
      "admit", "hallticket", "passport", "pan_card", "aadhaar", "assignment",
      "homework", "pay_slip", "payslip", "bank_statement", "offer_letter"
    ];
    const isNonResumeFile = nonResumeKeywords.some((kw) => name.includes(kw));
    if (isNonResumeFile) {
      toast.error("Invalid Document: Not a Resume", {
        description: "Please upload a candidate Resume or CV document only.",
      });
      return;
    }
    if (file.size === 0) {
      toast.error("This file appears to be empty", { description: "Upload a valid resume file." });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File is too large", { description: "Resume must be 10 MB or smaller." });
      return;
    }

    // ── PATH A: Local username session — bypass Supabase storage/DB entirely ──
    if (isLocalUser()) {
      toast.info("Analyzing your resume…", { description: "This may take a few seconds." });
      analyzeLocalM.mutate({ file, role: targetRole });
      return;
    }

    // ── PATH B: Real Supabase user — upload to storage & DB as normal ──
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) throw new Error("Session expired. Please sign in again.");

      const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const uniqueId = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString(36) + Math.random().toString(36).substring(2);
      const path = `${userData.user.id}/${uniqueId}-${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(path, file, { contentType: file.type || "application/pdf", upsert: false });
      if (upErr) throw upErr;

      const { data: inserted, error: insErr } = await supabase
        .from("resumes")
        .insert({
          user_id: userData.user.id,
          storage_path: path,
          original_filename: file.name,
          mime_type: file.type || "application/pdf",
          size_bytes: file.size,
        })
        .select()
        .single();
      if (insErr) throw insErr;

      qc.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume saved — analyzing now…");
      analyzeM.mutate(inserted.id);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  // Show local analysis for username-based users, DB analysis for Supabase users
  const latest = isLocalUser() ? localAnalysis : (analysesQ.data?.[0] ?? localAnalysis);
  const isPending = uploading || analyzeM.isPending || analyzeLocalM.isPending;

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <WorkflowStepper current={1} />

      <section className="px-6 pt-10 pb-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-3">Step 01 · Resume</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight">
            Analyze your resume in seconds.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Upload a PDF. AI Interview Simulator extracts your skills, scores ATS parseability, and identifies gaps against your target role.
          </p>
        </div>
      </section>

      <section className="px-6 pb-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-5 gap-4">
          <div className="glass-strong rounded-3xl p-6 md:col-span-3">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Target role</label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Backend Engineer, Data Scientist…"
            />

            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className="mt-6 border-2 border-dashed border-white/10 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/40 transition"
            >
              <FileUp className="size-8 mx-auto text-primary-glow" />
              <div className="mt-3 font-medium">
                {isPending ? "Analyzing…" : "Drop your resume PDF or click to upload"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">PDF up to 10 MB</div>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:col-span-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Recent uploads</div>
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {resumesQ.data?.length ? (
                resumesQ.data.map((r: any) => (
                  <div key={r.id} className="glass rounded-xl px-3 py-2 text-sm flex items-center justify-between gap-2">
                    <span className="truncate" title={r.original_filename}>{r.original_filename}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => analyzeM.mutate(r.id)}
                        disabled={analyzeM.isPending || deleteM.isPending}
                        className="text-xs text-primary-glow hover:underline shrink-0"
                      >
                        Re-analyze
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to remove this resume?")) {
                            deleteM.mutate(r.id);
                          }
                        }}
                        disabled={analyzeM.isPending || deleteM.isPending}
                        className="text-xs text-red-400 hover:text-red-300 transition p-1"
                        title="Remove resume"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No uploads yet.</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {isPending && (
        <section className="px-6 pb-10">
          <div className="mx-auto max-w-5xl glass rounded-3xl p-6 flex items-center gap-3">
            <Loader2 className="size-5 animate-spin text-primary-glow" />
            <span className="text-sm">Extracting text and running AI analysis…</span>
          </div>
        </section>
      )}

      {latest && (
        <section className="px-6 pb-16">
          {/* Prominent Next Step Banner right after indexing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-5xl mb-6 glass-strong rounded-3xl p-6 border border-primary/30 flex flex-wrap items-center justify-between gap-4 shadow-xl"
            style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))" }}
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-glow shrink-0">
                <Sparkles className="size-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-primary-glow font-medium">Indexing Complete · Step 02 Ready</div>
                <h3 className="font-display text-xl font-semibold text-gradient mt-0.5">
                  Resume Indexed Successfully!
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Skill gaps identified against target role "{latest.target_role}". Generate your custom learning roadmap now.
                </p>
              </div>
            </div>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
              style={{ background: "var(--gradient-primary)" }}
            >
              Generate Roadmap <ArrowRight className="size-4" />
            </Link>
          </motion.div>
          {(() => {
            const raw = (latest.raw ?? {}) as {
              readiness_percent?: number;
              knowledge_remaining_percent?: number;
              estimated_learning_weeks?: number;
              readiness_verdict?: string;
            };
            const ready = Math.max(0, Math.min(100, Math.round(raw.readiness_percent ?? 0)));
            const remaining = Math.max(0, Math.min(100, Math.round(raw.knowledge_remaining_percent ?? 100 - ready)));
            const weeks = Math.max(0, Math.round(raw.estimated_learning_weeks ?? 0));
            return (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto max-w-5xl glass-strong rounded-3xl p-6 mb-4"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary-glow">
                  <Target className="size-3.5" /> AI Learning Readiness
                </div>
                <div className="mt-3 grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Ready today</div>
                    <div className="font-display text-5xl font-semibold text-gradient mt-1">{ready}%</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Still to learn</div>
                    <div className="font-display text-5xl font-semibold mt-1">{remaining}%</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Focused study</div>
                    <div className="font-display text-5xl font-semibold mt-1">
                      {weeks}<span className="text-lg text-muted-foreground ml-1">wks</span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${ready}%`, background: "var(--gradient-primary)" }}
                  />
                </div>
                {raw.readiness_verdict && (
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{raw.readiness_verdict}</p>
                )}
              </motion.div>
            );
          })()}

          <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-3xl p-6 md:col-span-1">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Overall score</div>
              <div className="font-display text-6xl font-semibold text-gradient mt-1">{latest.overall_score}</div>
              <div className="text-sm text-muted-foreground">for {latest.target_role}</div>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <Sparkles className="size-3 text-primary-glow" /> ATS {latest.ats_score}/100
              </div>
              {(() => {
                const salInfo = formatSalary(latest.salary_estimate as any);
                if (!salInfo) return null;
                return (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Salary estimate</div>
                    <div className="text-lg font-semibold mt-1 text-accent">
                      {salInfo.formatted}
                    </div>
                    <div className="text-xs text-muted-foreground">{salInfo.subtext}</div>
                  </div>
                );
              })()}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-3xl p-6 md:col-span-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">AI summary</div>
              <p className="mt-2 text-sm leading-relaxed">{latest.summary}</p>

              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-accent mb-2">Strengths</div>
                  <ul className="space-y-1.5 text-sm">
                    {(latest.strengths as string[]).map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="size-3.5 text-accent shrink-0 mt-0.5" /> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-primary-glow mb-2">What to learn next</div>
                  <ul className="space-y-2 text-sm">
                    {(latest.gaps as { skill: string; why_it_matters: string; hours_to_learn?: number; priority?: string }[]).map((g, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <BookOpen className="size-3.5 text-primary-glow shrink-0 mt-0.5" />
                        <span className="flex-1">
                          <span className="font-medium">{g.skill}</span>
                          {typeof g.hours_to_learn === "number" && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider glass rounded-full px-2 py-0.5 text-muted-foreground">
                              ~{g.hours_to_learn}h · {g.priority ?? "medium"}
                            </span>
                          )}
                          <div className="text-muted-foreground text-xs mt-0.5">{g.why_it_matters}</div>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {(latest.skills as { name: string; level: string }[]).map((s, i) => (
                  <span key={i} className="text-xs glass rounded-full px-2.5 py-1">
                    {s.name} <span className="text-muted-foreground">· {s.level}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>


          <div className="mx-auto max-w-5xl mt-6 glass rounded-3xl p-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Next step</div>
              <div className="font-display text-xl font-semibold mt-1">Generate your personalized roadmap</div>
            </div>
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 text-white font-medium px-5 py-3 rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            >
              Continue <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
