import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — AI Interview Simulator" },
      { name: "description", content: "Simple, honest pricing. Free forever plan for students. Pro for unlimited AI mock interviews and full employability reports. Custom plans for campuses." },
      { property: "og:title", content: "Pricing — AI Interview Simulator" },
      { property: "og:description", content: "Free for students. Pro for job-seekers. Custom for campuses." },
    ],
  }),
  component: PricingPage,
});

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "Free",
      desc: "For students exploring their potential.",
      features: ["1 resume analysis", "Basic ATS check", "Skill gap preview", "3 mock interviews / month"],
      cta: "Get started",
      to: "/resume" as const,
      highlight: false,
    },
    {
      name: "Pro",
      price: "$12",
      period: "/mo",
      desc: "Everything you need to land offers.",
      features: [
        "Unlimited resume analyses",
        "Full employability report (PDF)",
        "Personalized roadmap + tracking",
        "Unlimited AI mock interviews",
        "Video + voice evaluation",
        "Recruiter impression score",
      ],
      cta: "Start Pro trial",
      to: "/auth" as const,
      highlight: true,
    },
    {
      name: "Campus",
      price: "Custom",
      desc: "For universities and bootcamps.",
      features: ["Admin dashboard", "Cohort analytics", "Custom question bank", "SSO & LMS integration"],
      cta: "Talk to us",
      to: "/auth" as const,
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <section className="px-6 pt-36 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-4">Pricing</div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-gradient tracking-tight">
            Simple, honest pricing.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Free for students. Pro for job-seekers. Custom for campuses.
          </p>
        </div>

        <div className="mx-auto max-w-6xl mt-14 grid md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <motion.div
              key={t.name}
              {...fadeUp}
              className={`rounded-3xl p-8 relative ${t.highlight ? "glass-strong glow-primary" : "glass"}`}
            >
              {t.highlight && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  Most popular
                </div>
              )}
              <div className="font-display text-lg font-semibold">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <div className="font-display text-5xl font-semibold">{t.price}</div>
                {t.period && <div className="text-muted-foreground">{t.period}</div>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="size-4 text-accent mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={t.to}
                className={`mt-8 block text-center w-full py-3 rounded-full font-medium transition ${
                  t.highlight ? "text-white hover:opacity-90" : "glass hover:bg-white/5"
                }`}
                style={t.highlight ? { background: "var(--gradient-primary)" } : undefined}
              >
                {t.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
