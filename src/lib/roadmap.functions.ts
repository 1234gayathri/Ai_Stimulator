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
    try {
      // Check candidate's latest resume analysis first
      const { data: latestAnalysis } = await ctx.supabase
        .from("resume_analyses")
        .select("id")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestAnalysis) {
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
      }
    } catch {
      // Ignore DB fetch failure and generate dynamic fallback
    }

    // Generate a fresh roadmap synced with the candidate's role & analysis
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
    moduleId: z.string(),
    progressPct: z.number().min(0).max(100),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const ctx = (context || {}) as any;
    const completed = data.progressPct >= 100;
    try {
      const { data: updated } = await ctx.supabase
        .from("modules")
        .update({
          progress_pct: data.progressPct,
          completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", data.moduleId)
        .select()
        .single();
      if (updated) return updated;
    } catch {
      // ignore
    }
    return { id: data.moduleId, progress_pct: data.progressPct, completed };
  });

function createDynamicFallbackModules(targetRole: string, rawGaps: any[]) {
  const role = targetRole || "Software Engineer";
  const gapsList = (rawGaps || []).map((g) => (typeof g === "string" ? g : g.skill || "")).filter(Boolean);
  
  const gapStr = gapsList.slice(0, 3).join(" & ");

  return [
    {
      title: gapStr ? `Mastering ${gapStr}` : `Core Architecture & Fundamentals for ${role}`,
      difficulty: "Intermediate",
      estimated_weeks: 3,
      impact_level: "P1 · Critical Gap",
      topics: ["Deep Dive Concepts", "Industry Standards", "Hands-on Implementation", "Best Practices"],
      resources: ["Official Documentation", "Guided Projects"],
    },
    {
      title: `Advanced ${role} System Design & Scalability`,
      difficulty: "Advanced",
      estimated_weeks: 4,
      impact_level: "P2 · High Impact",
      topics: ["High Availability", "Performance Optimization", "Microservices Architecture", "Caching Strategies"],
      resources: ["System Design Primers", "Architecture Blueprints"],
    },
    {
      title: `Production Deployment, CI/CD & Testing for ${role}`,
      difficulty: "Intermediate",
      estimated_weeks: 2,
      impact_level: "P3 · Essential Skills",
      topics: ["Automated Unit & E2E Testing", "Docker & Kubernetes Basics", "CI/CD Pipelines", "Monitoring & Logging"],
      resources: ["DevOps Tooling Guides", "Production Checklists"],
    },
    {
      title: `Behavioral & Technical Leadership for ${role} Interviews`,
      difficulty: "Beginner",
      estimated_weeks: 2,
      impact_level: "P4 · Final Polish",
      topics: ["STAR Method Answers", "Mock Interview Practice", "System Walkthroughs", "Salary Negotiation"],
      resources: ["Interview Prep Guides", "Mock Drills"],
    },
  ];
}

async function generateRoadmapInternal(context: { supabase: any; userId: string }) {
  let targetRole = "Software Engineer";
  let analysisId = "local-analysis-id";
  let gaps: any[] = [];
  let skills: any[] = [];
  let strengths: any[] = [];
  let summary = "";
  let overallScore = 75;

  try {
    const { data: latestAnalysis } = await context.supabase
      .from("resume_analyses")
      .select("id, target_role, gaps, skills, strengths, summary, overall_score")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestAnalysis) {
      analysisId = latestAnalysis.id;
      targetRole = latestAnalysis.target_role || "Software Engineer";
      gaps = latestAnalysis.gaps || [];
      skills = latestAnalysis.skills || [];
      strengths = latestAnalysis.strengths || [];
      summary = latestAnalysis.summary || "";
      overallScore = latestAnalysis.overall_score || 75;
    }
  } catch {
    // Ignore error
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  let parsedModules = createDynamicFallbackModules(targetRole, gaps);
  let roadmapSummary = `Customized learning path to master ${targetRole} and bridge identified skill gaps.`;

  if (apiKey) {
    try {
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      const model = googleProvider("gemini-1.5-flash");

      const prompt = `You are a principal technical mentor. Create a customized, prioritized learning roadmap for a candidate targeting "${targetRole}".

CANDIDATE DATA:
- Target Role: "${targetRole}"
- Match Score: ${overallScore}/100
- Skill Gaps: ${JSON.stringify(gaps)}
- Current Skills: ${JSON.stringify(skills)}
- Strengths: ${JSON.stringify(strengths)}
- Summary: "${summary}"

Generate 4 to 5 learning modules specifically tailored for "${targetRole}".
Return ONLY a JSON object:
{
  "summary": string,
  "modules": [
    {
      "title": string,
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "estimated_weeks": number (1 to 6),
      "impact_level": string,
      "topics": [string],
      "resources": [string]
    }
  ]
}`;

      const { text: raw } = await generateText({ model, prompt });
      let clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
      const res = RoadmapSchema.parse(JSON.parse(clean));
      if (res.modules && res.modules.length > 0) {
        parsedModules = res.modules;
        roadmapSummary = res.summary || roadmapSummary;
      }
    } catch {
      // Use fallback
    }
  }

  // Attempt DB storage if connected
  try {
    await context.supabase
      .from("roadmaps")
      .update({ is_active: false })
      .eq("user_id", context.userId);

    const { data: newRoadmap } = await context.supabase
      .from("roadmaps")
      .insert({
        user_id: context.userId,
        resume_analysis_id: analysisId.length === 36 ? analysisId : null,
        target_role: targetRole,
        summary: roadmapSummary,
        is_active: true,
      })
      .select()
      .single();

    if (newRoadmap) {
      const moduleRows = parsedModules.map((m: any, idx: number) => ({
        roadmap_id: newRoadmap.id,
        user_id: context.userId,
        position: idx + 1,
        title: m.title,
        difficulty: m.difficulty,
        estimated_weeks: m.estimated_weeks,
        topics: m.topics,
        resources: m.resources || [],
        progress_pct: 0,
        completed: false,
      }));

      const { data: createdModules } = await context.supabase
        .from("modules")
        .insert(moduleRows)
        .select();

      return {
        roadmap: newRoadmap,
        modules: createdModules || [],
      };
    }
  } catch {
    // Return local dynamic object
  }

  const fallbackId = "roadmap-" + Date.now();
  return {
    roadmap: {
      id: fallbackId,
      target_role: targetRole,
      summary: roadmapSummary,
      is_active: true,
    },
    modules: parsedModules.map((m: any, idx: number) => ({
      id: `mod-${idx + 1}`,
      roadmap_id: fallbackId,
      position: idx + 1,
      title: m.title,
      difficulty: m.difficulty,
      estimated_weeks: m.estimated_weeks,
      topics: m.topics,
      resources: m.resources || [],
      progress_pct: 0,
      completed: false,
    })),
  };
}
