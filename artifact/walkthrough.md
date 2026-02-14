# Hyper-Extensive Walkthrough: Generate & Insert Pipeline

This document explains the technical architecture and workflow of the **Generate** tool in Feynman Pipeline.

## 1. High-Level Flow

The generation pipeline is a multi-stage process that moves from user input to structured database records:

1.  **UI Entry**: User picks parameters in the dashboard.
2.  **Context Loading**: System pulls relevant physics/math context from the database.
3.  **Prompt Assembly**: A highly structured prompt is built, incorporating "cognitive bands."
4.  **AI Generation**: The LLM generates problems in JSON format.
5.  **Validation**: A validator cleans, parses, and type-checks the result.
6.  **DB Seeding**: Validated problems are inserted into the `Problem` table.

---

## 2. Component deep dive

### [UI] [GenerateClient.tsx](file:///home/safi/Desktop/WebDev/pipeline/app/generate/GenerateClient.tsx)
The entry point is a React client component where the operator selects:
- **Archetype ID**: The specific problem type (e.g., "Normalize a Wavefunction").
- **Band**: An ELO range (200–1600+) that dictates difficulty.
- **Count**: How many problems to generate (up to 50).

It submits to the `/api/generate-problems` endpoint and tracks the lifecycle stages (`generating`, `validating`, `inserting`).

### [API] [route.ts](file:///home/safi/Desktop/WebDev/pipeline/app/api/generate-problems/route.ts)
The orchestrator. It performs the following:
- **Input Validation**: Uses Zod to ensure the request body is valid.
- **Context Fetching**: Calls `buildPrompt`, which recursively loads the **Archetype**, its **Domain**, and its **Subject** from Prisma.
- **Retry Logic**: If the AI returns invalid JSON, it automatically tries exactly once more with a "repair prompt" to fix the formatting.

### [Logic] Prompt Construction & Seeding
The "Brain" of the operation lives in `lib/prompts/`.

#### [buildPrompt.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/prompts/buildPrompt.ts)
This module acts as a factory. It loads the **Subject/Domain/Archetype** context and delegates to specific builders (MCQ, Numeric, etc.).

#### [shared.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/prompts/shared.ts) & [bandDescriptions.ts](file:///home/safi/Desktop/WebDev/pipeline/generator/bandDescriptions.ts)
This is where **Problem Seeding** is ensured. The system doesn't just ask for "a hard question." It uses `BAND_DESCRIPTIONS` to tell the AI:
- **Cognitive Profile**: (e.g., "Recognition only" vs. "Analytic Synthesis").
- **Moves**: How many "steps" the problem should have (e.g., "Exactly 1 micro-move").
- **Constraints**: What to avoid (e.g., "No algebra" at lower bands).

#### Schema Matching ([problemSchema.ts](file:///home/safi/Desktop/WebDev/pipeline/schema/problemSchema.ts))
The prompt explicitly instructs the AI on the JSON shape. For example, an MCQ prompt adds:
```text
MCQ fields:
- choices: exactly 4 items: {id:"A"|"B"|"C"|"D", latex:string}
- correctChoice: "A"|"B"|"C"|"D"
```

### [AI] [generate.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/ai/generate.ts)
- **Model**: Uses `x-ai/grok-4.1-fast` via OpenRouter.
- **Strictness**: Enforces `response_format: { type: 'json_object' }`.
- **Identity**: Sets a system prompt: "You are a backend data generator."

---

## 3. Validation & Insertion

### [Validator] [parseAndValidateAiBatch.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/validators/parseAndValidateAiBatch.ts)
Even with JSON mode, AI output can contain markdown fences or leading/trailing text. This validator:
1.  **Cleans**: Strips code fences (```json).
2.  **Extracts**: Finds the first `{` and last `}` to isolate the JSON object.
3.  **Parses**: Converts string to JSON.
4.  **Schema Check**: Uses Zod (`generatedProblemBatchSchema`) to ensure every field matches the DB's expectations.

### [Database] [insertProblems.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/db/insertProblems.ts)
Final step. It maps the AI's generated fields into the [Prisma Schema](file:///home/safi/Desktop/WebDev/pipeline/prisma/schema.prisma):
- Maps `promptLatex`, `seedRating`, `rating`, `topic`, `tags`.
- Handles JSON payloads for `choices`.
- Uses `createMany` for efficient batch insertion.

---

## Summary of AI Constraints

| Question | Answer |
| :--- | :--- |
| **What AI is used?** | `x-ai/grok-4.1-fast` (via OpenRouter). |
| **What prompts?** | Context-aware templates built from Subject/Domain/Archetype hierarchies. |
| **How is schema matched?** | Enforced via explicit prompt instructions + Zod validation on output. |
| **How are problems seeded?** | Via `BAND_DESCRIPTIONS` which define ELO-specific difficulty characteristics. |
