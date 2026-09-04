import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listAnalyses } from "@/lib/resume.functions";

/**
 * Gates a workflow step behind having at least one completed resume analysis.
 * Redirects to /resume with a toast if the user tries to skip ahead.
 */
export function useRequireResume(stepLabel: string) {
  const navigate = useNavigate();
  const listAnalysesFn = useServerFn(listAnalyses);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["analyses"],
    queryFn: () => listAnalysesFn(),
  });

  const ready = !isLoading && !isError;
  const hasAnalysis = (data?.length ?? 0) > 0;

  useEffect(() => {
    if (!ready) return;
    if (!hasAnalysis) {
      toast.warning("Upload your resume first", {
        description: `${stepLabel} unlocks once we've analyzed your resume.`,
      });
      navigate({ to: "/resume" });
    }
  }, [ready, hasAnalysis, navigate, stepLabel]);

  return { ready, hasAnalysis, latest: data?.[0] };
}
