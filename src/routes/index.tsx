import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Sparkles,
  Target,
  BookOpen,
  Mic,
  BarChart3,
  Brain,
  Trophy,
  ChevronRight,
  Video,
  TrendingUp,
} from "lucide-react";
import heroImg from "@/assets/hero-ai.jpg";
import dashboardImg from "@/assets/dashboard-preview.jpg";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Interview Simulator — Your AI Career Coach & Interview Mentor" },
      {
        name: "description",
        content:
          "Analyze your resume, close skill gaps, and ace interviews with a personal AI mentor. From resume score to placement probability — all in one platform.",
      },
      { property: "og:title", content: "AI Interview Simulator — AI Career Coach & Interview Platform" },
      {
        property: "og:description",
        content:
          "Resume intelligence, personalized learning roadmaps, and AI mock interviews with realtime evaluation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Landing() {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Journey />
      <DashboardShowcase />
      <Metrics />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-24 px-6 grid-bg">
      <div
        className="absolute inset-0 -z-10 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 400px at 50% 0%, oklch(0.62 0.22 275 / 0.35), transparent 70%)",
        }}
      />
      <div className="mx-auto max-w-5xl text-center">
        <motion.div {...fadeUp}>
          <div className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            Now with real-time interview evaluation
            <ChevronRight className="size-3" />
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.05 }}
          className="font-display text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05] text-gradient"
        >
          Your personal AI career
          <br /> mentor, available 24/7.
        </motion.h1>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.12 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          From resume analysis and personalized learning roadmaps to AI mock interviews
          with real-time evaluation — AI Interview Simulator gets you hired.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/resume"
            className="group inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-full transition hover:opacity-95 glow-primary"
            style={{ background: "var(--gradient-primary)" }}
          >
            Start with your resume
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/interview"
            className="inline-flex items-center gap-2 glass px-6 py-3.5 rounded-full font-medium hover:bg-white/5 transition"
          >
            <Video className="size-4" />
            Try mock interview
          </Link>
        </motion.div>

        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.28 }}
          className="mt-5 text-xs text-muted-foreground"
        >
          Free forever plan · No credit card required
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-6xl mt-16"
      >
        <div className="relative rounded-3xl overflow-hidden glass-strong p-2 shadow-[var(--shadow-elevated)]">
          <div
            className="absolute -inset-1 -z-10 rounded-3xl opacity-70 blur-2xl"
            style={{ background: "var(--gradient-primary)" }}
          />
          <img
            src={dashboardImg}
            alt="AI Interview Simulator AI career dashboard preview"
            width={1600}
            height={1008}
            className="rounded-2xl w-full"
          />
        </div>
        <FloatingStat
          className="hidden md:flex left-[-20px] top-[20%]"
          icon={<Trophy className="size-4 text-accent" />}
          label="Placement Probability"
          value="85%"
        />
        <FloatingStat
          className="hidden md:flex right-[-20px] top-[55%]"
          icon={<Target className="size-4 text-accent" />}
          label="Resume Score"
          value="82/100"
        />
      </motion.div>
    </section>
  );
}

function FloatingStat({
  className = "",
  icon,
  label,
  value,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className={`absolute glass-strong rounded-2xl px-4 py-3 shadow-[var(--shadow-elevated)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-lg grid place-items-center bg-primary/15">{icon}</div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="font-display text-lg font-semibold">{value}</div>
        </div>
      </div>
    </motion.div>
  );
}

function Journey() {
  const steps = [
    { n: "01", icon: FileText, title: "Upload your resume", desc: "PDF or DOCX. OCR handles scans. We parse skills, projects, experience, and certifications in seconds.", to: "/resume" as const },
    { n: "02", icon: Brain, title: "AI resume intelligence", desc: "Get resume score, ATS check, skill strength, career suitability, salary and placement probability.", to: "/resume" as const },
    { n: "03", icon: BookOpen, title: "Personalized learning roadmap", desc: "Prioritized topics with difficulty, time estimates, and progress tracking to close every skill gap.", to: "/roadmap" as const },
    { n: "04", icon: Mic, title: "AI mock interview", desc: "Dynamic HR, technical, behavioral and coding rounds. Voice, video, and text with realtime evaluation.", to: "/interview" as const },
    { n: "05", icon: BarChart3, title: "Final employability report", desc: "Interview readiness, recruiter impression, question-wise feedback, and a 30/60/90 day action plan.", to: "/report" as const },
  ];
  return (
    <section id="journey" className="py-32 px-6">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="The workflow"
          title="From resume to offer letter, in one path."
          desc="A guided workflow that adapts to your goals, tracks progress, and holds you accountable. Every step is its own page — you can jump in anywhere."
        />
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
            >
              <Link
                to={s.to}
                className="block glass rounded-2xl p-5 hover:bg-white/[0.04] transition group h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="size-10 rounded-xl grid place-items-center bg-primary/15 text-primary-glow group-hover:scale-105 transition">
                    <s.icon className="size-5" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{s.n}</span>
                </div>
                <h3 className="font-display font-semibold text-lg leading-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-primary-glow">
                  Open <ArrowRight className="size-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <div className="max-w-3xl">
      <motion.div {...fadeUp} className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-4">
        {eyebrow}
      </motion.div>
      <motion.h2
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.05 }}
        className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-gradient"
      >
        {title}
      </motion.h2>
      {desc && (
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
          className="mt-4 text-lg text-muted-foreground"
        >
          {desc}
        </motion.p>
      )}
    </div>
  );
}

function DashboardShowcase() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-14 items-center">
        <motion.div {...fadeUp}>
          <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-4">Command center</div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-gradient">
            One workflow. Four focused pages.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each stage of your career prep is its own dedicated page — deep, focused,
            and shareable — with a stepper that keeps the whole journey coherent.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/resume" className="glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition">Resume →</Link>
            <Link to="/roadmap" className="glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition">Roadmap →</Link>
            <Link to="/interview" className="glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition">Interview →</Link>
            <Link to="/report" className="glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition">Report →</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="glass-strong rounded-3xl p-2 shadow-[var(--shadow-elevated)]">
            <img
              src={heroImg}
              alt="AI neural network processing career signals"
              width={1600}
              height={1200}
              loading="lazy"
              className="rounded-2xl aspect-[4/3] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Metrics() {
  const m = [
    { v: "2.4M+", l: "Resumes analyzed" },
    { v: "94%", l: "Interview-ready in 30 days" },
    { v: "180+", l: "Skill dimensions tracked" },
    { v: "4.9/5", l: "Student rating" },
  ];
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl glass-strong rounded-3xl p-10 md:p-14 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, oklch(0.62 0.22 275 / 0.5), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.72 0.2 285 / 0.4), transparent 50%)",
          }}
        />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {m.map((x) => (
            <div key={x.l}>
              <div className="font-display text-4xl md:text-5xl font-semibold text-gradient">{x.v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{x.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-32 px-6">
      <div className="mx-auto max-w-4xl relative">
        <div
          className="absolute -inset-8 rounded-[3rem] blur-3xl opacity-40 -z-10"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div className="glass-strong rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-40" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-6xl font-semibold text-gradient tracking-tight">
              Start with your resume.
              <br /> End with an offer.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
              Sign up in 30 seconds and get your first AI employability report free.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/resume"
                className="inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-full glow-primary hover:opacity-95 transition"
                style={{ background: "var(--gradient-primary)" }}
              >
                Begin the workflow <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 glass px-6 py-3.5 rounded-full font-medium"
              >
                <TrendingUp className="size-4" /> See pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
