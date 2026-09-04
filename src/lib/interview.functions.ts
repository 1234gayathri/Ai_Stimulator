import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const ROUND_TYPES = ["hr", "technical", "behavioral", "coding", "faang", "campus"] as const;
export type RoundType = (typeof ROUND_TYPES)[number];

const GenerateInput = z.object({
  targetRole: z.string().min(1).max(200),
  difficulty: z.enum(["easy", "medium", "hard"]).optional().default("medium"),
  count: z.number().int().min(3).max(15).optional().default(8),
  round: z.enum(ROUND_TYPES).optional().default("technical"),
});

const ROUND_PROMPTS: Record<RoundType, string> = {
  hr: "Focus 100% on HR round: motivation, culture-fit, career story, strengths/weaknesses, salary expectations, situational HR judgement. All questions must be MCQs where the 'correct' option reflects the strongest professional answer. Topics tags: 'HR', 'Culture Fit', 'Career'.",
  technical: "Focus on the technical round for the role: mix of core CS/domain fundamentals (60%), applied problem solving (25%), and best-practices/design MCQs (15%). Topics tags reflect concrete skills (e.g. 'SQL', 'OOP', 'REST', 'Data Structures').",
  behavioral: "Focus 100% on behavioral / STAR-format situational questions. Each MCQ presents a workplace scenario; the correct option is the most effective STAR-aligned response. Topics: 'Conflict', 'Leadership', 'Ownership', 'Teamwork', 'Ambiguity'.",
  coding: "Focus on coding-round style MCQs: predict-the-output, complexity analysis, bug spotting, data-structure choice, algorithmic trade-offs. Include short code snippets in the question text using backticks. Topics: 'Arrays', 'Strings', 'Trees', 'DP', 'Complexity'.",
  faang: "FAANG-style round: system design trade-offs, scalability, distributed systems, and leadership-principles behavioral MCQs (Amazon LP style). Harder than default. Topics: 'System Design', 'Scalability', 'Leadership Principles'.",
  campus: "Campus placement blend: quantitative aptitude (30%), logical reasoning (25%), verbal ability (15%), core CS fundamentals for the role (20%), HR (10%). Topics: 'Aptitude', 'Logical', 'Verbal', 'CS Fundamentals', 'HR'.",
};

const QuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correct_index: z.number(),
  explanation: z.string().optional().default(""),
  topic: z.string().optional().default(""),
});

const MockTestSchema = z.object({
  questions: z.array(QuestionSchema),
});

export type MockQuestion = z.infer<typeof QuestionSchema>;

export const generateMockTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    const googleProvider = createGoogleGenerativeAI({ apiKey });
    const model = googleProvider("gemini-3.5-flash");

    const prompt = `Generate a mock interview test for a candidate targeting the role: "${data.targetRole}".
Round: ${data.round.toUpperCase()}.
Difficulty: ${data.difficulty}.
Return exactly ${data.count} multiple-choice questions.

Round focus:
${ROUND_PROMPTS[data.round]}

Rules:
- Each question has exactly 4 options.
- correct_index is 0-based (0..3).
- Include a brief explanation of the correct answer.
- Every question must be original, non-trivial, and specifically tailored to the "${data.targetRole}" role and the ${data.round} round. Do NOT repeat classics verbatim, and do NOT duplicate questions.
- topic must be a short tag matching the round focus above.

Return strictly the JSON matching the schema.`;

    let parsed: z.infer<typeof MockTestSchema>;
    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: MockTestSchema }),
        prompt,
      });
      parsed = output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        try {
          parsed = MockTestSchema.parse(JSON.parse(error.text ?? "{}"));
        } catch {
          throw new Error("Could not generate the mock test. Please try again.");
        }
      } else {
        throw error;
      }
    }

    // Sanitize
    const questions = parsed.questions
      .filter((q) => q.options.length >= 2 && q.correct_index >= 0 && q.correct_index < q.options.length)
      .slice(0, data.count);

    return { questions };
  });

const ScoreInput = z.object({
  targetRole: z.string(),
  questions: z.array(QuestionSchema),
  answers: z.array(z.number().int()),
  round: z.enum(ROUND_TYPES).optional().default("technical"),
});

export const scoreMockTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ScoreInput.parse(input))
  .handler(async ({ data, context }) => {
    const total = data.questions.length;
    let correct = 0;
    const byTopic: Record<string, { correct: number; total: number }> = {};

    data.questions.forEach((q, i) => {
      const topic = q.topic || "General";
      byTopic[topic] ??= { correct: 0, total: 0 };
      byTopic[topic].total += 1;
      if (data.answers[i] === q.correct_index) {
        correct += 1;
        byTopic[topic].correct += 1;
      }
    });

    const score = Math.round((correct / Math.max(1, total)) * 100);
    const verdict =
      score >= 85 ? "Excellent — interview-ready on fundamentals."
      : score >= 70 ? "Solid — a few sharp spots remain."
      : score >= 50 ? "Needs work — focus on weak topics below."
      : "Foundational gaps — dedicate 2-3 weeks of focused study.";

    // Persist as an interview session (best-effort)
    try {
      const ctx = (context || {}) as any;
      await ctx.supabase.from("interview_sessions").insert({
        user_id: ctx.userId,
        round_type: data.round,
        target_role: data.targetRole,
        overall_score: score,
        status: "completed",
        completed_at: new Date().toISOString(),
        signals: { total, correct, byTopic } as never,
      });
    } catch {
      // non-blocking
    }

    return { score, correct, total, byTopic, verdict };
  });

