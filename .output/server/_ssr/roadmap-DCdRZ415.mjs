import { t as motion } from "../_libs/framer-motion.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { dt as numberType, ft as objectType, pt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { S as CircleCheck, b as Clock, g as Flame, h as GraduationCap, j as ArrowRight, k as BookOpen, l as RefreshCw, m as LoaderCircle, x as CirclePlay } from "../_libs/lucide-react.mjs";
import { n as Nav, t as Footer } from "./Footer-Xmt0aKIh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { r as createSsrRpc, s as useServerFn, t as WorkflowStepper } from "./resume.functions-D0DPUmq_.mjs";
import { t as useRequireResume } from "./use-require-resume-ByHbvQk0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmap-DCdRZ415.js
var import_jsx_runtime = require_jsx_runtime();
var getRoadmap = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d3cceba56919cbb94af74939db2ee2e54d9d81867be14c7329347b3946aadc2b"));
var generateNewRoadmap = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("3df0fe39f6dcdc253e530512cb3779e8fe7a82d488f9595449c6834cdbe9005e"));
var updateModuleProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	moduleId: stringType().uuid(),
	progressPct: numberType().min(0).max(100)
}).parse(input)).handler(createSsrRpc("72b01eacdc7b934d207fbf703919f4c1f90137b98416121cf63d75babfd36a11"));
function RoadmapPage() {
	useRequireResume("Your roadmap");
	const qc = useQueryClient();
	const getRoadmapFn = useServerFn(getRoadmap);
	const generateNewFn = useServerFn(generateNewRoadmap);
	const updateProgressFn = useServerFn(updateModuleProgress);
	const roadmapQ = useQuery({
		queryKey: ["roadmap"],
		queryFn: () => getRoadmapFn()
	});
	const generateM = useMutation({
		mutationFn: () => generateNewFn(),
		onSuccess: () => {
			toast.success("New personalized roadmap generated!");
			qc.invalidateQueries({ queryKey: ["roadmap"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Generation failed.")
	});
	const progressM = useMutation({
		mutationFn: ({ moduleId, progressPct }) => updateProgressFn({ data: {
			moduleId,
			progressPct
		} }),
		onSuccess: () => {
			toast.success("Module progress updated!");
			qc.invalidateQueries({ queryKey: ["roadmap"] });
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed.")
	});
	const roadmap = roadmapQ.data?.roadmap;
	const modules = roadmapQ.data?.modules || [];
	const totalWeeks = modules.reduce((acc, m) => acc + (m.estimated_weeks || 1), 0);
	const completedCount = modules.filter((m) => m.completed || m.progress_pct >= 100).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowStepper, { current: 2 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pt-10 pb-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-3",
							children: "Step 02 · Roadmap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight",
							children: "Your personalized learning path."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg text-muted-foreground max-w-2xl",
							children: roadmap?.summary || `Customized learning roadmap generated for "${roadmap?.target_role || "your target role"}". Prioritized by impact to bridge your resume skill gaps.`
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => generateM.mutate(),
						disabled: generateM.isPending || roadmapQ.isLoading,
						className: "inline-flex items-center gap-2 text-xs font-medium glass rounded-full px-4 py-2 hover:bg-white/10 transition shrink-0",
						children: generateM.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-3.5 animate-spin text-primary-glow" }), " Regenerating..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Re-generate AI Roadmap"] })
					})]
				})
			}),
			roadmapQ.isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl glass rounded-3xl p-10 text-center flex flex-col items-center justify-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-8 animate-spin text-primary-glow mb-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-medium",
							children: "Generating your custom roadmap from your resume..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground mt-1",
							children: "Analyzing skill gaps & structuring learning modules..."
						})
					]
				})
			}),
			roadmapQ.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-5xl glass rounded-3xl p-8 text-center text-red-400",
					children: roadmapQ.error instanceof Error ? roadmapQ.error.message : "Failed to load roadmap."
				})
			}),
			!roadmapQ.isLoading && !roadmapQ.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto max-w-5xl grid sm:grid-cols-3 gap-4",
						children: [
							{
								icon: BookOpen,
								label: "Total Modules",
								val: `${modules.length} modules`
							},
							{
								icon: Clock,
								label: "Estimated Time",
								val: `${totalWeeks} weeks`
							},
							{
								icon: Flame,
								label: "Completed",
								val: `${completedCount} of ${modules.length}`
							}
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-11 rounded-xl grid place-items-center bg-primary/15 text-primary-glow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-wider text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl font-semibold",
								children: s.val
							})] })]
						}, s.label))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-6 py-14",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-5xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between mb-6 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-2xl font-semibold",
								children: ["Prioritized Modules for ", roadmap?.target_role || "Target Role"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground mt-0.5",
								children: "Tailored specifically to fix your uploaded resume's skill gaps"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs glass rounded-full px-3 py-1 text-primary-glow font-medium",
								children: completedCount === modules.length && modules.length > 0 ? "All Modules Completed! 🎉" : "In Progress"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid md:grid-cols-2 gap-4",
							children: modules.map((m, i) => {
								const topics = m.topics || [];
								const isCompleted = m.completed || m.progress_pct >= 100;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
									initial: {
										opacity: 0,
										y: 16
									},
									animate: {
										opacity: 1,
										y: 0
									},
									transition: {
										duration: .4,
										delay: i * .05
									},
									className: "glass rounded-3xl p-6 flex flex-col justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs uppercase tracking-wider text-primary-glow font-medium",
												children: [
													"Priority ",
													i + 1,
													" · ",
													m.difficulty || "Intermediate"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl font-semibold mt-1",
												children: m.title
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "size-10 rounded-xl grid place-items-center bg-primary/15 text-primary-glow shrink-0",
												children: isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-5 text-accent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "size-5" })
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex flex-wrap gap-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "glass rounded-full px-2.5 py-1 text-muted-foreground",
												children: [m.estimated_weeks || 2, " weeks estimated"]
											}), isCompleted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "glass rounded-full px-2.5 py-1 text-accent font-medium",
												children: "Completed"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm mb-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Progress"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-medium",
													children: [m.progress_pct || 0, "%"]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-2 rounded-full bg-white/5 overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
													initial: { width: 0 },
													animate: { width: `${m.progress_pct || 0}%` },
													transition: { duration: .6 },
													className: "h-full rounded-full",
													style: { background: isCompleted ? "var(--color-accent, #10b981)" : "var(--gradient-primary)" }
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-5 flex flex-wrap gap-1.5",
											children: topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs glass rounded-full px-2.5 py-1 text-muted-foreground",
												children: t
											}, t))
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												const next = isCompleted ? 0 : Math.min(100, (m.progress_pct || 0) + 50);
												progressM.mutate({
													moduleId: m.id,
													progressPct: next
												});
											},
											disabled: progressM.isPending,
											className: "inline-flex items-center gap-2 text-xs font-medium text-white px-4 py-2 rounded-full transition-transform active:scale-95",
											style: { background: "var(--gradient-primary)" },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "size-3.5" }), isCompleted ? "Mark Incomplete" : m.progress_pct > 0 ? "Update Progress" : "Start Module"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => progressM.mutate({
												moduleId: m.id,
												progressPct: 100
											}),
											disabled: progressM.isPending || isCompleted,
											className: "text-xs text-muted-foreground hover:text-white transition",
											children: "Mark Done ✓"
										})]
									})]
								}, m.id || i);
							})
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "px-6 pb-24",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-auto max-w-5xl glass rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Next step"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-xl font-semibold mt-1",
								children: "Practice with an AI Mock Interview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground mt-1",
								children: [
									"Test your newly acquired skills against realistic interview questions tailored to ",
									roadmap?.target_role || "your role",
									"."
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/interview",
							className: "inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-full glow-primary transition-transform hover:scale-105",
							style: { background: "var(--gradient-primary)" },
							children: ["Continue to Interview ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { RoadmapPage as component };
