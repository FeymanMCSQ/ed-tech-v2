# API Contracts

This document defines the external interface of the system.

All endpoints must conform to these conventions.
No ad-hoc shapes are allowed.

---

## 1. API Style

The system uses RESTful JSON endpoints.

All endpoints:

- Accept JSON
- Return JSON
- Use HTTP status codes correctly
- Do not return raw database models directly

---

## 2. Standard Response Shape

### Success Response

All successful responses follow this shape:

{
  "success": true,
  "data": { ... }
}

The "data" field must contain the actual payload.
No top-level mixing of metadata and data.

---

### Error Response

All errors follow this shape:

{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... optional }
  }
}

Rules:

- error.code must be stable and machine-readable.
- error.message must be safe to display to users.
- Never leak stack traces or raw database errors.
- Validation errors must include field-level details.

---

## 3. Status Code Conventions

200 — Success  
201 — Resource created  
400 — Validation error  
401 — Unauthorized  
403 — Forbidden  
404 — Not found  
409 — Conflict  
500 — Internal server error  

Never return 200 for failures.

---

## 4. Pagination Conventions

Endpoints returning lists must support:

Query parameters:

- limit (default 20, max 100)
- cursor (optional, for cursor-based pagination)

Response shape:

{
  "success": true,
  "data": {
    "items": [ ... ],
    "nextCursor": "optional"
  }
}

Offset-based pagination is discouraged.
Cursor-based pagination is preferred.

---

## 5. Filtering Conventions

Filters must:

- Be explicit query parameters
- Not accept arbitrary dynamic field names
- Be documented per endpoint

Example:

GET /attempts?archetypeId=...&limit=20

No dynamic query building from client-provided column names.

---

## 6. Authentication Conventions

Authentication must:

- Be validated at API layer
- Inject user identity into request context
- Not be re-validated in domain layer

Domain functions accept userId explicitly.

Never:
- Read session directly inside domain
- Infer user from global state

---

## 7. Versioning Policy

Breaking API changes require:

- Version prefix (e.g., /v2/)
OR
- Backward-compatible contract evolution

Never silently change response shape.

---

## 8. DTO vs Domain Separation

API DTOs (Data Transfer Objects) are not domain objects.

Mapping must occur between:

API input → validated DTO → domain type  
Domain result → response DTO  

Domain must not depend on API shapes.
