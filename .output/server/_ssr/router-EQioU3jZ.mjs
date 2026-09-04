import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, j as redirect, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$9 } from "./auth-_8HKZTqV.mjs";
import { t as supabase } from "./client-TbLwbtkq.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-EQioU3jZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-YPSUpIXY.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$8 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AI Interview Simulator — Your AI Career Coach & Interview Mentor" },
			{
				name: "description",
				content: "Analyze your resume, close skill gaps, and ace interviews with a personal AI mentor. From resume score to placement probability — all in one platform."
			},
			{
				name: "author",
				content: "AI Interview Simulator"
			},
			{
				property: "og:title",
				content: "AI Interview Simulator — AI Career Coach & Interview Platform"
			},
			{
				property: "og:description",
				content: "Resume intelligence, personalized learning roadmaps, and AI mock interviews with realtime evaluation."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$8.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$7 = () => import("./pricing-C_LxwvSN.mjs");
var Route$7 = createFileRoute("/pricing")({
	head: () => ({ meta: [
		{ title: "Pricing — AI Interview Simulator" },
		{
			name: "description",
			content: "Simple, honest pricing. Free forever plan for students. Pro for unlimited AI mock interviews and full employability reports. Custom plans for campuses."
		},
		{
			property: "og:title",
			content: "Pricing — AI Interview Simulator"
		},
		{
			property: "og:description",
			content: "Free for students. Pro for job-seekers. Custom for campuses."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./faq-Bsn0c5lS.mjs");
var Route$6 = createFileRoute("/faq")({
	head: () => ({ meta: [
		{ title: "FAQ — AI Interview Simulator" },
		{
			name: "description",
			content: "Answers about AI Interview Simulator's AI resume analysis, interview formats, data privacy, video requirements, and pricing."
		},
		{
			property: "og:title",
			content: "FAQ — AI Interview Simulator"
		},
		{
			property: "og:description",
			content: "Answers, before you ask."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./route-Di7iQBCH.mjs");
var Route$5 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({
			to: "/auth",
			search: { next: location.href }
		});
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./routes-cNcwj-PZ.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "AI Interview Simulator — Your AI Career Coach & Interview Mentor" },
		{
			name: "description",
			content: "Analyze your resume, close skill gaps, and ace interviews with a personal AI mentor. From resume score to placement probability — all in one platform."
		},
		{
			property: "og:title",
			content: "AI Interview Simulator — AI Career Coach & Interview Platform"
		},
		{
			property: "og:description",
			content: "Resume intelligence, personalized learning roadmaps, and AI mock interviews with realtime evaluation."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./roadmap-DCdRZ415.mjs");
var Route$3 = createFileRoute("/_authenticated/roadmap")({
	head: () => ({ meta: [{ title: "Personalized Learning Roadmap — AI Interview Simulator" }, {
		name: "description",
		content: "A prioritized, adaptive learning roadmap with topics, difficulty, time estimates, and progress tracking — built from your resume and target role."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./resume-Chwv7Jcc.mjs");
var Route$2 = createFileRoute("/_authenticated/resume")({
	head: () => ({ meta: [{ title: "Resume Analysis — AI Interview Simulator" }, {
		name: "description",
		content: "Upload your resume and get an instant AI-powered ATS score, skill map, gap analysis and salary estimate."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./report-Bc6JVr7f.mjs");
var Route$1 = createFileRoute("/_authenticated/report")({
	head: () => ({ meta: [{ title: "Employability Report — AI Interview Simulator" }, {
		name: "description",
		content: "Your recruiter-ready report generated from your uploaded resume: readiness, skills, gaps, salary, and 30/60/90 plan."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./interview-DLjn5tSb.mjs");
var Route = createFileRoute("/_authenticated/interview")({
	head: () => ({ meta: [
		{ title: "AI Mock Interview — AI Interview Simulator" },
		{
			name: "description",
			content: "Realistic HR, technical, behavioral and coding interviews with voice, video, and text — evaluated on 14 signals in real time."
		},
		{
			property: "og:title",
			content: "AI Mock Interview — AI Interview Simulator"
		},
		{
			property: "og:description",
			content: "Practice like it's the real thing — because it feels like it."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var PricingRoute = Route$7.update({
	id: "/pricing",
	path: "/pricing",
	getParentRoute: () => Route$8
});
var FaqRoute = Route$6.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$8
});
var AuthRoute = Route$9.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$8
});
var AuthenticatedRouteRoute = Route$5.update({
	id: "/_authenticated",
	getParentRoute: () => Route$8
});
var IndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$8
});
var AuthenticatedRoadmapRoute = Route$3.update({
	id: "/roadmap",
	path: "/roadmap",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedResumeRoute = Route$2.update({
	id: "/resume",
	path: "/resume",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedReportRoute = Route$1.update({
	id: "/report",
	path: "/report",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedInterviewRoute: Route.update({
		id: "/interview",
		path: "/interview",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedReportRoute,
	AuthenticatedResumeRoute,
	AuthenticatedRoadmapRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	FaqRoute,
	PricingRoute
};
var routeTree = Route$8._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
