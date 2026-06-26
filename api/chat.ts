const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MAX_MESSAGES = 50;
const MAX_CONTENT_LENGTH = 4000;

interface ChatRequest {
  messages: { role: string; content: string }[];
  model?: string;
}

function sanitizeMessage(content: string): string {
  return content
    .replace(/<[^>]*>/g, '')             // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '') // strip control chars
    .trim();
}

function validateMessages(messages: { role: string; content: string }[]): boolean {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return false;
  }
  const validRoles = ['user', 'assistant', 'system'];
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') return false;
    if (!validRoles.includes(msg.role)) return false;
    if (typeof msg.content !== 'string') return false;
    if (msg.content.length > MAX_CONTENT_LENGTH) return false;
  }
  return true;
}

export default async function handler(req: any, res: any) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Must use POST.' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI service is not configured.' });
  }

  const { messages, model } = req.body as ChatRequest;

  if (!validateMessages(messages)) {
    return res.status(400).json({ error: 'Invalid request format.' });
  }

  const sanitizedMessages = messages.map(msg => ({
    role: msg.role,
    content: sanitizeMessage(msg.content),
  }));

  if (sanitizedMessages.some(m => m.content.length === 0)) {
    return res.status(400).json({ error: 'Messages cannot be empty.' });
  }

  const selectedModel = model || process.env.VITE_OPENROUTER_MODEL || 'z-ai/glm-4.5-air:free';

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: sanitizedMessages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API error (status not logged):', response.status);
      return res.status(502).json({ error: 'AI service request failed.' });
    }

    return res.status(200).json({
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage || null,
    });
  } catch (error: any) {
    console.error('AI proxy error (details omitted):', error.message);
    return res.status(502).json({ error: 'Failed to communicate with AI provider.' });
  }
}