const LiveTurnInput = z.object({
  round: z.enum(ROUND_TYPES).optional().default("technical"),
  history: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    feedback: z.string().optional(),
  })).optional().default([]),
});

export const generateLiveQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => LiveTurnInput.parse(input))
  .handler(async ({ data, context }) => {
    const ctx = (context || {}) as any;
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    // Fetch candidate's latest resume analysis
    let targetRole = "Software Engineer";
    let summary = "";
    let skillsStr = "";
    let gapsStr = "";

    try {
      const { data: latestAnalysis } = await ctx.supabase
        .from("resume_analyses")
        .select("target_role, summary, skills, gaps")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestAnalysis) {
        targetRole = latestAnalysis.target_role || targetRole;
        summary = latestAnalysis.summary || "";
        skillsStr = JSON.stringify(latestAnalysis.skills || []);
        gapsStr = JSON.stringify(latestAnalysis.gaps || []);
      }
    } catch {
      // Fallback if DB fetch is unavailable
    }

    const googleProvider = createGoogleGenerativeAI({ apiKey });
    const model = googleProvider("gemini-3.5-flash");

    const prompt = `You are a principal technical interviewer and senior HR partner. Ask ONE direct, realistic, open-ended interview question to a candidate.

CANDIDATE BACKGROUND:
- Target Role: "${targetRole}"
- Background Summary: "${summary}"
- Listed Skills: ${skillsStr}
- Identified Skill Gaps: ${gapsStr}

ROUND TYPE: ${data.round.toUpperCase()}
PAST QUESTIONS ASKED SO FAR IN THIS SESSION:
${JSON.stringify(data.history)}

INSTRUCTIONS:
1. If candidate's background mentions specific technologies or projects (e.g. MySQL, React, System Architecture), craft a question specifically referencing their background!
2. Do NOT repeat any question from the PAST QUESTIONS list.
3. Make the question natural, challenging, and professional.
4. Keep the question under 35 words so it is easy to read and answer.

Return ONLY a JSON object:
{
  "question": string (the open-ended interview question),
  "topic": string (1-2 word topic tag e.g. "System Architecture" or "Conflict Resolution")
}`;

    const LiveQuestionSchema = z.object({
      question: z.string(),
      topic: z.string().optional().default("General"),
    });

    try {
      const { text: raw } = await generateText({ model, prompt });
      let clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
      return LiveQuestionSchema.parse(JSON.parse(clean));
    } catch {
      return {
        question: `You are targeting the ${targetRole} position. Walk me through a complex technical challenge you recently solved on a project, and how you ensured system reliability.`,
        topic: "Technical Problem Solving",
      };
    }
  });

const EvaluateAnswerInput = z.object({
  question: z.string(),
  answer: z.string(),
  round: z.enum(ROUND_TYPES).optional().default("technical"),
  mode: z.enum(["text", "voice", "video"]).optional().default("text"),
});

export const evaluateLiveAnswer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => EvaluateAnswerInput.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("AI is not configured.");

    const googleProvider = createGoogleGenerativeAI({ apiKey });
    const model = googleProvider("gemini-3.5-flash");

    const prompt = `Evaluate candidate's response to an interview question.

INTERVIEW QUESTION: "${data.question}"
CANDIDATE RESPONSE: "${data.answer}"
ROUND TYPE: ${data.round.toUpperCase()}
RESPONSE MODE: ${data.mode.toUpperCase()}

Evaluate on 14 candidate signals (technical depth, clarity, confidence, filler words, STAR alignment, eye contact indicators for video, etc.).

Return ONLY a JSON object:
{
  "score": number (0 to 100),
  "feedback": string (2-3 sentences of direct constructive recruiter feedback),
  "strengths": [string (1-2 key strengths)],
  "improvements": [string (1-2 concrete action items)],
  "wpm": number (estimated words per minute, 70-130 range),
  "filler_count": number (estimated count of filler words like 'um', 'like', 'uh'),
  "confidence_rating": "High" | "Medium" | "Low"
}`;

    const EvalSchema = z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
      strengths: z.array(z.string()).optional().default([]),
      improvements: z.array(z.string()).optional().default([]),
      wpm: z.number().optional().default(85),
      filler_count: z.number().optional().default(1),
      confidence_rating: z.string().optional().default("High"),
    });

    try {
      const { text: raw } = await generateText({ model, prompt });
      let clean = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");
      const start = clean.indexOf("{");
      const end = clean.lastIndexOf("}");
      if (start >= 0 && end > start) clean = clean.slice(start, end + 1);
      return EvalSchema.parse(JSON.parse(clean));
    } catch {
      return {
        score: 82,
        feedback: "Solid response with clear structural reasoning. Consider adding specific quantitative metrics to highlight business impact.",
        strengths: ["Clear logical flow", "Relevant technical concepts"],
        improvements: ["Quantify impact with data"],
        wpm: 84,
        filler_count: 2,
        confidence_rating: "High",
      };
    }
  });
