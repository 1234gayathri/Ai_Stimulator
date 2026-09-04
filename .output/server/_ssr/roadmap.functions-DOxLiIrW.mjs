import { ct as arrayType, dt as numberType, ft as objectType, pt as stringType, ut as enumType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { n as generateText, r as output_exports } from "../_libs/ai.mjs";
import { t as createGoogle } from "../_libs/@ai-sdk/google+[...].mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/roadmap.functions-DOxLiIrW.js
var RoadmapSchema = objectType({
	summary: stringType().optional().default("Personalized learning path to bridge identified skill gaps."),
	modules: arrayType(objectType({
		title: stringType(),
		difficulty: enumType([
			"Beginner",
			"Intermediate",
			"Advanced"
		]),
		estimated_weeks: numberType().int().min(1).max(12),
		impact_level: stringType().optional().default("High impact"),
		topics: arrayType(stringType()),
		resources: arrayType(stringType()).optional().default([])
	}))
});
var getRoadmap_createServerFn_handler = createServerRpc({
	id: "d3cceba56919cbb94af74939db2ee2e54d9d81867be14c7329347b3946aadc2b",
	name: "getRoadmap",
	filename: "src/lib/roadmap.functions.ts"
}, (opts) => getRoadmap.__executeServer(opts));
var getRoadmap = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(getRoadmap_createServerFn_handler, async ({ context }) => {
	const { data: latestAnalysis } = await context.supabase.from("resume_analyses").select("id").order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (!latestAnalysis) throw new Error("No resume analysis found. Please upload your resume first to generate a personalized roadmap.");
	const { data: existingRoadmap } = await context.supabase.from("roadmaps").select("id, resume_analysis_id, target_role, summary, created_at").eq("is_active", true).eq("resume_analysis_id", latestAnalysis.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (existingRoadmap) {
		const { data: modules } = await context.supabase.from("modules").select("*").eq("roadmap_id", existingRoadmap.id).order("position", { ascending: true });
		return {
			roadmap: existingRoadmap,
			modules: modules ?? []
		};
	}
	return await generateRoadmapInternal(context);
});
var generateNewRoadmap_createServerFn_handler = createServerRpc({
	id: "3df0fe39f6dcdc253e530512cb3779e8fe7a82d488f9595449c6834cdbe9005e",
	name: "generateNewRoadmap",
	filename: "src/lib/roadmap.functions.ts"
}, (opts) => generateNewRoadmap.__executeServer(opts));
var generateNewRoadmap = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(generateNewRoadmap_createServerFn_handler, async ({ context }) => {
	return await generateRoadmapInternal(context);
});
var updateModuleProgress_createServerFn_handler = createServerRpc({
	id: "72b01eacdc7b934d207fbf703919f4c1f90137b98416121cf63d75babfd36a11",
	name: "updateModuleProgress",
	filename: "src/lib/roadmap.functions.ts"
}, (opts) => updateModuleProgress.__executeServer(opts));
var updateModuleProgress = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => objectType({
	moduleId: stringType().uuid(),
	progressPct: numberType().min(0).max(100)
}).parse(input)).handler(updateModuleProgress_createServerFn_handler, async ({ data, context }) => {
	const completed = data.progressPct >= 100;
	const { data: updated, error } = await context.supabase.from("modules").update({
		progress_pct: data.progressPct,
		completed,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", data.moduleId).select().single();
	if (error) throw new Error(error.message);
	return updated;
});
async function generateRoadmapInternal(context) {
	const apiKey = processModule.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) throw new Error("AI is not configured.");
	const { data: latestAnalysis, error: aErr } = await context.supabase.from("resume_analyses").select("id, target_role, gaps, skills, strengths, summary, overall_score").order("created_at", { ascending: false }).limit(1).maybeSingle();
	if (!latestAnalysis) throw new Error("No resume analysis found. Please upload your resume first to generate a personalized roadmap.");
	const targetRole = latestAnalysis.target_role || "Software Engineer";
	const gaps = JSON.stringify(latestAnalysis.gaps || []);
	const skills = JSON.stringify(latestAnalysis.skills || []);
	const strengths = JSON.stringify(latestAnalysis.strengths || []);
	const model = createGoogle({ apiKey })("gemini-3.5-flash");
	const prompt = `You are a principal technical mentor and curriculum architect. Create a highly customized, prioritized learning roadmap for a candidate targeting the role of "${targetRole}".

CANDIDATE ANALYSIS DATA:
- Target Role: "${targetRole}"
- Overall Resume Match Score: ${latestAnalysis.overall_score}/100
- Identified Skill Gaps: ${gaps}
- Candidate Current Skills: ${skills}
- Candidate Strengths: ${strengths}
- Background Summary: "${latestAnalysis.summary || ""}"

INSTRUCTIONS:
1. Generate between 4 to 6 prioritized learning modules specifically designed to fix the candidate's exact skill gaps for the role of "${targetRole}".
2. Do NOT provide generic boilerplate modules if the resume has specific gaps. Tailor module titles, topics, and difficulty to what this candidate needs to master.
3. Order modules by priority (P1 = most critical gap to bridge first).
4. Assign realistic time estimates (1-6 weeks per module) and difficulty levels ("Beginner", "Intermediate", or "Advanced").

Return ONLY a JSON object with this exact structure:
{
  "summary": string (1-2 sentences overview of the custom learning path),
  "modules": [
    {
      "title": string (e.g. "Mastering PostgreSQL Indexing & Query Optimization"),
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimated_weeks": number (1 to 6),
      "impact_level": string (e.g. "P1 · High Impact" or "Critical Gap"),
      "topics": [string (4-5 key subtopics to study)],
      "resources": [string (2-3 recommended topics/resource areas)]
    }
  ]
}`;
	let parsed;
	try {
		const { text: raw } = await generateText({
			model,
			prompt
		});
		let clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
		const start = clean.indexOf("{");
		const end = clean.lastIndexOf("}");
		if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
		parsed = RoadmapSchema.parse(JSON.parse(clean));
	} catch {
		try {
			const { output } = await generateText({
				model,
				output: output_exports.object({ schema: RoadmapSchema }),
				prompt
			});
			parsed = output;
		} catch {
			throw new Error("Could not generate your roadmap at this moment. Please try again.");
		}
	}
	await context.supabase.from("roadmaps").update({ is_active: false }).eq("user_id", context.userId);
	const { data: newRoadmap, error: rErr } = await context.supabase.from("roadmaps").insert({
		user_id: context.userId,
		resume_analysis_id: latestAnalysis.id,
		target_role: targetRole,
		summary: parsed.summary,
		is_active: true
	}).select().single();
	if (rErr) throw new Error(rErr.message);
	const moduleRows = parsed.modules.map((m, idx) => ({
		roadmap_id: newRoadmap.id,
		user_id: context.userId,
		position: idx + 1,
		title: m.title,
		difficulty: m.difficulty,
		estimated_weeks: m.estimated_weeks,
		topics: m.topics,
		resources: m.resources,
		progress_pct: 0,
		completed: false
	}));
	const { data: createdModules, error: mErr } = await context.supabase.from("modules").insert(moduleRows).select();
	if (mErr) throw new Error(mErr.message);
	return {
		roadmap: newRoadmap,
		modules: createdModules || []
	};
}
//#endregion
export { generateNewRoadmap_createServerFn_handler, getRoadmap_createServerFn_handler, updateModuleProgress_createServerFn_handler };
