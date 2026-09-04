import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-TbLwbtkq.mjs";
import { p as LogOut, s as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Footer-Xmt0aKIh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Nav() {
	const [email, setEmail] = (0, import_react.useState)(null);
	const router = useRouter();
	const qc = useQueryClient();
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
		const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
			setEmail(session?.user.email ?? null);
		});
		return () => sub.subscription.unsubscribe();
	}, []);
	async function signOut() {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		router.navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "fixed top-0 inset-x-0 z-50 px-4 pt-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl glass rounded-full flex items-center justify-between px-4 py-2.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2 pl-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-7 rounded-lg grid place-items-center",
						style: { background: "var(--gradient-primary)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold tracking-tight",
						children: "AI Interview Simulator"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden md:flex items-center gap-6 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/resume",
							className: "hover:text-foreground transition",
							activeProps: { className: "text-foreground" },
							children: "Resume"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/roadmap",
							className: "hover:text-foreground transition",
							activeProps: { className: "text-foreground" },
							children: "Roadmap"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/interview",
							className: "hover:text-foreground transition",
							activeProps: { className: "text-foreground" },
							children: "Interview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/report",
							className: "hover:text-foreground transition",
							activeProps: { className: "text-foreground" },
							children: "Report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/pricing",
							className: "hover:text-foreground transition",
							activeProps: { className: "text-foreground" },
							children: "Pricing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/faq",
							className: "hover:text-foreground transition",
							activeProps: { className: "text-foreground" },
							children: "FAQ"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: email ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:block text-xs text-muted-foreground max-w-[160px] truncate",
						children: email
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: signOut,
						className: "text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 inline-flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Sign out"]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						className: "hidden sm:block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 transition",
						children: "Sign in"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/resume",
						className: "text-sm font-medium text-white px-4 py-2 rounded-full transition hover:opacity-90",
						style: { background: "var(--gradient-primary)" },
						children: "Get started"
					})] })
				})
			]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "px-6 py-14 border-t border-white/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl grid gap-8 md:grid-cols-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-7 rounded-lg grid place-items-center",
						style: { background: "var(--gradient-primary)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-white" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold tracking-tight",
						children: "AI Interview Simulator"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground",
					children: "Your personal AI career mentor — from resume to offer letter."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Workflow",
					links: [
						{
							to: "/resume",
							label: "Resume analysis"
						},
						{
							to: "/roadmap",
							label: "Learning roadmap"
						},
						{
							to: "/interview",
							label: "Mock interview"
						},
						{
							to: "/report",
							label: "Employability report"
						}
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Product",
					links: [
						{
							to: "/pricing",
							label: "Pricing"
						},
						{
							to: "/faq",
							label: "FAQ"
						},
						{
							to: "/auth",
							label: "Sign in"
						}
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
					title: "Company",
					links: [{
						to: "/",
						label: "Home"
					}]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl mt-10 pt-6 border-t border-white/5 text-xs text-muted-foreground text-center",
			children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" AI Interview Simulator. All rights reserved."
			]
		})]
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-xs uppercase tracking-widest text-muted-foreground mb-3",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: l.to,
			className: "text-muted-foreground hover:text-foreground transition",
			children: l.label
		}) }, l.label))
	})] });
}
//#endregion
export { Nav as n, Footer as t };
