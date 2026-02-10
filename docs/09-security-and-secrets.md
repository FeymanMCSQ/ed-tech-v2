# Security and Secrets

Security mistakes compound silently.
This document defines non-negotiable rules.

---

## 1. Environment Variables

Secrets must:

- Live only in environment variables.
- Never be hardcoded.
- Never be committed to version control.
- Never appear in test fixtures.
- Never appear in logs.

Files:

- `.env` must be in `.gitignore`.
- `.env.example` may exist but must contain placeholders only.

Example:

DATABASE_URL="__SET_IN_ENV__"

---

## 2. Secret Handling Rules

Secrets include:

- Database credentials
- API keys
- Access tokens
- JWT signing keys
- Session secrets

Never:

- Log secrets
- Return secrets in API responses
- Expose secrets to client-side code

Server-only secrets must remain server-only.

---

## 3. Logging Restrictions

The following must NEVER appear in logs:

- Access tokens
- Refresh tokens
- Passwords
- Full email addresses
- Raw authentication headers
- Raw database connection strings

If logging user identifiers:

- Log internal userId only
- Do not log PII fields

---

## 4. Authentication Rules

Authentication must:

- Be validated at API layer
- Reject missing or invalid tokens immediately
- Not be optional for protected routes

Domain logic must not:

- Inspect JWT directly
- Parse session cookies
- Rely on global auth state

Domain receives `userId` explicitly.

---

## 5. Authorization Rules

Authorization must:

- Ensure users access only their own data
- Validate ownership before reading or mutating resources
- Return 403 for forbidden access

Never trust client-provided userId.

Always derive identity from validated auth context.

---

## 6. Input Validation

All external input must be validated.

Rules:

- Use schema validation (e.g., zod) at API boundary.
- Reject unknown fields.
- Enforce length limits.
- Enforce numeric bounds.
- Sanitize strings where applicable.

Never pass raw request body directly into domain logic.

---

## 7. Rate Limiting Basics

Rate limiting must be applied to:

- Authentication endpoints
- Attempt submission endpoint
- Any endpoint vulnerable to abuse

Basic expectations:

- Protect against brute-force attempts
- Protect against spamming attempts endpoint
- Protect against enumeration attacks

Rate limiting must not rely on client trust.

---

## 8. Database Safety

Never:

- Construct raw SQL from untrusted input
- Disable foreign key constraints
- Allow mass updates without filters

All DB access must go through controlled repository layer.

---

## 9. Production Safety Principle

Security is default.

If unsure whether something is safe:
- Default to rejecting the request.
- Default to hiding the field.
- Default to logging less, not more.
