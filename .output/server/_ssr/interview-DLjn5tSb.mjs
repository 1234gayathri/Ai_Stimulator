import { o as __toESM } from "../_runtime.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { a as require_jsx_runtime, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { ct as arrayType, dt as numberType, ft as objectType, pt as stringType, ut as enumType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { T as Check, d as MessageSquare, j as ArrowRight, l as RefreshCw, m as LoaderCircle, n as Video, s as Sparkles, t as X, u as Mic, w as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Nav, t as Footer } from "./Footer-Xmt0aKIh.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { r as createSsrRpc, s as useServerFn, t as WorkflowStepper } from "./resume.functions-D0DPUmq_.mjs";
import { t as useRequireResume } from "./use-require-resume-ByHbvQk0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/interview-DLjn5tSb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROUND_TYPES = [
	"hr",
	"technical",
	"behavioral",
	"coding",
	"faang",
	"campus"
];
var GenerateInput = objectType({
	targetRole: stringType().min(1).max(200),
	difficulty: enumType([
		"easy",
		"medium",
		"hard"
	]).optional().default("medium"),
	count: numberType().int().min(3).max(15).optional().default(8),
	round: enumType(ROUND_TYPES).optional().default("technical")
});
var QuestionSchema = objectType({
	question: stringType(),
	options: arrayType(stringType()),
	correct_index: numberType(),
	explanation: stringType().optional().default(""),
	topic: stringType().optional().default("")
});
var generateMockTest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => GenerateInput.parse(input)).handler(createSsrRpc("dea2c0f0d7c5166c4b229ea96bd952ce385769bafbbdf4f9d10e0475bf9229aa"));
var ScoreInput = objectType({
	targetRole: stringType(),
	questions: arrayType(QuestionSchema),
	answers: arrayType(numberType().int()),
	round: enumType(ROUND_TYPES).optional().default("technical")
});
var scoreMockTest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ScoreInput.parse(input)).handler(createSsrRpc("217d79316c4896d2de8cc5c4d66f230a4baac4878626bd01aac6637e23aa3e54"));
var ROUND_LABEL = {
	hr: "HR Round",
	technical: "Technical Round",
	behavioral: "Behavioral Round",
	coding: "Coding Round",
	faang: "FAANG-style Round",
	campus: "Campus Placement Round"
};
function MockTest({ round = "technical", defaultRole = "Software Engineer", autoStartKey }) {
	const [targetRole, setTargetRole] = (0, import_react.useState)(defaultRole);
	const [difficulty, setDifficulty] = (0, import_react.useState)("medium");
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [current, setCurrent] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const genFn = useServerFn(generateMockTest);
	const scoreFn = useServerFn(scoreMockTest);
	const genM = useMutation({
		mutationFn: () => genFn({ data: {
			targetRole,
			difficulty,
			count: 8,
			round
		} }),
		onSuccess: (d) => {
			setQuestions(d.questions);
			setAnswers(new Array(d.questions.length).fill(-1));
			setCurrent(0);
			setResult(null);
		},
		onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to generate test.")
	});
	const scoreM = useMutation({
		mutationFn: () => scoreFn({ data: {
			targetRole,
			questions,
			answers,
			round
		} }),
		onSuccess: (r) => setResult(r),
		onError: (e) => toast.error(e instanceof Error ? e.message : "Scoring failed.")
	});
	(0, import_react.useEffect)(() => {
		if (autoStartKey === void 0) return;
		setQuestions([]);
		setAnswers([]);
		setResult(null);
		if (targetRole.trim()) genM.mutate();
	}, [autoStartKey, round]);
	function selectOption(i) {
		const next = [...answers];
		next[current] = i;
		setAnswers(next);
	}
	const q = questions[current];
	const allAnswered = answers.length > 0 && answers.every((a) => a >= 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-strong rounded-3xl p-6 md:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs uppercase tracking-widest text-primary-glow",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }),
						" AI Mock Test · ",
						ROUND_LABEL[round]
					]
				}), (questions.length > 0 || result) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setQuestions([]);
						setAnswers([]);
						setResult(null);
					},
					className: "text-xs text-muted-foreground hover:text-foreground",
					children: "Reset"
				})]
			}),
			questions.length === 0 && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid md:grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs uppercase tracking-widest text-muted-foreground",
							children: "Target role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: targetRole,
							onChange: (e) => setTargetRole(e.target.value),
							className: "mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40",
							placeholder: "e.g. Backend Engineer"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Difficulty"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: difficulty,
						onChange: (e) => setDifficulty(e.target.value),
						className: "mt-2 w-full glass rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "easy",
								children: "Easy"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "medium",
								children: "Medium"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "hard",
								children: "Hard"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => genM.mutate(),
							disabled: genM.isPending || !targetRole.trim(),
							className: "inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium disabled:opacity-50",
							style: { background: "var(--gradient-primary)" },
							children: [genM.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), genM.isPending ? "Generating with AI…" : "Start Mock Test"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-3",
							children: "8 questions · mix of technical, aptitude, and behavioral · scored instantly."
						})]
					})
				]
			}),
			q && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"Question ",
							current + 1,
							" of ",
							questions.length
						] }), q.topic && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "glass rounded-full px-2.5 py-0.5",
							children: q.topic
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-1 rounded-full bg-white/[0.06] overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full transition-all",
							style: {
								width: `${(current + 1) / questions.length * 100}%`,
								background: "var(--gradient-primary)"
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 font-display text-lg md:text-xl leading-snug",
						children: q.question
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-2",
						children: q.options.map((opt, i) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => selectOption(i),
								className: `text-left glass rounded-xl px-4 py-3 text-sm transition border ${answers[current] === i ? "border-primary/60 bg-white/[0.06]" : "border-transparent hover:border-white/10"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground mr-2",
									children: [String.fromCharCode(65 + i), "."]
								}), opt]
							}, i);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCurrent(Math.max(0, current - 1)),
							disabled: current === 0,
							className: "text-sm text-muted-foreground hover:text-foreground disabled:opacity-40",
							children: "Back"
						}), current < questions.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setCurrent(current + 1),
							disabled: answers[current] < 0,
							className: "inline-flex items-center gap-2 px-4 py-2 rounded-full glass font-medium disabled:opacity-50",
							children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => scoreM.mutate(),
							disabled: !allAnswered || scoreM.isPending,
							className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium disabled:opacity-50",
							style: { background: "var(--gradient-primary)" },
							children: [scoreM.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), "Submit for AI scoring"]
						})]
					})
				]
			}, current),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "Score"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-5xl font-semibold text-gradient mt-1",
									children: result.score
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: [
										result.correct,
										" / ",
										result.total,
										" correct"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "glass rounded-2xl p-5 md:col-span-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-widest text-muted-foreground",
									children: "AI verdict"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed",
									children: result.verdict
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2",
									children: Object.entries(result.byTopic).map(([topic, s]) => {
										const pct = Math.round(s.correct / Math.max(1, s.total) * 100);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "glass rounded-xl px-3 py-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: topic
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-muted-foreground",
												children: [
													s.correct,
													"/",
													s.total,
													" · ",
													pct,
													"%"
												]
											})]
										}, topic);
									})
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-widest text-muted-foreground mb-3",
							children: "Review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: questions.map((qq, i) => {
								const ok = answers[i] === qq.correct_index;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "glass rounded-xl p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2 text-sm",
										children: [ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent mt-0.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-red-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "font-medium",
													children: [
														i + 1,
														". ",
														qq.question
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-xs text-muted-foreground mt-1",
													children: [
														"Your answer: ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: ok ? "text-accent" : "text-red-400",
															children: answers[i] >= 0 ? qq.options[answers[i]] : "—"
														}),
														!ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" · Correct: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-accent",
															children: qq.options[qq.correct_index]
														})] })
													]
												}),
												qq.explanation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs text-muted-foreground mt-1 italic",
													children: qq.explanation
												})
											]
										})]
									})
								}, i);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setQuestions([]);
							setAnswers([]);
							setResult(null);
						},
						className: "mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-3.5" }), " Take another test"]
					})
				]
			})
		]
	});
}
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
function InterviewPage() {
	useRequireResume("Mock interviews");
	const evalItems = [
		"Technical accuracy",
		"Communication clarity",
		"Confidence trend",
		"Filler words",
		"Eye contact",
		"Problem-solving depth",
		"Grammar",
		"Behavioral fit"
	];
	const rounds = [
		{
			id: "hr",
			name: "HR",
			desc: "Motivation, culture fit, career story"
		},
		{
			id: "technical",
			name: "Technical",
			desc: "Domain fundamentals from your resume"
		},
		{
			id: "behavioral",
			name: "Behavioral",
			desc: "STAR-format situational deep-dives"
		},
		{
			id: "coding",
			name: "Coding",
			desc: "Predict-output, complexity, DS choice"
		},
		{
			id: "faang",
			name: "FAANG-style",
			desc: "System design + leadership principles"
		},
		{
			id: "campus",
			name: "Campus placement",
			desc: "Aptitude + core CS + HR blend"
		}
	];
	const [activeRound, setActiveRound] = (0, import_react.useState)("technical");
	const [startKey, setStartKey] = (0, import_react.useState)(0);
	const mockRef = (0, import_react.useRef)(null);
	function pickRound(r) {
		setActiveRound(r);
		setStartKey((k) => k + 1);
		toast.success(`Starting ${r.toUpperCase()} round — generating fresh questions…`);
		setTimeout(() => mockRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}), 60);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen text-foreground overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkflowStepper, { current: 3 }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pt-10 pb-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-[0.2em] text-primary-glow mb-3",
							children: "Step 03 · Interview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-4xl md:text-5xl font-semibold text-gradient tracking-tight",
							children: "Practice like it's the real thing."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-lg text-muted-foreground max-w-2xl",
							children: "Questions generated from your resume, roadmap, and target role. Never repeated. Real-time evaluation on 14 signals — technical, verbal, and non-verbal."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground mb-3",
						children: "Choose a round · click to start"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid sm:grid-cols-2 md:grid-cols-3 gap-3",
						children: rounds.map((r) => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => pickRound(r.id),
								className: `glass rounded-2xl p-4 text-left transition border ${activeRound === r.id ? "border-primary/60 bg-white/[0.06]" : "border-transparent hover:bg-white/[0.05]"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display font-semibold",
									children: r.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: r.desc
								})]
							}, r.id);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				ref: mockRef,
				className: "px-6 py-10 scroll-mt-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-5xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockTest, {
						round: activeRound,
						autoStartKey: startKey || void 0
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 py-14",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl grid lg:grid-cols-5 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						className: "glass-strong rounded-3xl p-8 lg:col-span-3 relative overflow-hidden",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-red-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Live · 12:04"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Technical Round · Backend"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass rounded-2xl p-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs uppercase tracking-wider text-primary-glow mb-2",
										children: "Interviewer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-base leading-relaxed",
										children: "You built a Hospital Management System with MySQL. Walk me through your indexing strategy and how you'd scale reads if the patient table hit 50M rows."
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "glass rounded-2xl p-5 ml-8 border-white/10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs uppercase tracking-wider text-accent mb-2",
											children: "You"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-base leading-relaxed text-muted-foreground",
											children: "I used composite indexes on (patient_id, visit_date) for the most frequent lookups. For 50M rows I'd introduce read replicas..."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-3" }), " Transcribing · 84 wpm · 2 fillers"]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex items-center gap-3 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-medium",
										style: { background: "var(--gradient-primary)" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-4" }), " Answer"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), " Type"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-4" }), " Video"]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						...fadeUp,
						transition: {
							...fadeUp.transition,
							delay: .1
						},
						className: "glass rounded-3xl p-8 lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-widest text-muted-foreground",
								children: "Real-time evaluation"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-2xl font-semibold mt-1 mb-6",
								children: "14 signals analyzed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-2",
								children: evalItems.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm text-muted-foreground glass rounded-lg px-3 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-accent shrink-0" }),
										" ",
										e
									]
								}, e))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 pt-6 border-t border-white/5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs uppercase tracking-widest text-muted-foreground mb-3",
									children: "Interview Score"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-display text-5xl font-semibold text-gradient",
										children: "78"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm text-muted-foreground pb-2",
										children: "Recruiter-ready"
									})]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "px-6 pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl glass rounded-3xl p-8 flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-muted-foreground",
						children: "Next step"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-semibold mt-1",
						children: "See your final employability report"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/report",
						className: "inline-flex items-center gap-2 text-white font-medium px-5 py-3 rounded-full glow-primary",
						style: { background: "var(--gradient-primary)" },
						children: ["View Report ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { InterviewPage as component };
