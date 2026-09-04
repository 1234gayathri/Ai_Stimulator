import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { generateMockTest, scoreMockTest, type MockQuestion, type RoundType } from "@/lib/interview.functions";

const ROUND_LABEL: Record<RoundType, string> = {
  hr: "HR Round",
  technical: "Technical Round",
  behavioral: "Behavioral Round",
  coding: "Coding Round",
  faang: "FAANG-style Round",
  campus: "Campus Placement Round",
};

interface MockTestProps {
  round?: RoundType;
  defaultRole?: string;
  autoStartKey?: number;
}

export function MockTest({ round = "technical", defaultRole = "Software Engineer", autoStartKey }: MockTestProps) {
  const [targetRole, setTargetRole] = useState(defaultRole);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<{
    score: number;
    correct: number;
    total: number;
    verdict: string;
    byTopic: Record<string, { correct: number; total: number }>;
  } | null>(null);

  const genFn = useServerFn(generateMockTest);
  const scoreFn = useServerFn(scoreMockTest);

  const genM = useMutation({
    mutationFn: () => genFn({ data: { targetRole, difficulty, count: 8, round } }),
    onSuccess: (d) => {
      setQuestions(d.questions);
      setAnswers(new Array(d.questions.length).fill(-1));
      setCurrent(0);
      setResult(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to generate test."),
  });

  const scoreM = useMutation({
    mutationFn: () => scoreFn({ data: { targetRole, questions, answers, round } }),
    onSuccess: (r) => setResult(r),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Scoring failed."),
  });

  // Auto-start when the user picks a round in the parent
  useEffect(() => {
    if (autoStartKey === undefined) return;
    setQuestions([]);
    setAnswers([]);
    setResult(null);
    if (targetRole.trim()) genM.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStartKey, round]);

  function selectOption(i: number) {
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
  }

  const q = questions[current];
  const allAnswered = answers.length > 0 && answers.every((a) => a >= 0);

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary-glow">
          <Sparkles className="size-3.5" /> AI Mock Test · {ROUND_LABEL[round]}
        </div>
        {(questions.length > 0 || result) && (
          <button
            onClick={() => { setQuestions([]); setAnswers([]); setResult(null); }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        )}
      </div>


      {questions.length === 0 && !result && (
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Target role</label>
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="e.g. Backend Engineer"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
              className="mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 bg-slate-950/80 text-foreground border border-white/10 cursor-pointer"
            >
              <option value="easy" className="bg-slate-900 text-foreground py-2">Easy</option>
              <option value="medium" className="bg-slate-900 text-foreground py-2">Medium</option>
              <option value="hard" className="bg-slate-900 text-foreground py-2">Hard</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              onClick={() => genM.mutate()}
              disabled={genM.isPending || !targetRole.trim()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              {genM.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {genM.isPending ? "Generating with AI…" : "Start Mock Test"}
            </button>
            <p className="text-xs text-muted-foreground mt-3">
              8 questions · mix of technical, aptitude, and behavioral · scored instantly.
            </p>
          </div>
        </div>
      )}

      {q && !result && (
        <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Question {current + 1} of {questions.length}</div>
            {q.topic && <div className="glass rounded-full px-2.5 py-0.5">{q.topic}</div>}
          </div>
          <div className="mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%`, background: "var(--gradient-primary)" }}
            />
          </div>

          <div className="mt-5 font-display text-lg md:text-xl leading-snug">{q.question}</div>

          <div className="mt-5 grid gap-2">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => selectOption(i)}
                  className={`text-left glass rounded-xl px-4 py-3 text-sm transition border ${
                    selected ? "border-primary/60 bg-white/[0.06]" : "border-transparent hover:border-white/10"
                  }`}
                >
                  <span className="text-muted-foreground mr-2">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              Back
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => setCurrent(current + 1)}
                disabled={answers[current] < 0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass font-medium disabled:opacity-50"
              >
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={() => scoreM.mutate()}
                disabled={!allAnswered || scoreM.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              >
                {scoreM.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                Submit for AI scoring
              </button>
            )}
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-2xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Score</div>
              <div className="font-display text-5xl font-semibold text-gradient mt-1">{result.score}</div>
              <div className="text-xs text-muted-foreground mt-1">{result.correct} / {result.total} correct</div>
            </div>
            <div className="glass rounded-2xl p-5 md:col-span-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">AI verdict</div>
              <p className="mt-2 text-sm leading-relaxed">{result.verdict}</p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(result.byTopic).map(([topic, s]) => {
                  const pct = Math.round((s.correct / Math.max(1, s.total)) * 100);
                  return (
                    <div key={topic} className="glass rounded-xl px-3 py-2 text-xs">
                      <div className="font-medium">{topic}</div>
                      <div className="text-muted-foreground">{s.correct}/{s.total} · {pct}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Review</div>
            <div className="space-y-3">
              {questions.map((qq, i) => {
                const ok = answers[i] === qq.correct_index;
                return (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="flex items-start gap-2 text-sm">
                      {ok ? <Check className="size-4 text-accent mt-0.5" /> : <X className="size-4 text-red-400 mt-0.5" />}
                      <div className="flex-1">
                        <div className="font-medium">{i + 1}. {qq.question}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Your answer: <span className={ok ? "text-accent" : "text-red-400"}>
                            {answers[i] >= 0 ? qq.options[answers[i]] : "—"}
                          </span>
                          {!ok && (
                            <> · Correct: <span className="text-accent">{qq.options[qq.correct_index]}</span></>
                          )}
                        </div>
                        {qq.explanation && (
                          <div className="text-xs text-muted-foreground mt-1 italic">{qq.explanation}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => { setQuestions([]); setAnswers([]); setResult(null); }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm"
          >
            <RefreshCw className="size-3.5" /> Take another test
          </button>
        </motion.div>
      )}
    </div>
  );
}
