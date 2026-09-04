import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { O as isRedirect, h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { ft as objectType, pt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { T as Check } from "../_libs/lucide-react.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-DGfBUA8I.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resume.functions-D0DPUmq_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var STEPS = [
	{
		to: "/resume",
		n: "01",
		label: "Resume"
	},
	{
		to: "/roadmap",
		n: "02",
		label: "Roadmap"
	},
	{
		to: "/interview",
		n: "03",
		label: "Interview"
	},
	{
		to: "/report",
		n: "04",
		label: "Report"
	}
];
function WorkflowStepper({ current }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-5xl px-6 pt-28",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "glass rounded-2xl p-3 flex items-center gap-1 overflow-x-auto",
			children: STEPS.map((s, i) => {
				const stepNum = i + 1;
				const isDone = stepNum < current;
				const isActive = stepNum === current;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: s.to,
					className: `flex-1 min-w-[140px] flex items-center gap-3 px-4 py-2.5 rounded-xl transition ${isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `size-8 rounded-lg grid place-items-center text-xs font-mono shrink-0 ${isActive ? "text-white" : isDone ? "bg-accent/20 text-accent" : "bg-white/[0.04] text-muted-foreground"}`,
						style: isActive ? { background: "var(--gradient-primary)" } : void 0,
						children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : s.n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] uppercase tracking-wider text-muted-foreground",
						children: ["Step ", stepNum]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`,
						children: s.label
					})] })]
				}, s.n);
			})
		})
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var AnalyzeInput = objectType({
	resumeId: stringType().uuid(),
	targetRole: stringType().min(1).max(200)
});
var listResumes = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("b288288ab2fbfc0ca7181e1a97e7dfa0595009975ab09c38712ba7388546face"));
var listAnalyses = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("10c59102619478e7d9a08d3812524bf00585dc739f91ea6cb1ec99e666fc217d"));
var analyzeResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => AnalyzeInput.parse(input)).handler(createSsrRpc("c8f61b0afaae08e817dcd91bcf0654257dcb701d1ab06bf9bf2b1159856e40ce"));
var DeleteInput = objectType({ resumeId: stringType().uuid() });
var deleteResume = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => DeleteInput.parse(input)).handler(createSsrRpc("b770062f53397f87339e19e0ecab926a5a29badd155b20f722f317084c9c2140"));
//#endregion
export { listAnalyses as a, deleteResume as i, analyzeResume as n, listResumes as o, createSsrRpc as r, useServerFn as s, WorkflowStepper as t };
