# Testing Strategy

Tests define correctness.

No feature is complete without tests.

---

## 1. Definition of Done

A change is complete when:

- Behavior works
- Domain invariants are preserved
- Tests cover core logic
- No breaking schema change was introduced unintentionally

"No PR without tests" unless explicitly waived with written justification.

---

## 2. Unit Tests (Domain Layer)

Required for:

- Rating algorithm
- Problem selection logic
- Invariant enforcement
- Any pure function with business logic

Unit tests must:

- Avoid database
- Avoid HTTP
- Be deterministic

Domain tests are the most important tests.

---

## 3. Integration Tests (API Layer)

Required for:

- Attempt submission endpoint
- SkillState updates
- Problem retrieval logic
- Auth-protected endpoints

Integration tests must:

- Validate request → domain → persistence → response flow
- Check error shape consistency

---

## 4. Database Testing Strategy

Use one of:

Option A:
- Transaction per test
- Rollback after test

Option B:
- Dedicated test database
- Reset between runs

Never test against shared production database.

Test DB must:

- Mirror production schema
- Be isolated

---

## 5. Edge Case Coverage

Tests must cover:

- Invalid input
- Boundary ratings
- Duplicate attempts
- Nonexistent archetypes
- Authorization failures

---

## 6. Determinism Rule

Tests must not:

- Depend on real time
- Depend on randomness without seeding
- Depend on external APIs

Inject time and randomness.

---

## 7. Regression Safety

If a bug is discovered:

- Write a failing test first
- Fix the bug
- Ensure test passes

Never fix without test coverage for the failure mode.
