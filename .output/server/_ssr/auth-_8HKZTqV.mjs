import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { ft as objectType, pt as stringType } from "../_libs/@ai-sdk/gateway+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-_8HKZTqV.js
var $$splitComponentImporter = () => import("./auth-Dah5GtdQ.mjs");
var AuthSearch = objectType({ next: stringType().optional() });
var Route = createFileRoute("/auth")({
	validateSearch: AuthSearch,
	head: () => ({ meta: [{ title: "Sign in — AI Interview Simulator" }, {
		name: "description",
		content: "Sign in or create your AI Interview Simulator account to unlock your AI career workflow."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
