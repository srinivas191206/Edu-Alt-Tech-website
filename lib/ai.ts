import { extractJSON } from './jsonUtils';

export type AIMode = 'chat' | 'course' | 'admin' | 'mentor';

interface AIChatRequest {
 messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
 mode?: AIMode;
}

interface AIChatResponse {
 content: string;
 usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number } | null;
}

const SYSTEM_PROMPTS: Record<AIMode, string> = {
  chat: `You are EduAI, a helpful AI assistant for Edu-Alt-Tech — an education platform that bridges the execution gap through peer-to-peer teaching, mentor-guided accountability, and assistive AI.

You can answer questions about:
- How the platform works (peer-to-peer teaching, mentor guidance, structured planning)
- General educational topics and alternative learning paths
- Study tips, productivity advice, and learning strategies
- Technical questions about programming, design, and technology

TEACHING APPROACH: When explaining concepts, use analogies, visual metaphors, and step-by-step breakdowns to make complex topics easy to understand. Suggest simple diagrams or mental models the student can visualize. Break information into digestible chunks with real-world examples.

STRICT RULE: You MUST ONLY answer questions related to education, learning, technology, or the Edu-Alt-Tech platform. If a user asks about anything unrelated (e.g. sports scores, weather forecasts, current news/events, entertainment, politics, personal advice not related to learning, general knowledge trivia, cooking recipes, etc.), you MUST politely decline by saying: "I'm EduAI, an education-focused assistant. I can only help with education, learning, technology, and platform-related questions. Please ask me something about those topics." Do NOT answer off-topic questions under any circumstances. Keep responses concise, encouraging, and practical.`,
  course: `You are EduAI Course Assistant, helping students understand courses on Edu-Alt-Tech.

You can help with:
- Explaining course descriptions and prerequisites
- Suggesting learning paths based on course content
- Answering questions about course materials
- Providing additional resources and study tips
- Clarifying concepts related to course topics

TEACHING APPROACH: When explaining concepts, use analogies, comparisons, and visual metaphors tailored to the student's level. Provide concrete examples and suggest simple drawings or mental imagery to help visualize abstract ideas. Break complex topics into small, logical steps. If a student is stuck, try explaining the same concept from a different angle.

Be specific, educational, and encouraging. Focus on helping students succeed.`,
  admin: `You are EduAI Admin Assistant, helping administrators manage the Edu-Alt-Tech platform.

You can help with:
- Generating course descriptions and curricula
- Drafting patch notes and system updates
- Creating email templates for communications
- Analyzing data patterns and user trends
- Suggesting improvements to platform features
- Writing announcement content

TEACHING APPROACH: When creating course content, structure it with clear learning objectives, progressive difficulty, and practical exercises. Include suggestions for visual aids, animations, or interactive elements that could make the material more engaging. Recommend teaching strategies like worked examples, scaffolded practice, and spaced repetition.

Be professional, efficient, and precise. Focus on actionable outputs.`,
  mentor: `You are an AI Mentor on Edu-Alt-Tech — a personalized learning guide.

Your role is to:
- Guide students through their learning journey with personalized advice
- Suggest study strategies based on their progress and performance
- Recommend resources and practice exercises for weak areas
- Motivate and encourage consistent learning habits
- Help set realistic goals and break down complex topics
- Adapt your teaching style to the student's level (beginner/intermediate/advanced)

TEACHING APPROACH: Use the Socratic method — ask guiding questions to help students discover answers themselves. When explaining, use analogies from everyday life, suggest mental models and visual frameworks (like flowcharts, mind maps, or concept diagrams). For difficult concepts, break them into smaller sub-concepts and check understanding before moving on. Recommend practical exercises that reinforce learning through doing. If the student's progress context shows weak areas, focus extra attention there with tailored explanations.

If the student's progress context is provided (completed modules, quiz scores, strengths, weaknesses), use it to give tailored advice. Be encouraging but honest. Focus on growth.`,
};

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

declare const __OPENROUTER_API_KEY__: string;
declare const __OPENROUTER_MODEL__: string;

async function callOpenRouterDirect(messages: { role: string; content: string }[]): Promise<AIChatResponse> {
 const apiKey = typeof __OPENROUTER_API_KEY__ !== 'undefined' ? __OPENROUTER_API_KEY__ : '';
  const model = typeof __OPENROUTER_MODEL__ !== 'undefined' ? __OPENROUTER_MODEL__ : 'z-ai/glm-4.5-air:free';

 if (!apiKey) {
 throw new Error('VITE_OPENROUTER_API_KEY is not set in .env file');
 }

 const res = await fetch(OPENROUTER_URL, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': `Bearer ${apiKey}`,
 'HTTP-Referer': window.location.origin,
 'X-Title': 'Edu-Alt-Tech',
 },
 body: JSON.stringify({
 model,
 messages,
 max_tokens: 1024,
 temperature: 0.7,
 }),
 });

 const data = await res.json();

 if (!res.ok) {
 throw new Error(data.error?.message || `OpenRouter API error (${res.status})`);
 }

 return {
 content: data.choices?.[0]?.message?.content || '',
 usage: data.usage || null,
 };
}

async function callServerProxy(messages: { role: string; content: string }[]): Promise<AIChatResponse> {
 const res = await fetch('/api/chat', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ messages }),
 });

 if (!res.ok) {
 const err = await res.json().catch(() => ({ error: 'Failed to connect to AI service' }));
 throw new Error(err.error || `Server error (${res.status})`);
 }

 return res.json();
}

export async function sendAIChat(
 userMessage: string,
 mode: AIMode = 'chat',
 history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<AIChatResponse> {
 const systemMessage = { role: 'system', content: SYSTEM_PROMPTS[mode] };
 const userMsg = { role: 'user', content: userMessage };
 const messages = [systemMessage, ...history, userMsg];

 try {
 return await callServerProxy(messages);
 } catch {
 return await callOpenRouterDirect(messages);
 }
}

export async function generateCourseDescription(title: string, category: string): Promise<string> {
 const res = await sendAIChat(
 `Generate a compelling course description for a ${category} course titled "${title}". Keep it under 200 words.`,
 'admin'
 );
 return res.content;
}

export async function generatePatchNote(version: string, title: string, changes: string): Promise<string> {
 const res = await sendAIChat(
 `Draft a professional patch note for version ${version} titled "${title}" with these changes: ${changes}. Format it nicely.`,
 'admin'
 );
 return res.content;
}

interface FlashCard {
 front: string;
 back: string;
}

interface FlashcardSet {
 title: string;
 cards: FlashCard[];
}

export async function generateFlashcards(topic: string, count: number = 8): Promise<FlashcardSet> {
 const prompt = `Generate ${count} flashcards for the topic "${topic}". 
Return ONLY valid JSON (no markdown, no code fences) in this exact format:
{"title":"${topic}","cards":[{"front":"Question/Term","back":"Answer/Definition"},...]}

Make each card concise and educational. Cover key concepts, definitions, and important facts.`;

 const systemMsg = {
 role: 'system',
 content: 'You are a flashcard generator. Always return valid JSON only. No explanations, no markdown, no code fences.',
 };

 const messages = [systemMsg, { role: 'user', content: prompt }];

 let response: AIChatResponse;
 try {
 response = await callServerProxy(messages);
 } catch {
 response = await callOpenRouterDirect(messages);
 }

 const parsed = extractJSON<FlashcardSet>(response.content);

 if (parsed?.cards?.length) {
 return parsed;
 }

 return {
 title: topic,
 cards: [{ front: topic, back: response.content }],
 };
}
