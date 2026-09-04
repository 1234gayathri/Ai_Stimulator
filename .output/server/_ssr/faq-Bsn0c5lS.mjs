import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { w as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Nav, t as Footer } from "./Footer-Xmt0aKIh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-Bsn0c5lS.js
var import_jsx_runtime = require_jsx_runtime();
function FAQPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pt-36 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-4",
							children: "FAQ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight",
							children: "Answers, before you ask."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 space-y-3",
							children: [
								{
									q: "How accurate is the AI resume analysis?",
									a: "Our models are fine-tuned on 2M+ resumes and continuously validated against real hiring outcomes. Expect scoring within 5% of a senior recruiter's review."
								},
								{
									q: "What interview formats are supported?",
									a: "HR, technical, behavioral, coding, FAANG-style, startup, and campus placement rounds. Questions are generated dynamically from your resume and target role."
								},
								{
									q: "Is my data private?",
									a: "Yes. Your resume and interview recordings are encrypted at rest, never sold, and can be deleted at any time."
								},
								{
									q: "Can I use it without a webcam?",
									a: "Absolutely. Voice and text-only interviews are fully supported — video is optional for confidence and eye-contact scoring."
								},
								{
									q: "Do you support non-English interviews?",
									a: "English is the default. We're expanding to Hindi, Spanish, and French — join the waitlist from your dashboard."
								},
								{
									q: "Can universities deploy AI Interview Simulator to a full cohort?",
									a: "Yes — our Campus plan includes admin dashboards, cohort analytics, SSO, and LMS integration."
								}
							].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "glass rounded-2xl p-6 group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("summary", {
									className: "flex items-center justify-between cursor-pointer font-medium list-none",
									children: [i.q, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4 transition group-open:rotate-90" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm text-muted-foreground leading-relaxed",
									children: i.a
								})]
							}, i.q))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { FAQPage as component };
