export const BAND_DESCRIPTIONS: Record<string, string> = {
    '200_300': `
ELO 200–300 — Pre-Foundation (Micro-Intuition)

Cognitive profile:
- Recognition only. No execution required.
- One-bit decisions (Yes/No, This/That).

Question structure:
- Yes/No, This/That, or tiny MCQs.
- Extremely short prompts.
- Single concept, zero ambiguity.

Triggers:
- Fully explicit.
- The question literally tells you what is being asked.

Moves:
- Exactly 1 micro-move.
- No chaining, no multi-step reasoning.

Scaffolding:
- Maximum scaffolding provided.
- All information needed is given directly.

Must avoid:
- Any calculation beyond inspection.
- Any need to recall formulas or procedures.
- Any domain-specific jargon not defined in the prompt.
`,

    '300_400': `
ELO 300–400 — Bridge into Formal Thinking

Cognitive profile:
- Vocabulary recognition + simple structure identification.
- First contact with formal terminology.

Question structure:
- Small MCQs or short-answer.
- Single concept per question.
- Definitions and basic facts.

Triggers:
- Explicit, but slightly less hand-holding.
- Key terms are referenced, not re-explained.

Moves:
- 1 clear move.
- Still no chaining.

Scaffolding:
- Heavy scaffolding.
- All relevant context provided.

Must avoid:
- Multi-step reasoning.
- Ambiguous interpretation.
- Requiring recall of procedures.
`,

    '400_500': `
ELO 400–500 — Early Competence (Recognition & Application)

Cognitive profile:
- Can recall and apply a single known rule or procedure.

Question structure:
- Short free-response or MCQs.
- One-step computation, identification, or classification.

Triggers:
- Explicit (e.g., "calculate", "identify", "define").

Moves:
- Exactly 1 procedure or concept application.
- No setup decisions required.

Scaffolding:
- All needed information is given.
- No interpretation of what method to use.

Must avoid:
- Any choice between competing methods.
- Any hidden or implicit interpretation.
`,

    '500_600': `
ELO 500–600 — Confident Single-Step Execution

Cognitive profile:
- Executes simple, well-defined procedures reliably.

Question structure:
- One-step problems with light computation.
- Clean and guided.

Triggers:
- Explicit, but may require recalling which rule or formula applies.

Moves:
- 1 procedure, possibly with trivial supporting work.

Scaffolding:
- Context is given. Method may need to be recalled.

Must avoid:
- Chaining multiple procedures.
- Implicit method selection beyond basic recall.
`,

    '600_700': `
ELO 600–700 — Early Procedural Fluency

Cognitive profile:
- Comfortable with basic domain procedures.
- Beginning to chain simple steps.

Question structure:
- Short problems with 1–2 steps.
- Computation is no longer trivial but still routine.

Triggers:
- Explicit ("find", "compute", "determine").

Moves:
- 1–2 procedures in sequence.
- The chain is obvious and predictable.

Scaffolding:
- Problem is clearly stated.
- No need to choose between approaches.

Must avoid:
- Ambiguity in problem setup.
- Requiring the solver to select between competing approaches.
`,

    '700_800': `
ELO 700–800 — Procedural Repetition

Cognitive profile:
- Can repeat known routines across different contexts.
- Comfortable with familiar multi-step procedures.

Question structure:
- Multi-step but linear.
- Same method applied start to finish.

Triggers:
- Explicit or strongly hinted.

Moves:
- 2 procedures in a fixed, predictable order.

Scaffolding:
- Context is clear.
- Moderate guidance.

Must avoid:
- Competing solution paths.
- Setup ambiguity.
- Requiring the solver to frame the problem themselves.
`,

    '800_900': `
ELO 800–900 — Controlled Application (Low Ambiguity)

Cognitive profile:
- Begins selecting between a small set of known methods.
- Can handle slight variations in familiar contexts.

Question structure:
- Familiar context with slight variation.
- Still feels "textbook-like".

Triggers:
- Method hinted but not explicitly named.

Moves:
- 2–3 procedures.
- Chaining is required but the order is obvious.

Scaffolding:
- Mostly given.
- One minor inference may be needed.

Must avoid:
- Multiple equally plausible starting approaches.
- Hidden interpretation traps.
`,

    '900_1000': `
ELO 900–1000 — Controlled Application (High Reliability)

Cognitive profile:
- Reliable execution under mild ambiguity.
- Can infer the correct approach from context.

Question structure:
- Less scaffolding.
- Cleaner statement, fewer hints.

Triggers:
- Not explicit; must be inferred from the problem context.

Moves:
- 3 procedures.
- A wrong initial move wastes time but is recoverable.

Scaffolding:
- Problem is well-defined but not heavily guided.
- Solver must identify the relevant information.

Must avoid:
- Heavy synthesis across multiple topics.
- Open-ended interpretation.
`,

    '1000_1100': `
ELO 1000–1100 — Procedural Competence

Cognitive profile:
- Comfortable choosing the correct procedure without being told.
- Can distinguish relevant from irrelevant information.

Question structure:
- Real exam-style wording.
- No explicit "do X" instruction.

Triggers:
- Implicit but unambiguous.

Moves:
- 3 procedures in sequence.
- Correct setup matters significantly.

Scaffolding:
- Minimal. Solver must frame the approach.
- May require choosing the correct tool or method.

Must avoid:
- Fully open-ended questions.
- Cross-topic synthesis requiring knowledge from unrelated areas.
`,

    '1100_1200': `
ELO 1100–1200 — Robust Setup & Execution

Cognitive profile:
- Can handle ambiguity in problem setup.
- Understands what matters and what is a distraction.

Question structure:
- Messier wording.
- Irrelevant or distracting information may be present.

Triggers:
- Implicit.
- Multiple plausible methods exist.

Moves:
- 3–4 procedures.
- Wrong initial framing leads to a dead-end.

Scaffolding:
- Low. Solver must self-organize.

Must avoid:
- Long conceptual essays as answers.
- Novel method invention.
`,

    '1200_1300': `
ELO 1200–1300 — Structured Reasoning

Cognitive profile:
- Problem setup is half the challenge.
- Solver must plan before executing.

Question structure:
- Realistic exam problems.
- Requires translation from natural language to formal structure.

Triggers:
- Implicit and overlapping.

Moves:
- 4 procedures.
- Chaining is non-trivial.

Scaffolding:
- Very low. Solver must determine the approach entirely.

Must avoid:
- Fully open-ended exploration.
- Problems requiring research-level insight.
`,

    '1300_1400': `
ELO 1300–1400 — Pre-Synthesis Reasoning

Cognitive profile:
- Can integrate multiple ideas and procedures coherently.
- Plans multi-step strategies.

Question structure:
- Minimal guidance.
- Requires justification of approach.

Triggers:
- Ambiguous.
- Several viable paths, only one efficient.

Moves:
- 4–5 procedures.
- Errors are costly and hard to recover from.

Scaffolding:
- None. Full self-direction.

Must avoid:
- Research-level novelty.
- Problems with no well-defined solution path.
`,

    '1400_1500': `
ELO 1400–1500 — Conceptual Integration

Cognitive profile:
- Chooses tools and methods based on deep structural understanding, not habit.
- Can synthesize across sub-topics within a domain.

Question structure:
- Semi-open.
- "Explain why" or "justify your approach" appears naturally.

Triggers:
- High ambiguity.
- Solver must identify the core challenge.

Moves:
- 5 procedures.
- Strategy-first thinking required.

Scaffolding:
- None.

Must avoid:
- Complete lack of constraints.
- Problems requiring external knowledge not in the domain.
`,

    '1500_1600': `
ELO 1500–1600 — Advanced Integration

Cognitive profile:
- Independent reasoning under pressure.
- Can compress complex multi-step logic into efficient solutions.

Question structure:
- Exam-hard synthesis problems.
- Little to no scaffolding.

Triggers:
- Must be inferred from deep structural analysis.

Moves:
- 5+ procedures.
- Requires justification and elegant compression.

Scaffolding:
- None.

Must avoid:
- Research-level originality.
- Problems that are inherently unsolvable without novel theory.
`,
};
