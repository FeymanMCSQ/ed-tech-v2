# Observability

If something breaks, we must know:

- What happened
- When it happened
- Who it affected
- Why it failed

Observability must be intentional.

---

## 1. Structured Logging

All logs must be structured JSON.

Example shape:

{
  "level": "info",
  "timestamp": "...",
  "service": "learning-engine",
  "requestId": "...",
  "userId": "... optional",
  "event": "ATTEMPT_CREATED",
  "context": { ... }
}

Never log free-form text only.

---

## 2. Log Levels

Allowed levels:

- debug
- info
- warn
- error

Rules:

- debug → development only
- info → important state changes
- warn → unexpected but recoverable
- error → failures requiring attention

Do not overuse error level.

---

## 3. Correlation / Request ID

Every request must:

- Have a unique requestId
- Propagate that ID through logs
- Include it in error logs

If background jobs exist:
- Generate correlation ID and propagate.

This enables tracing a single request across layers.

---

## 4. Error Classification

Errors must be categorized:

- VALIDATION_ERROR
- AUTH_ERROR
- NOT_FOUND
- CONFLICT
- DOMAIN_INVARIANT_VIOLATION
- INTERNAL_ERROR

Classification must occur before returning response.

Raw stack traces must never be returned to clients.

---

## 5. Critical Events to Log

Must log:

- Attempt creation
- Skill rating update
- Authentication failures
- Authorization failures
- Migration execution (after cutover)

Must not log:

- Entire request bodies
- Secrets
- Sensitive payloads

---

## 6. Observability Principle

Logs must answer:

- What changed?
- What failed?
- Which invariant was violated?

If logs cannot answer these, observability is insufficient.
