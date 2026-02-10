# Repository Operating Manual

This document explains how to work in this repository.  
It is the entry point for all contributors, including AI development tools.

---

## 1. Purpose of This Repository

This repository contains the rewrite of the Archetype-Based Learning Engine.

The goal of this rewrite is:

- Simplicity
- Clear architectural boundaries
- Stable data invariants
- Long-term scalability
- Minimal conceptual surface area

This is not an experiment sandbox.  
This is the production codebase that will eventually own the database schema.

---

## 2. Authoritative Documents

The `/docs` directory defines the rules of this system.

If there is a conflict between:
- Code and docs → **Docs win**
- Assumptions and docs → **Docs win**
- Convenience and docs → **Docs win**

Key documents:

- `01-product-brief.md` — What this product is and is not.
- `02-scope-and-non-goals.md` — What we explicitly refuse to build.
- `03-architecture.md` — System boundaries and layering.
- `04-domain-model.md` — Core entities and invariants.
- `05-database-and-migrations.md` — Schema ownership and migration policy.
- `07-coding-standards.md` — TypeScript and design rules.
- `11-ai-ide-operating-manual.md` — Required workflow for AI development.

No feature may be implemented without aligning with these documents.

---

## 3. Core Development Principles

- One schema owner at a time.
- Domain logic must not depend on infrastructure.
- Derived state must be recomputable from source events.
- Small diffs only.
- No drive-by refactors.
- No speculative abstractions.

---

## 4. How Work Happens in This Repo

Every change must follow this structure:

1. Read relevant docs.
2. Produce a written plan.
3. Make the smallest valid change.
4. Add or update tests.
5. Verify invariants are preserved.

This repository is not optimized for speed of typing.
It is optimized for correctness and long-term clarity.

---

## 5. Stability and Schema Ownership

Until official cutover, this app does NOT own the database schema.

It may:
- Read data
- Insert data
- Update compatible fields

It may NOT:
- Run migrations
- Drop tables
- Rename columns
- Break compatibility with the current schema owner

Schema ownership transfer is defined in `05-database-and-migrations.md`.

---

## 6. Philosophy

Boring code is good.
Clear boundaries are good.
Explicit invariants are good.
Recomputable state is good.

Cleverness without necessity is a bug.
