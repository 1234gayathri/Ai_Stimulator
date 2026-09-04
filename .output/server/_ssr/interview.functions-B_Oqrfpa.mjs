import { ct as arrayType, dt as numberType, ft as objectType, pt as stringType, ut as enumType } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BwdutfJC.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
import { n as generateText, r as output_exports, t as NoObjectGeneratedError } from "../_libs/ai.mjs";
import { t as createGoogle } from "../_libs/@ai-sdk/google+[...].mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/interview.functions-B_Oqrfpa.js
var ROUND_TYPES = [
	"hr",
	"technical",
	"behavioral",
	"coding",
	"faang",
	"campus"
];
var GenerateInput = objectType({
	targetRole: stringType().min(1).max(200),
	difficulty: enumType([
		"easy",
		"medium",
		"hard"
	]).optional().default("medium"),
	count: numberType().int().min(3).max(15).optional().default(8),
	round: enumType(ROUND_TYPES).optional().default("technical")
});
var ROUND_PROMPTS = {
	hr: "Focus 100% on HR round: motivation, culture-fit, career story, strengths/weaknesses, salary expectations, situational HR judgement. All questions must be MCQs where the 'correct' option reflects the strongest professional answer. Topics tags: 'HR', 'Culture Fit', 'Career'.",
	technical: "Focus on the technical round for the role: mix of core CS/domain fundamentals (60%), applied problem solving (25%), and best-practices/design MCQs (15%). Topics tags reflect concrete skills (e.g. 'SQL', 'OOP', 'REST', 'Data Structures').",
	behavioral: "Focus 100% on behavioral / STAR-format situational questions. Each MCQ presents a workplace scenario; the correct option is the most effective STAR-aligned response. Topics: 'Conflict', 'Leadership', 'Ownership', 'Teamwork', 'Ambiguity'.",
	coding: "Focus on coding-round style MCQs: predict-the-output, complexity analysis, bug spotting, data-structure choice, algorithmic trade-offs. Include short code snippets in the question text using backticks. Topics: 'Arrays', 'Strings', 'Trees', 'DP', 'Complexity'.",
	faang: "FAANG-style round: system design trade-offs, scalability, distributed systems, and leadership-principles behavioral MCQs (Amazon LP style). Harder than default. Topics: 'System Design', 'Scalability', 'Leadership Principles'.",
	campus: "Campus placement blend: quantitative aptitude (30%), logical reasoning (25%), verbal ability (15%), core CS fundamentals for the role (20%), HR (10%). Topics: 'Aptitude', 'Logical', 'Verbal', 'CS Fundamentals', 'HR'."
};
var QuestionSchema = objectType({
	question: stringType(),
	options: arrayType(stringType()),
	correct_index: numberType(),
	explanation: stringType().optional().default(""),
	topic: stringType().optional().default("")
});
var MockTestSchema = objectType({ questions: arrayType(QuestionSchema) });
var generateMockTest_createServerFn_handler = createServerRpc({
	id: "dea2c0f0d7c5166c4b229ea96bd952ce385769bafbbdf4f9d10e0475bf9229aa",
	name: "generateMockTest",
	filename: "src/lib/interview.functions.ts"
}, (opts) => generateMockTest.__executeServer(opts));
var generateMockTest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => GenerateInput.parse(input)).handler(generateMockTest_createServerFn_handler, async ({ data }) => {
	const apiKey = processModule.env.GOOGLE_GENERATIVE_AI_API_KEY;
	if (!apiKey) throw new Error("AI is not configured.");
	const model = createGoogle({ apiKey })("gemini-3.5-flash");
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
	let parsed;
	try {
		const { output } = await generateText({
			model,
			output: output_exports.object({ schema: MockTestSchema }),
			prompt
		});
		parsed = output;
	} catch (error) {
		if (NoObjectGeneratedError.isInstance(error)) try {
			parsed = MockTestSchema.parse(JSON.parse(error.text ?? "{}"));
		} catch {
			throw new Error("Could not generate the mock test. Please try again.");
		}
		else throw error;
	}
	return { questions: parsed.questions.filter((q) => q.options.length >= 2 && q.correct_index >= 0 && q.correct_index < q.options.length).slice(0, data.count) };
});
var ScoreInput = objectType({
	targetRole: stringType(),
	questions: arrayType(QuestionSchema),
	answers: arrayType(numberType().int()),
	round: enumType(ROUND_TYPES).optional().default("technical")
});
var scoreMockTest_createServerFn_handler = createServerRpc({
	id: "217d79316c4896d2de8cc5c4d66f230a4baac4878626bd01aac6637e23aa3e54",
	name: "scoreMockTest",
	filename: "src/lib/interview.functions.ts"
}, (opts) => scoreMockTest.__executeServer(opts));
var scoreMockTest = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => ScoreInput.parse(input)).handler(scoreMockTest_createServerFn_handler, async ({ data, context }) => {
	const total = data.questions.length;
	let correct = 0;
	const byTopic = {};
	data.questions.forEach((q, i) => {
		const topic = q.topic || "General";
		byTopic[topic] ??= {
			correct: 0,
			total: 0
		};
		byTopic[topic].total += 1;
		if (data.answers[i] === q.correct_index) {
			correct += 1;
			byTopic[topic].correct += 1;
		}
	});
	const score = Math.round(correct / Math.max(1, total) * 100);
	const verdict = score >= 85 ? "Excellent — interview-ready on fundamentals." : score >= 70 ? "Solid — a few sharp spots remain." : score >= 50 ? "Needs work — focus on weak topics below." : "Foundational gaps — dedicate 2-3 weeks of focused study.";
	try {
		await context.supabase.from("interview_sessions").insert({
			user_id: context.userId,
			round_type: data.round,
			target_role: data.targetRole,
			overall_score: score,
			status: "completed",
			completed_at: (/* @__PURE__ */ new Date()).toISOString(),
			signals: {
				total,
				correct,
				byTopic
			}
		});
	} catch {}
	return {
		score,
		correct,
		total,
		byTopic,
		verdict
	};
});
//#endregion
export { generateMockTest_createServerFn_handler, scoreMockTest_createServerFn_handler };
