# Domain Model

This document defines the stable nouns of the system and their invariants.

Domain terms must remain stable even if infrastructure changes.

---

## 1. Core Entities

### User

Represents a learner.

Properties:
- id
- createdAt
- status (active, suspended, etc.)

User does not directly store skill ratings.

---

### Archetype

Represents a granular skill.

Properties:
- id
- name
- description
- domain category
- active flag

Invariant:
An archetype represents exactly one conceptual skill.
It must not overlap ambiguously with others.

---

### Problem

Represents a single structured question tied to one archetype.

Properties:
- id
- archetypeId
- prompt
- choices
- correctChoice
- difficultyRating
- version
- active flag

Invariants:
- A problem belongs to exactly one archetype.
- correctChoice must exist in choices.
- difficultyRating is immutable once published.
- Version changes create new records, not edits.

---

### Attempt (Source of Truth)

Represents a user’s answer submission.

Properties:
- id
- userId
- problemId
- chosenChoice
- isCorrect
- durationMs
- createdAt

Invariants:
- Attempts are append-only.
- Attempts cannot be edited.
- isCorrect must be deterministically derived from chosenChoice and problem.
- Attempts are the canonical record of learning events.

Attempts are the source of truth for skill calculation.

---

### SkillState (Derived State)

Represents a user's skill estimate for a specific archetype.

Properties:
- userId
- archetypeId
- rating
- attemptsCount
- lastUpdated

Invariants:
- SkillState must be recomputable from Attempts.
- SkillState is a cache, not the source of truth.
- Deleting SkillState must not destroy learning history.

---

## 2. Source of Truth vs Derived State

Source of Truth:
- Attempts

Derived State:
- SkillState
- Aggregated statistics
- Progress summaries

Rule:
Derived state must be rebuildable from Attempts at any time.

---

## 3. Invariant Enforcement Rules

The domain layer is responsible for enforcing:

- Append-only attempt creation
- Deterministic rating updates
- Valid problem-to-archetype mapping
- Immutable difficulty rating after publish

The database enforces:
- Foreign key constraints
- Non-null constraints
- Uniqueness constraints

---

## 4. Illegal States Must Be Impossible

Examples of illegal states:

- Problem without archetype
- SkillState without corresponding archetype
- Attempt referencing nonexistent problem
- SkillState that cannot be recomputed from attempts

Domain logic and database constraints must prevent these states.
