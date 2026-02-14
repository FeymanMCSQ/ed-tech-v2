# Blueprint: Porting the /generate Pipeline

This guide details exactly how to transplant the **Generate & Insert** pipeline into a new Next.js app.

## 1. Environment Requirements
Add these to your `.env` file:
```env
OPENROUTER_API_KEY="your-key-here"
OPENROUTER_MODEL="x-ai/grok-4.1-fast" # Or any model supporting JSON mode
```

## 2. File Checklist (The "Bundle")

To port this feature, you must copy the following files/directories. Maintain the directory structure to avoid import path hell.

### Core AI & Prompt Logic (`/lib`)
- [ ] [generate.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/ai/generate.ts): The wrapper for OpenRouter API calls. Handles JSON mode and system instructions.
- [ ] [prompts/buildPrompt.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/prompts/buildPrompt.ts): The factory that loads database context and builds the final string.
- [ ] [prompts/mcq.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/prompts/mcq.ts): Template for MCQ problems.
- [ ] [prompts/shared.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/prompts/shared.ts): Shared prompt headers and topic block logic.
- [ ] [prompts/types.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/prompts/types.ts): TypeScript interfaces for prompt inputs and results.

### Content & Calibration
- [ ] [generator/bandDescriptions.ts](file:///home/safi/Desktop/WebDev/pipeline/generator/bandDescriptions.ts): **CRITICAL.** Contains the "Cognitive Band" descriptions that calibrate the AI's difficulty settings.

### Validation & Schema
- [ ] [schema/problemSchema.ts](file:///home/safi/Desktop/WebDev/pipeline/schema/problemSchema.ts): Zod definitions for Problems and Batches. This is the "Source of Truth" for valid data.
- [ ] [lib/validators/parseAndValidateAiBatch.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/validators/parseAndValidateAiBatch.ts): Cleans AI output (removes fences) and runs Zod validation.
- [ ] [lib/validators/errors.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/validators/errors.ts): Custom error classes for validation stages.

### Database & Utilities
- [ ] [lib/db/insertProblems.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/db/insertProblems.ts): Logic to map Zod objects to Prisma `createMany` inputs.
- [ ] [lib/utils/shuffleMcq.ts](file:///home/safi/Desktop/WebDev/pipeline/lib/utils/shuffleMcq.ts): Utility to randomize choice order (A/B/C/D) before saving.

---

## 3. Database Schema Requirements

Your `schema.prisma` must support the fields being generated. Minimally, the `Problem` model needs:
```prisma
model Problem {
  id             String      @id @default(cuid())
  promptLatex    String
  seedRating     Int
  rating         Int
  topic          String
  tags           String[]
  solutions      String?
  type           ProblemType @default(MCQ)
  choices        Json?       // For MCQ
  correctChoice  String?     // e.g., "A"
  correctNumeric Json?       // For Numeric
  correctExpr    Json?       // For Expression
  archetypeId    String?
  archetype      Archetype?  @relation(fields: [archetypeId], references: [id])
}

enum ProblemType {
  MCQ
  NUMERIC
  EXPRESSION
  OPEN
}
```

---

## 4. API & Route Setup

### [API Route] `/api/generate-problems/route.ts`
Copy the implementation from [route.ts](file:///home/safi/Desktop/WebDev/pipeline/app/api/generate-problems/route.ts). 
**Key implementation details to keep:**
- The `bodySchema` Zod check.
- The `attempts` loop for automatic retry on JSON parse failure.
- The stage-based error reporting (e.g., `stage: 'context'`, `stage: 'validation'`).

---

## 5. Frontend UI Component

### [Page] `/app/generate/page.tsx`
A simple server component that wraps the client generator.

### [Client] `/app/generate/GenerateClient.tsx`
The main interactive UI. It must handle:
- **UI Stages**: `idle` -> `generating` -> `validating` -> `inserting` -> `done`.
- **Error Display**: Specifically handling the `issues` array from Zod to show exact line-by-line validation failures to the operator.

---

## 6. Implementation Tips

> [!IMPORTANT]
> **Context Hierarchy**: The `buildPrompt` logic assumes you have `Subject -> Domain -> Archetype` as a database hierarchy. If your new app has a different structure, you must refactor `loadArchetypeContext` in `lib/prompts/buildPrompt.ts`.

> [!TIP]
> **AI Strictness**: If the AI starts leaking "Here is your JSON" text, ensure your system prompt in `lib/ai/generate.ts` is exactly: `"You are an assistant that strictly follows instructions and responds concisely. You are a backend data generator."`
