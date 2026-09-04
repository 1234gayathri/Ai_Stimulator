import { t as motion } from "../_libs/framer-motion.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as Check } from "../_libs/lucide-react.mjs";
import { n as Nav, t as Footer } from "./Footer-Xmt0aKIh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-C_LxwvSN.js
var import_jsx_runtime = require_jsx_runtime();
var fadeUp = {
	initial: {
		opacity: 0,
		y: 20
	},
	whileInView: {
		opacity: 1,
		y: 0
	},
	viewport: {
		once: true,
		margin: "-60px"
	},
	transition: { duration: .5 }
};
function PricingPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "px-6 pt-36 pb-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-4",
							children: "Pricing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-6xl font-semibold text-gradient tracking-tight",
							children: "Simple, honest pricing."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg text-muted-foreground",
							children: "Free for students. Pro for job-seekers. Custom for campuses."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl mt-14 grid md:grid-cols-3 gap-4",
					children: [
						{
							name: "Starter",
							price: "Free",
							desc: "For students exploring their potential.",
							features: [
								"1 resume analysis",
								"Basic ATS check",
								"Skill gap preview",
								"3 mock interviews / month"
							],
							cta: "Get started",
							to: "/resume",
							highlight: false
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
								"Recruiter impression score"
							],
							cta: "Start Pro trial",
							to: "/auth",
							highlight: true
						},
						{
							name: "Campus",
							price: "Custom",
							desc: "For universities and bootcamps.",
							features: [
								"Admin dashboard",
								"Cohort analytics",
								"Custom question bank",
								"SSO & LMS integration"
							],
							cta: "Talk to us",
							to: "/auth",
							highlight: false
						}
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						className: `rounded-3xl p-8 relative ${t.highlight ? "glass-strong glow-primary" : "glass"}`,
						children: [
							t.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white",
								style: { background: "var(--gradient-primary)" },
								children: "Most popular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-lg font-semibold",
								children: t.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-5xl font-semibold",
									children: t.price
								}), t.period && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: t.period
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: t.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-6 space-y-3",
								children: t.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: f })]
								}, f))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: t.to,
								className: `mt-8 block text-center w-full py-3 rounded-full font-medium transition ${t.highlight ? "text-white hover:opacity-90" : "glass hover:bg-white/5"}`,
								style: t.highlight ? { background: "var(--gradient-primary)" } : void 0,
								children: t.cta
							})
						]
					}, t.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { PricingPage as component };
