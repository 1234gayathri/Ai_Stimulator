import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — AI Interview Simulator" },
      { name: "description", content: "Answers about AI Interview Simulator's AI resume analysis, interview formats, data privacy, video requirements, and pricing." },
      { property: "og:title", content: "FAQ — AI Interview Simulator" },
      { property: "og:description", content: "Answers, before you ask." },
    ],
  }),
  component: FAQPage,
});

function FAQPage() {
  const items = [
    { q: "How accurate is the AI resume analysis?", a: "Our models are fine-tuned on 2M+ resumes and continuously validated against real hiring outcomes. Expect scoring within 5% of a senior recruiter's review." },
    { q: "What interview formats are supported?", a: "HR, technical, behavioral, coding, FAANG-style, startup, and campus placement rounds. Questions are generated dynamically from your resume and target role." },
    { q: "Is my data private?", a: "Yes. Your resume and interview recordings are encrypted at rest, never sold, and can be deleted at any time." },
    { q: "Can I use it without a webcam?", a: "Absolutely. Voice and text-only interviews are fully supported — video is optional for confidence and eye-contact scoring." },
    { q: "Do you support non-English interviews?", a: "English is the default. We're expanding to Hindi, Spanish, and French — join the waitlist from your dashboard." },
    { q: "Can universities deploy AI Interview Simulator to a full cohort?", a: "Yes — our Campus plan includes admin dashboards, cohort analytics, SSO, and LMS integration." },
  ];

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Nav />
      <section className="px-6 pt-36 pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-xs uppercase tracking-[0.2em] text-primary-glow mb-4">FAQ</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight">
            Answers, before you ask.
          </h1>
          <div className="mt-10 space-y-3">
            {items.map((i) => (
              <details key={i.q} className="glass rounded-2xl p-6 group">
                <summary className="flex items-center justify-between cursor-pointer font-medium list-none">
                  {i.q}
                  <ChevronRight className="size-4 transition group-open:rotate-90" />
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{i.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
