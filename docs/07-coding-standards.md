# Coding Standards

This document defines coding discipline.

Clarity over cleverness.

---

## 1. TypeScript Strictness

The following are mandatory:

- "strict": true
- "noImplicitAny": true
- "strictNullChecks": true

The use of `any` is prohibited.

If unavoidable:
- Isolate it
- Document why
- Convert immediately to a typed structure

---

## 2. Public Function Rules

All public functions must:

- Have explicit parameter types
- Have explicit return types
- Avoid implicit inference at boundaries

Example:

export function updateRating(
  attempts: Attempt[],
  previousRating: number
): number

No untyped public exports.

---

## 3. Single Responsibility Principle

A function should have one reason to change.

Red flags:

- Function both validates and persists
- File both computes rating and handles HTTP
- Repository layer performing domain decisions

Split responsibilities cleanly.

---

## 4. File Size Guidance

Avoid:

- 50 tiny files with one trivial function each
- 800-line "god files"

Guidelines:

- 150–400 lines per file is acceptable if cohesive.
- Split by responsibility, not by micro-abstraction.

Cohesion > artificial fragmentation.

---

## 5. Naming Conventions

Types:
- PascalCase (User, SkillState)

Variables:
- camelCase

Constants:
- SCREAMING_SNAKE_CASE only for true constants

Functions:
- Verb-based (computeRating, recordAttempt)

Boolean variables:
- isX, hasY, canZ

---

## 6. Commenting Rules

Do not comment the obvious.

Bad:
  // increment i
  i++

Good:
  // We store attempts append-only so rating logic can be recomputed if the algorithm changes.

Comment:

- Why decisions were made
- Tradeoffs
- Invariants
- Edge case reasoning

If code is complex:
- Add a short reasoning block at the top of the function.

---

## 7. Error Handling

Never:

- Swallow errors silently
- Return undefined instead of throwing
- Mix error-handling patterns

Errors must:

- Be explicit
- Be typed where possible
- Be mapped to API error format at API layer

---

## 8. No Drive-By Refactors

When implementing a feature:

- Do not modify unrelated files
- Do not reformat entire modules
- Do not rename unrelated variables

Small, intentional diffs only.
