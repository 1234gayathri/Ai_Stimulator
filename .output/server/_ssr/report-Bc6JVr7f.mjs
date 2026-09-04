import { t as motion } from "../_libs/framer-motion.mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as Award, D as Calendar, c as Share2, i as TrendingUp, j as ArrowRight, m as LoaderCircle, r as Trophy, y as Download } from "../_libs/lucide-react.mjs";
import { n as Nav, t as Footer } from "./Footer-Xmt0aKIh.mjs";
import { a as listAnalyses, s as useServerFn, t as WorkflowStepper } from "./resume.functions-D0DPUmq_.mjs";
import { t as useRequireResume } from "./use-require-resume-ByHbvQk0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-Bc6JVr7f.js
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
function ReportPage() {
	useRequireResume("Your report");
	const listAnalysesFn = useServerFn(listAnalyses);
	const { data, isLoading } = useQuery({
		queryKey: ["analyses"],
		queryFn: () => listAnalysesFn()
	});
	const latest = data?.[0];
	if (isLoading || !latest) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowStepper, { current: 4 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-6 py-24 flex items-center gap-3 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-primary-glow" }), "Loading your report…"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const raw = latest.raw ?? {};
	const overall = Math.round(latest.overall_score ?? 0);
	const ats = Math.round(latest.ats_score ?? 0);
	const ready = Math.max(0, Math.min(100, Math.round(raw.readiness_percent ?? overall)));
	const remaining = Math.max(0, Math.min(100, Math.round(raw.knowledge_remaining_percent ?? 100 - ready)));
	const weeks = Math.max(0, Math.round(raw.estimated_learning_weeks ?? Math.ceil(remaining / 10)));
	const skills = latest.skills ?? [];
	const strengths = latest.strengths ?? [];
	const gaps = latest.gaps ?? [];
	const salary = latest.salary_estimate;
	const scores = [
		{
			label: "Overall employability",
			val: overall
		},
		{
			label: "ATS parseability",
			val: ats
		},
		{
			label: "Interview readiness",
			val: ready
		},
		{
			label: "Knowledge remaining",
			val: remaining
		}
	];
	const critical = gaps.filter((g) => (g.priority ?? "medium").toLowerCase() === "critical");
	const high = gaps.filter((g) => (g.priority ?? "medium").toLowerCase() === "high");
	const rest = gaps.filter((g) => !["critical", "high"].includes((g.priority ?? "medium").toLowerCase()));
	const plan = [
		{
			period: "30 days",
			focus: critical.length ? `Close critical gaps: ${critical.slice(0, 3).map((g) => g.skill).join(", ")}` : "Reinforce top strengths and build 2 portfolio artifacts."
		},
		{
			period: "60 days",
			focus: high.length ? `Level up high-priority skills: ${high.slice(0, 3).map((g) => g.skill).join(", ")}` : "Mock interviews 2× per week and refine STAR stories."
		},
		{
			period: "90 days",
			focus: rest.length ? `Round out with: ${rest.slice(0, 3).map((g) => g.skill).join(", ")}` : "Recruiter outreach + targeted applications for the target role."
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowStepper, { current: 4 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pt-10 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-3",
							children: "Step 04 · Report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight",
							children: "Your employability report."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-lg text-muted-foreground max-w-2xl",
							children: [
								"Generated live from your uploaded resume for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-foreground font-medium",
									children: latest.target_role
								}),
								"."
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => navigator.share?.({
								title: "My employability report",
								text: raw.readiness_verdict ?? latest.summary ?? ""
							}).catch(() => {}),
							className: "inline-flex items-center gap-2 glass px-4 py-2.5 rounded-full text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), " Share"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => window.print(),
							className: "inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-full text-sm font-medium",
							style: { background: "var(--gradient-primary)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " Download PDF"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-5xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						className: "glass-strong rounded-3xl p-10 relative overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -top-20 -right-20 size-72 rounded-full opacity-30 blur-3xl",
							style: { background: "var(--gradient-primary)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative grid md:grid-cols-2 gap-8 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "Overall Employability"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex items-baseline gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-8xl font-semibold text-gradient",
										children: overall
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-2xl text-muted-foreground",
										children: "/100"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 inline-flex items-center gap-1.5 text-sm text-accent",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }),
										" Ready today: ",
										ready,
										"% · ",
										weeks,
										" wks to hire-ready"
									]
								}),
								latest.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm text-muted-foreground leading-relaxed",
									children: latest.summary
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [scores.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: s.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [s.val, "%"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 rounded-full bg-white/5 overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: { width: 0 },
										whileInView: { width: `${s.val}%` },
										viewport: { once: true },
										transition: { duration: 1 },
										className: "h-full rounded-full",
										style: { background: "var(--gradient-primary)" }
									})
								})] }, s.label)), salary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-4 border-t border-white/5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs uppercase tracking-widest text-muted-foreground",
											children: "Salary estimate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-lg font-semibold mt-1",
											children: [
												salary.currency,
												" ",
												salary.min?.toLocaleString(),
												"–",
												salary.max?.toLocaleString()
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: salary.region
										})
									]
								})]
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl grid md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						className: "glass rounded-3xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-semibold",
									children: "Strengths"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2 text-sm",
								children: strengths.length ? strengths.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-accent",
										children: "•"
									}), s]
								}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-muted-foreground",
									children: "No strengths detected yet."
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 flex flex-wrap gap-1.5",
								children: skills.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs glass rounded-full px-2.5 py-1",
									children: [
										s.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["· ", s.level]
										})
									]
								}, i))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: .06
						},
						className: "glass rounded-3xl p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5 text-primary-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Gaps to close"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3 text-sm",
							children: gaps.length ? gaps.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: g.skill
								}), typeof g.hours_to_learn === "number" && g.hours_to_learn > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] uppercase tracking-wider glass rounded-full px-2 py-0.5 text-muted-foreground",
									children: [
										"~",
										g.hours_to_learn,
										"h · ",
										g.priority ?? "medium"
									]
								})]
							}), g.why_it_matters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground text-xs mt-0.5",
								children: g.why_it_matters
							})] }, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "text-muted-foreground",
								children: "No gaps identified."
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pb-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-5 text-primary-glow" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-semibold",
							children: "Your 30 / 60 / 90 day plan"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid md:grid-cols-3 gap-4",
						children: plan.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							...fadeUp,
							transition: {
								...fadeUp.transition,
								delay: i * .06
							},
							className: "glass rounded-2xl p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-primary-glow",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-widest",
									children: p.period
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-base leading-relaxed",
								children: p.focus
							})]
						}, p.period))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl glass rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Keep going"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-semibold mt-1",
						children: "Restart the workflow to level up further"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/roadmap",
							className: "inline-flex items-center gap-2 glass px-4 py-2.5 rounded-full text-sm font-medium",
							children: "Update roadmap"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/interview",
							className: "inline-flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-full glow-primary text-sm",
							style: { background: "var(--gradient-primary)" },
							children: ["New interview ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ReportPage as component };
