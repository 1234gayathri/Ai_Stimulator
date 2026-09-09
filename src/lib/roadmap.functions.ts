import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const RoadmapSchema = z.object({
  summary: z.string().optional().default("Personalized learning path to bridge identified skill gaps."),
  modules: z.array(z.object({
    title: z.string(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
    estimated_weeks: z.number().int().min(1).max(12),
    impact_level: z.string().optional().default("High impact"),
    topics: z.array(z.string()),
    resources: z.array(z.string()).optional().default([]),
  })),
});

export const getRoadmap = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = (context || {}) as any;
    // Check candidate's latest resume analysis first
    const { data: latestAnalysis } = await ctx.supabase
      .from("resume_analyses")
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!latestAnalysis) {
      throw new Error("No resume analysis found. Please upload your resume first to generate a personalized roadmap.");
    }

    // Check if user has an active roadmap matching this specific analysis
    const { data: existingRoadmap } = await ctx.supabase
      .from("roadmaps")
      .select("id, resume_analysis_id, target_role, summary, created_at")
      .eq("is_active", true)
      .eq("resume_analysis_id", latestAnalysis.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingRoadmap) {
      const { data: modules } = await ctx.supabase
        .from("modules")
        .select("*")
        .eq("roadmap_id", existingRoadmap.id)
        .order("position", { ascending: true });

      return {
        roadmap: existingRoadmap,
        modules: modules ?? [],
      };
    }

    // Generate a fresh roadmap synced with the latest resume analysis
    return await generateRoadmapInternal(ctx);
  });

export const generateNewRoadmap = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = (context || {}) as any;
    return await generateRoadmapInternal(ctx);
  });

export const updateModuleProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({
    moduleId: z.string().uuid(),
    progressPct: z.number().min(0).max(100),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const ctx = (context || {}) as any;
    const completed = data.progressPct >= 100;
    const { data: updated, error } = await ctx.supabase
      .from("modules")
      .update({
        progress_pct: data.progressPct,
        completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.moduleId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

async function generateRoadmapInternal(context: { supabase: any; userId: string }) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) throw new Error("AI is not configured.");

  // Fetch the candidate's latest resume analysis
  const { data: latestAnalysis, error: aErr } = await context.supabase
    .from("resume_analyses")
    .select("id, target_role, gaps, skills, strengths, summary, overall_score")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestAnalysis) {
    throw new Error("No resume analysis found. Please upload your resume first to generate a personalized roadmap.");
  }

  const targetRole = latestAnalysis.target_role || "Software Engineer";
  const gaps = JSON.stringify(latestAnalysis.gaps || []);
  const skills = JSON.stringify(latestAnalysis.skills || []);
  const strengths = JSON.stringify(latestAnalysis.strengths || []);

  const googleProvider = createGoogleGenerativeAI({ apiKey });
  const model = googleProvider("gemini-1.5-flash");

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

  let parsed: z.infer<typeof RoadmapSchema>;
  try {
    const { text: raw } = await generateText({ model, prompt });
    let clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
    parsed = RoadmapSchema.parse(JSON.parse(clean));
  } catch {
    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: RoadmapSchema }),
        prompt,
      });
      parsed = output;
    } catch {
      throw new Error("Could not generate your roadmap at this moment. Please try again.");
    }
  }

  // Deactivate previous active roadmaps
  await context.supabase
    .from("roadmaps")
    .update({ is_active: false })
    .eq("user_id", context.userId);

  // Insert new roadmap
  const { data: newRoadmap, error: rErr } = await context.supabase
    .from("roadmaps")
    .insert({
      user_id: context.userId,
      resume_analysis_id: latestAnalysis.id,
      target_role: targetRole,
      summary: parsed.summary,
      is_active: true,
    })
    .select()
    .single();

  if (rErr) throw new Error(rErr.message);

  // Insert modules
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
    completed: false,
  }));

  const { data: createdModules, error: mErr } = await context.supabase
    .from("modules")
    .insert(moduleRows)
    .select();

  if (mErr) throw new Error(mErr.message);

  return {
    roadmap: newRoadmap,
    modules: createdModules || [],
  };
}
