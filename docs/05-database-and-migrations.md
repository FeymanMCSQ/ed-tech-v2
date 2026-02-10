# Database and Migration Policy

This document defines schema ownership and migration rules.

Violations of this policy risk data corruption.

---

## 1. Schema Ownership (Rewrite Phase)

During rewrite:

- The legacy application remains the schema owner.
- This application operates in client mode.
- This application MUST NOT run Prisma migrations against the shared production database.

Allowed:
- Read data
- Insert compatible records
- Update compatible fields

Not allowed:
- Drop tables
- Rename columns
- Remove constraints
- Run `prisma migrate dev`
- Run `prisma migrate reset`

---

## 2. Cutover Plan (Ownership Transfer)

When this application becomes the schema owner:

1. Freeze schema changes from legacy app.
2. Run `prisma db pull` to ensure schema matches reality.
3. Create a baseline migration representing current schema.
4. Mark baseline as applied.
5. From that point onward, this repository owns all schema evolution.

After cutover:
- All schema changes must go through migrations in this repo.

---

## 3. Expand / Contract Rule

When both applications coexist:

1. Expand:
   - Add new columns/tables
   - Do not remove old ones
   - Maintain backward compatibility

2. Migrate Data:
   - Backfill or dual-write if necessary

3. Switch Usage:
   - Ensure new app no longer depends on legacy columns

4. Contract:
   - Remove legacy fields only after safe cutoff

Never break compatibility while both apps run.

---

## 4. Absolute Prohibitions

Never:
- Use `prisma migrate reset` on shared DB
- Manually alter production schema without migration
- Run migrations from two different repos simultaneously

Only one schema owner at a time.

---

## 5. Indexing Guidelines

Indexes must be added when:

- A column is used frequently in WHERE clauses
- A foreign key is queried often
- Sorting by a column is common
- Aggregations rely on a column

Typical required indexes:

- attempts(userId)
- attempts(problemId)
- attempts(createdAt)
- skillState(userId, archetypeId) unique composite index
- problem(archetypeId)

Indexes must be declared explicitly in Prisma schema.

---

## 6. Naming Conventions

Tables:
- Singular nouns (User, Archetype, Problem, Attempt, SkillState)

Columns:
- camelCase in Prisma
- snake_case at database level (if required by provider)

Foreign keys:
- {entityName}Id

Timestamps:
- createdAt
- updatedAt

IDs:
- UUID preferred
- Never sequential integers in public APIs

---

## 7. Schema Stability Principle

Schema changes are architectural events.

They require:
- Justification
- Backward compatibility plan
- Migration plan
- Rollback consideration

Schema is not a playground.
