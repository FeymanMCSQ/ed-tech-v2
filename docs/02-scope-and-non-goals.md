# Scope and Non-Goals

This document exists to prevent scope creep.

Every new feature must justify itself against this list.

---

## 1. Non-Goals (Explicitly Out of Scope)

The following features are NOT part of this system:

### Social Systems
- Leaderboards
- Public profiles
- Following other users
- Comments or discussion threads

Reason:
Social mechanics distort skill measurement and complicate invariants.

---

### Content Marketplace
- User-submitted problem marketplaces
- Monetized content layers
- Instructor dashboards

Reason:
This is a skill engine, not a marketplace platform.

---

### AI Tutor Chat Layer
- Conversational tutoring
- Freeform Q&A
- Generative hint systems

Reason:
Freeform AI increases surface area and reduces determinism.
The engine trains skills through structured problems.

---

### Complex Gamification
- XP currencies beyond skill rating
- Cosmetic unlock trees
- Reward economies

Reason:
The rating system itself is the feedback loop.
Additional gamification introduces noise.

---

### Analytics Dashboards (Advanced)
- Behavioral heatmaps
- Cohort analytics
- Retention dashboards

Reason:
Operational analytics belong outside the core engine.

---

## 2. Allowed Scope

Allowed features must:

- Reinforce the core learning loop
- Improve rating calibration
- Improve problem selection
- Improve reliability
- Improve clarity of skill measurement

---

## 3. Anti-Complexity Rule

If a feature:

- Adds new tables
- Introduces cross-module coupling
- Requires background workers
- Adds configuration layers

It must justify itself in writing before implementation.

---

## 4. Schema Stability Rule

Until ownership transfer:

- No breaking schema changes
- No destructive migrations
- No column removals

After transfer:
- Expand/contract migration strategy required.

---

## 5. The Simplicity Test

Before implementing any feature, answer:

- Does this improve the skill calibration engine?
- Can the core loop still be explained in one paragraph?
- Does this preserve recomputability of derived state?

If the answer is unclear, the feature is rejected.
