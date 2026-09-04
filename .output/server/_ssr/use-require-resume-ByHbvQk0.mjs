import { o as __toESM } from "../_runtime.mjs";
import { n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as listAnalyses, s as useServerFn } from "./resume.functions-D0DPUmq_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-require-resume-ByHbvQk0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Gates a workflow step behind having at least one completed resume analysis.
* Redirects to /resume with a toast if the user tries to skip ahead.
*/
function useRequireResume(stepLabel) {
	const navigate = useNavigate();
	const listAnalysesFn = useServerFn(listAnalyses);
	const { data, isLoading, isError } = useQuery({
		queryKey: ["analyses"],
		queryFn: () => listAnalysesFn()
	});
	const ready = !isLoading && !isError;
	const hasAnalysis = (data?.length ?? 0) > 0;
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		if (!hasAnalysis) {
			toast.warning("Upload your resume first", { description: `${stepLabel} unlocks once we've analyzed your resume.` });
			navigate({ to: "/resume" });
		}
	}, [
		ready,
		hasAnalysis,
		navigate,
		stepLabel
	]);
	return {
		ready,
		hasAnalysis,
		latest: data?.[0]
	};
}
//#endregion
export { useRequireResume as t };
