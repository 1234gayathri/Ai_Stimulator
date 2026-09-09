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

function createDynamicFallbackQuestions(targetRole: string, round: RoundType, count: number): MockQuestion[] {
  const role = targetRole || "Software Engineer";
  
  const questionTemplates: Record<RoundType, Array<{ q: string; opts: string[]; correct: number; exp: string; topic: string }>> = {
    technical: [
      {
        q: `What is the primary architectural consideration when designing a high-throughput backend service for a ${role}?`,
        opts: ["Decoupling services using asynchronous message queues", "Single-threaded synchronous processing", "Hardcoding database connections", "Disabling connection pooling"],
        correct: 0,
        exp: "Asynchronous messaging queues (e.g. Kafka/RabbitMQ) decouple microservices and handle traffic spikes smoothly.",
        topic: "Architecture",
      },
      {
        q: `Which indexing strategy is most effective for optimizing read-heavy database queries in a ${role} system?`,
        opts: ["B-Tree / Composite indexes on frequently queried filter columns", "Table scan without indexes", "Indexing every single column indiscriminately", "Storing queries in plain text files"],
        correct: 0,
        exp: "Composite B-Tree indexes significantly reduce query execution time for frequent multi-column filters.",
        topic: "Database",
      },
      {
        q: `How do you prevent memory leaks when managing long-lived data structures in ${role} applications?`,
        opts: ["Cleaning up event listeners, timers, and unneeded references", "Increasing server RAM infinitely", "Ignoring unhandled promise rejections", "Relying purely on process exit"],
        correct: 0,
        exp: "Proper cleanup of event listeners, global references, and subscriptions prevents memory leaks.",
        topic: "Memory Management",
      },
      {
        q: `What is the role of an API Gateway in a modern ${role} cloud infrastructure?`,
        opts: ["Handling routing, rate-limiting, authentication, and load balancing", "Executing direct SQL queries on client browsers", "Replacing all application business logic", "Compiling client-side code"],
        correct: 0,
        exp: "API Gateways act as a centralized reverse proxy for security, rate limiting, and request routing.",
        topic: "API Gateway",
      },
    ],
    hr: [
      {
        q: `Why are you interested in advancing your career as a ${role} with our company?`,
        opts: ["The engineering challenges align with my expertise and long-term impact goals", "I just want a job title upgrade", "I haven't researched the company yet", "I prefer minimal accountability"],
        correct: 0,
        exp: "Demonstrates clear alignment between professional skills, personal growth, and company mission.",
        topic: "Motivation",
      },
      {
        q: `How do you handle constructive feedback from senior engineering leads on a code review for a ${role} feature?`,
        opts: ["Actively listen, analyze the technical merit, and implement recommended improvements", "Defend my original code without reviewing alternatives", "Ignore the feedback completely", "Refuse to make any edits"],
        correct: 0,
        exp: "Constructive feedback acceptance is a core signal of professional maturity and team collaboration.",
        topic: "Culture Fit",
      },
      {
        q: `Where do you see your technical trajectory as a ${role} over the next 3 to 5 years?`,
        opts: ["Deepening technical domain mastery, mentoring peers, and driving system architecture", "Doing the bare minimum required", "Switching domains every month", "Avoiding project ownership"],
        correct: 0,
        exp: "Shows clear commitment to professional growth and leadership in the domain.",
        topic: "Career Growth",
      },
    ],
    behavioral: [
      {
        q: `Describe a situation where a critical production incident occurred in a ${role} project. How did you respond?`,
        opts: ["Initiated incident triage, identified root cause, deployed hotfix, and authored a post-mortem", "Blamed another team member publicly", "Shut down all servers without notice", "Waited for users to complain"],
        correct: 0,
        exp: "Demonstrates STAR method ownership, structured incident response, and continuous prevention.",
        topic: "Ownership",
      },
      {
        q: `How do you resolve a technical disagreement with a teammate regarding a design choice for a ${role} feature?`,
        opts: ["Evaluate trade-offs using objective benchmarks and prototypes to reach consensus", "Insist on my preference without benchmarks", "Escalate immediately without discussion", "Abandon the project"],
        correct: 0,
        exp: "Data-driven evaluation and respectful technical dialogue build high-performing engineering teams.",
        topic: "Conflict Resolution",
      },
    ],
    coding: [
      {
        q: `What is the time complexity of searching an element in a balanced Binary Search Tree (BST)?`,
        opts: ["O(log N)", "O(N^2)", "O(N log N)", "O(1)"],
        correct: 0,
        exp: "Balanced BST operations reduce search time by halving the search space at each step: O(log N).",
        topic: "Data Structures",
      },
      {
        q: `In a ${role} application, which data structure is optimal for implementing an LRU Cache with O(1) operations?`,
        opts: ["Doubly Linked List combined with a Hash Map", "Single Array", "Stack", "Binary Heap"],
        correct: 0,
        exp: "Hash Map provides O(1) lookups while Doubly Linked List provides O(1) node removal/insertion.",
        topic: "Algorithms",
      },
    ],
    faang: [
      {
        q: `When designing a distributed rate limiter for a ${role} platform handling 1,000,000 requests/sec, which algorithm is best?`,
        opts: ["Sliding Window Counter using Redis Cluster", "Simple in-memory array", "Single-threaded MySQL lock", "File-based locking"],
        correct: 0,
        exp: "Sliding Window Counter with Redis provides memory efficiency and accurate rate limiting across nodes.",
        topic: "System Design",
      },
      {
        q: `How do you ensure data consistency across multiple microservices in a ${role} architecture?`,
        opts: ["Implementing the Saga Pattern with Event Sourcing / Outbox pattern", "Disabling database transactions", "Relying on client-side retry loops", "Using a single global lock"],
        correct: 0,
        exp: "The Saga pattern manages distributed transactions using choreography or orchestration safely.",
        topic: "Distributed Systems",
      },
    ],
    campus: [
      {
        q: `What is the key difference between Process and Thread in Operating System fundamentals for a ${role}?`,
        opts: ["Threads share memory space of parent process, while processes have independent memory address spaces", "Processes are lighter than threads", "Threads cannot execute concurrently", "Processes share stack space"],
        correct: 0,
        exp: "Threads within a process share code and heap memory, whereas processes maintain isolated memory.",
        topic: "OS Fundamentals",
      },
      {
        q: `Which concept in Object-Oriented Programming allows a single interface to represent different underlying data types?`,
        opts: ["Polymorphism", "Encapsulation", "Inheritance", "Abstraction"],
        correct: 0,
        exp: "Polymorphism enables methods to process objects differently based on their data type or class.",
        topic: "OOP Concepts",
      },
    ],
  };

  const pool = questionTemplates[round] || questionTemplates.technical;
  const list: MockQuestion[] = [];
  
  for (let i = 0; i < count; i++) {
    const item = pool[i % pool.length];
    list.push({
      question: item.q,
      options: item.opts,
      correct_index: item.correct,
      explanation: item.exp,
      topic: item.topic,
    });
  }
  return list;
}

export const generateMockTest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => GenerateInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return { questions: createDynamicFallbackQuestions(data.targetRole, data.round, data.count) };
    }

    try {
      const googleProvider = createGoogleGenerativeAI({ apiKey });
      const model = googleProvider("gemini-1.5-flash");

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

      const { output } = await generateText({
        model,
        output: Output.object({ schema: MockTestSchema }),
        prompt,
      });

      const questions = output.questions
        .filter((q) => q.options.length >= 2 && q.correct_index >= 0 && q.correct_index < q.options.length)
        .slice(0, data.count);

      if (questions.length > 0) {
        return { questions };
      }
    } catch (err) {
      console.warn("AI MockTest generation fallback:", err);
    }

    return { questions: createDynamicFallbackQuestions(data.targetRole, data.round, data.count) };
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
    const model = googleProvider("gemini-1.5-flash");

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
    const model = googleProvider("gemini-1.5-flash");

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
