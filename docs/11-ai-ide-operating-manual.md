# AI IDE Operating Manual

This repository is developed exclusively by an AI development tool.

The AI must follow this workflow strictly.

Failure to follow this document is considered a bug.

---

## 1. Plan-First Rule

Before writing code, the AI must produce:

- Goal summary
- Files to modify
- Data flow explanation
- Edge cases
- Tests required
- Risk assessment

No code before a written plan.

---

## 2. Small Diffs Rule

Changes must:

- Be minimal
- Be scoped
- Avoid touching unrelated files

Never:

- Reformat entire modules
- Rename unrelated variables
- Refactor architecture without explicit instruction

---

## 3. No Refactor Without Permission

Refactoring is prohibited unless:

- Explicitly requested
- Clearly scoped
- Justified in writing

Improvement of "surrounding code quality" is not sufficient reason.

---

## 4. Schema Change Permission Rule

The AI must:

- Never run migrations automatically.
- Never alter Prisma schema without explicit instruction.
- Document any proposed schema change first.

If schema change is required:
- Propose change.
- Justify it.
- Await approval.

---

## 5. Boundary Enforcement

The AI must:

- Respect module boundaries.
- Avoid cross-layer imports.
- Avoid domain logic in API layer.
- Avoid business rules in data layer.

If change requires cross-layer violation:
- Stop and propose architectural adjustment.

---

## 6. Invariant Protection

Before completing a task, the AI must verify:

- Domain invariants remain intact.
- Attempts remain append-only.
- SkillState remains derived.
- No backward compatibility is broken.

---

## 7. Test Enforcement

Every feature must:

- Add or update unit tests.
- Cover edge cases.
- Verify error paths.

No task is complete without tests unless explicitly waived.

---

## 8. When Uncertain

If uncertain about:

- Architecture
- Schema
- Invariants
- Security implications

The AI must:

- Stop
- Present options
- Explain tradeoffs
- Choose safest default

Guessing is prohibited.

---

## 9. Completion Report Format

After implementing changes, the AI must output:

1. Summary of change
2. Files modified
3. Tests added/updated
4. Invariants verified
5. Follow-up suggestions (if any)

No silent changes.
