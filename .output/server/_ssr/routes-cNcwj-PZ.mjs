import { t as motion } from "../_libs/framer-motion.mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ChartColumn, O as Brain, i as TrendingUp, j as ArrowRight, k as BookOpen, n as Video, o as Target, r as Trophy, u as Mic, v as FileText, w as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Nav, t as Footer } from "./Footer-Xmt0aKIh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-cNcwj-PZ.js
var import_jsx_runtime = require_jsx_runtime();
var hero_ai_default = "/assets/hero-ai-DNEPr7Zq.jpg";
var dashboard_preview_default = "/assets/dashboard-preview-DMtArcOQ.jpg";
var fadeUp = {
	initial: {
		opacity: 0,
		y: 24
	},
	whileInView: {
		opacity: 1,
		y: 0
	},
	viewport: {
		once: true,
		margin: "-80px"
	},
	transition: {
		duration: .6,
		ease: [
			.22,
			1,
			.36,
			1
		]
	}
};
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Journey, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardShowcase, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Metrics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative pt-40 pb-24 px-6 grid-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 -z-10 opacity-40 pointer-events-none",
				style: { background: "radial-gradient(600px 400px at 50% 0%, oklch(0.62 0.22 275 / 0.35), transparent 70%)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						...fadeUp,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs text-muted-foreground mb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent animate-pulse" }),
								"Now with real-time interview evaluation",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-3" })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.h1, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: .05
						},
						className: "font-display text-5xl md:text-7xl font-semibold tracking-tighter leading-[1.05] text-gradient",
						children: [
							"Your personal AI career",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							" mentor, available 24/7."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: .12
						},
						className: "mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto",
						children: "From resume analysis and personalized learning roadmaps to AI mock interviews with real-time evaluation — AI Interview Simulator gets you hired."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: .2
						},
						className: "mt-9 flex flex-wrap items-center justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/resume",
							className: "group inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-full transition hover:opacity-95 glow-primary",
							style: { background: "var(--gradient-primary)" },
							children: ["Start with your resume", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition group-hover:translate-x-0.5" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/interview",
							className: "inline-flex items-center gap-2 glass px-6 py-3.5 rounded-full font-medium hover:bg-white/5 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), "Try mock interview"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: .28
						},
						className: "mt-5 text-xs text-muted-foreground",
						children: "Free forever plan · No credit card required"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 40
				},
				whileInView: {
					opacity: 1,
					y: 0
				},
				viewport: { once: true },
				transition: {
					duration: .9,
					ease: [
						.22,
						1,
						.36,
						1
					]
				},
				className: "relative mx-auto max-w-6xl mt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative rounded-3xl overflow-hidden glass-strong p-2 shadow-[var(--shadow-elevated)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute -inset-1 -z-10 rounded-3xl opacity-70 blur-2xl",
							style: { background: "var(--gradient-primary)" }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: dashboard_preview_default,
							alt: "AI Interview Simulator AI career dashboard preview",
							width: 1600,
							height: 1008,
							className: "rounded-2xl w-full"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingStat, {
						className: "hidden md:flex left-[-20px] top-[20%]",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "size-4 text-accent" }),
						label: "Placement Probability",
						value: "85%"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloatingStat, {
						className: "hidden md:flex right-[-20px] top-[55%]",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4 text-accent" }),
						label: "Resume Score",
						value: "82/100"
					})
				]
			})
		]
	});
}
function FloatingStat({ className = "", icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			scale: .9
		},
		whileInView: {
			opacity: 1,
			scale: 1
		},
		viewport: { once: true },
		transition: {
			delay: .6,
			duration: .5
		},
		className: `absolute glass-strong rounded-2xl px-4 py-3 shadow-[var(--shadow-elevated)] ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "size-9 rounded-lg grid place-items-center bg-primary/15",
				children: icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-lg font-semibold",
				children: value
			})] })]
		})
	});
}
function Journey() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "journey",
		className: "py-32 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "The workflow",
				title: "From resume to offer letter, in one path.",
				desc: "A guided workflow that adapts to your goals, tracks progress, and holds you accountable. Every step is its own page — you can jump in anywhere."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 grid md:grid-cols-2 lg:grid-cols-5 gap-4",
				children: [
					{
						n: "01",
						icon: FileText,
						title: "Upload your resume",
						desc: "PDF or DOCX. OCR handles scans. We parse skills, projects, experience, and certifications in seconds.",
						to: "/resume"
					},
					{
						n: "02",
						icon: Brain,
						title: "AI resume intelligence",
						desc: "Get resume score, ATS check, skill strength, career suitability, salary and placement probability.",
						to: "/resume"
					},
					{
						n: "03",
						icon: BookOpen,
						title: "Personalized learning roadmap",
						desc: "Prioritized topics with difficulty, time estimates, and progress tracking to close every skill gap.",
						to: "/roadmap"
					},
					{
						n: "04",
						icon: Mic,
						title: "AI mock interview",
						desc: "Dynamic HR, technical, behavioral and coding rounds. Voice, video, and text with realtime evaluation.",
						to: "/interview"
					},
					{
						n: "05",
						icon: ChartColumn,
						title: "Final employability report",
						desc: "Interview readiness, recruiter impression, question-wise feedback, and a 30/60/90 day action plan.",
						to: "/report"
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					...fadeUp,
					transition: {
						...fadeUp.transition,
						delay: i * .06
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: s.to,
						className: "block glass rounded-2xl p-5 hover:bg-white/[0.04] transition group h-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-10 rounded-xl grid place-items-center bg-primary/15 text-primary-glow group-hover:scale-105 transition",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground font-mono",
									children: s.n
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-semibold text-lg leading-tight",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground leading-relaxed",
								children: s.desc
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 inline-flex items-center gap-1.5 text-xs text-primary-glow",
								children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3" })]
							})
						]
					})
				}, s.n))
			})]
		})
	});
}
function SectionHeader({ eyebrow, title, desc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				...fadeUp,
				className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-4",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
				...fadeUp,
				transition: {
					...fadeUp.transition,
					delay: .05
				},
				className: "font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-gradient",
				children: title
			}),
			desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
				...fadeUp,
				transition: {
					...fadeUp.transition,
					delay: .1
				},
				className: "mt-4 text-lg text-muted-foreground",
				children: desc
			})
		]
	});
}
function DashboardShowcase() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-32 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl grid lg:grid-cols-2 gap-14 items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				...fadeUp,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-4",
						children: "Command center"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-gradient",
						children: "One workflow. Four focused pages."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-lg text-muted-foreground",
						children: "Each stage of your career prep is its own dedicated page — deep, focused, and shareable — with a stepper that keeps the whole journey coherent."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/resume",
								className: "glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition",
								children: "Resume →"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/roadmap",
								className: "glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition",
								children: "Roadmap →"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/interview",
								className: "glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition",
								children: "Interview →"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/report",
								className: "glass rounded-full px-4 py-2 text-sm hover:bg-white/[0.06] transition",
								children: "Report →"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					x: 40
				},
				whileInView: {
					opacity: 1,
					x: 0
				},
				viewport: { once: true },
				transition: { duration: .8 },
				className: "relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "glass-strong rounded-3xl p-2 shadow-[var(--shadow-elevated)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: hero_ai_default,
						alt: "AI neural network processing career signals",
						width: 1600,
						height: 1200,
						loading: "lazy",
						className: "rounded-2xl aspect-[4/3] object-cover"
					})
				})
			})]
		})
	});
}
function Metrics() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-24 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl glass-strong rounded-3xl p-10 md:p-14 relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 opacity-20 pointer-events-none",
				style: { background: "radial-gradient(circle at 20% 20%, oklch(0.62 0.22 275 / 0.5), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.72 0.2 285 / 0.4), transparent 50%)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center",
				children: [
					{
						v: "2.4M+",
						l: "Resumes analyzed"
					},
					{
						v: "94%",
						l: "Interview-ready in 30 days"
					},
					{
						v: "180+",
						l: "Skill dimensions tracked"
					},
					{
						v: "4.9/5",
						l: "Student rating"
					}
				].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-4xl md:text-5xl font-semibold text-gradient",
					children: x.v
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 text-sm text-muted-foreground",
					children: x.l
				})] }, x.l))
			})]
		})
	});
}
function CTA() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "py-32 px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute -inset-8 rounded-[3rem] blur-3xl opacity-40 -z-10",
				style: { background: "var(--gradient-primary)" }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass-strong rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 grid-bg opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-4xl md:text-6xl font-semibold text-gradient tracking-tight",
							children: [
								"Start with your resume.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								" End with an offer."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-lg text-muted-foreground max-w-xl mx-auto",
							children: "Sign up in 30 seconds and get your first AI employability report free."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-9 flex flex-wrap justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/resume",
								className: "inline-flex items-center gap-2 text-white font-medium px-6 py-3.5 rounded-full glow-primary hover:opacity-95 transition",
								style: { background: "var(--gradient-primary)" },
								children: ["Begin the workflow ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/pricing",
								className: "inline-flex items-center gap-2 glass px-6 py-3.5 rounded-full font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4" }), " See pricing"]
							})]
						})
					]
				})]
			})]
		})
	});
}
//#endregion
export { Landing as component };
