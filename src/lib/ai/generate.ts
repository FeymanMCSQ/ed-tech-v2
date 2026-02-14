import { nanoid } from 'nanoid';

export interface GenerationResult {
    content: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Wrapper for OpenRouter API calls.
 * Enforces JSON mode and systemic identity.
 */
export async function generateContent(args: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
}): Promise<GenerationResult> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const defaultModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.0-flash-001';

    if (!apiKey) {
        throw new Error('generateContent: OPENROUTER_API_KEY is not set');
    }

    const {
        prompt,
        systemPrompt = 'You are an assistant that strictly follows instructions and responds concisely. You are a backend data generator.',
        model = defaultModel,
    } = args;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://feynman.physics', // Optional, for OpenRouter rankings
            'X-Title': 'Feynman Pipeline',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            seed: 42, // For deterministic-ish results
            temperature: 0.1, // Low temperature for consistency
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenRouter API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('generateContent: No content returned from AI');
    }

    return {
        content,
        usage: data.usage,
    };
}
