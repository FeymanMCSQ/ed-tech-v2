# Glossary

This document defines canonical terminology for the system.

Terms defined here must be used consistently across:
- Domain
- API
- Documentation
- Tests
- AI-generated code

If vocabulary conflicts arise, this document is authoritative.

---

## Archetype

Definition:
A recurring exam pattern representing a single conceptual skill.

An archetype includes:
- Heuristic Trigger (pattern recognition cue)
- Canonical Example
- Practice Problems across rating bands
- Immediate feedback loop
- Independent rating ladder

An archetype is not:
- A chapter
- A topic list
- A lecture unit

It is a playable cognitive level.

Each archetype maintains its own skill calibration.

---

## Heuristic Trigger

A recognizable pattern that signals which method or theorem applies.

Example:
"If you see ∮C F·dr over a closed curve, consider Green’s Theorem."

Triggers train pattern recognition, not blind execution.

---

## Rating (ELO)

A numerical estimate of skill or difficulty on a 200–1900 ladder.

Two types exist:

- User Rating (skill estimate)
- Problem Rating (difficulty estimate)

The rating ladder is structured as:

200–300 → Micro-Intuition  
300–400 → Bridge  
400–800 → Recognition & Manipulation  
800–1400 → Structured Application  
1400–1700 → Multi-Concept Reasoning  
1700–1900 → Autonomous Problem Solving  

See rating ladder definition :contentReference[oaicite:4]{index=4}  
See early ladder (200–400) :contentReference[oaicite:5]{index=5}

Ratings are continuous, but cognitive stages are banded.

---

## ELO Update

A deterministic adjustment applied after each attempt.

Inputs:
- User rating
- Problem rating
- Outcome (correct / incorrect)
- K-factor (confidence)

Purpose:
Maintain ~70% challenge zone for flow learning.

See adaptive logic description :contentReference[oaicite:6]{index=6}

---

## Attempt (Source of Truth)

A single recorded interaction between a user and a problem.

Properties:
- userId
- problemId
- chosenAnswer
- correctness
- timestamp
- duration

Attempts are append-only.

Attempts are the canonical record of learning events.

All derived state must be recomputable from attempts.

---

## Derived State

Data computed from source-of-truth events.

Examples:
- SkillState
- Mastery flags
- Progress summaries
- Forecast grade bands

Derived state may be deleted and rebuilt.

Attempts may not.

---

## SkillState

The current estimated rating of a user within one archetype.

Properties:
- userId
- archetypeId
- rating
- attemptsCount
- lastUpdated

SkillState is a cache of learning trajectory.

It must never contain information that cannot be reconstructed from attempts.

---

## Band

A rating interval corresponding to a cognitive stage.

Examples:

- 400–600 → Recognition
- 1000–1200 → Procedural competence
- 1600–1800 → Analytic synthesis

Bands determine:
- Problem structure
- Feedback protocol
- Hint intensity
- Tutor behavior

See band mapping :contentReference[oaicite:7]{index=7}  
See adaptive behavior mapping :contentReference[oaicite:8]{index=8}

---

## Mastery Gate

A rating threshold marking a cognitive transition.

Examples:
- 1000 → Procedural threshold
- 1400 → Setup correctness threshold
- 1600 → Integration threshold
- 1800 → Open-ended reasoning threshold

Mastery gates unlock new problem structures.

Defined in adaptive behavior spec :contentReference[oaicite:9]{index=9}

---

## Baseline Migration

A migration that captures the current schema state without replaying full history.

Used during schema ownership transfer.

Purpose:
- Freeze current schema
- Establish new migration starting point
- Avoid drift from legacy migration history

Baseline migration does not modify existing tables.
It records current structure as starting state.

---

## Expand / Contract

A schema evolution strategy used when two applications coexist.

Expand:
- Add fields/tables
- Maintain compatibility

Migrate:
- Backfill data

Contract:
- Remove legacy fields only after safe cutover

Never remove columns during coexistence.

---

## Source of Truth

The minimal data from which system truth can be reconstructed.

In this system:
- Attempts are the source of truth.
- Ratings are not.

---

## Flow Zone

The ~70% success probability range where learning is maximized.

Maintained by:
- Adaptive ELO
- Dynamic problem selection

Referenced in Crash-Prep philosophy :contentReference[oaicite:10]{index=10}

---

## Micro-Intuition Tier (200–300)

Ultra-guided problems for first contact with a concept.

Focus:
- Pattern familiarity
- Recognition
- Low-friction success

Defined in early ladder :contentReference[oaicite:11]{index=11}

---

## Wood Tier (400)

Official entry point into main ladder.

Transition from toy problems to structured problem solving.

Defined in early ladder :contentReference[oaicite:12]{index=12}

---

## Deterministic Core

The part of the system that must produce identical outputs for identical inputs.

Includes:
- Rating updates
- Skill progression logic
- Problem selection logic

Must not depend on:
- Time
- Randomness (unless injected)
- Hidden global state

---

## Schema Owner

The application responsible for executing migrations.

Only one schema owner may exist at a time.

During rewrite:
- Legacy app owns schema.

After cutover:
- This application owns schema.

See database policy document.

---

## Definition of Done

A change is complete when:

- Domain invariants hold
- Tests pass
- No schema violation occurred
- Logging and error conventions are respected
- Small diff principle maintained
