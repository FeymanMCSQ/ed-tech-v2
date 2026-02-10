# Architecture

This document defines the structural shape of the system.
Architecture rules are non-negotiable.

---

## 1. Layered Structure

The system is divided into four primary modules:

- UI
- API
- Domain
- Data

Each module has a specific responsibility.

---

## 2. Module Responsibilities

### UI

Responsible for:
- Rendering components
- Managing local UI state
- Calling API endpoints

UI must not:
- Contain business rules
- Directly access the database
- Compute skill ratings

UI depends only on API contracts.

---

### API

Responsible for:
- Validating external input
- Authentication/authorization
- Translating HTTP requests into domain calls
- Formatting responses

API must not:
- Contain rating algorithms
- Contain core domain decisions
- Directly manipulate database models beyond repository layer

API depends on Domain.

---

### Domain

Responsible for:
- Core business logic
- Rating updates
- Problem selection logic
- Invariant enforcement

Domain must:
- Be deterministic
- Be testable without database or framework
- Avoid framework imports

Domain must not:
- Import Prisma
- Import request/response objects
- Read environment variables
- Log directly (use injected interfaces if needed)

Domain depends only on plain types and interfaces.

---

### Data

Responsible for:
- Database access (Prisma)
- Persistence logic
- Query construction
- Mapping DB models to domain types

Data must not:
- Contain business rules
- Compute rating logic
- Contain API validation logic

Data depends on Domain types.

---

## 3. Dependency Direction Rules

Allowed dependency direction:

UI → API → Domain → Data

Not allowed:

- Domain importing Data
- Domain importing API
- API importing UI
- Cross-layer circular dependencies

If a lower layer needs behavior from a higher layer, extract an interface and inject it.

---

## 4. Public Interfaces Only

Each module exposes a public interface.

Internal files must not be imported across module boundaries.

No deep imports such as:
`import {...} from "../../domain/internal/ratingAlgorithm"`

If it is not exported from the module's index file, it is private.

---

## 5. No Shared Utils Dumping Ground

There is no global `utils/` folder.

If functionality is:

- Domain-specific → belongs in Domain
- Persistence-related → belongs in Data
- UI helper → belongs in UI

Generic helpers are allowed only if:
- Truly generic
- Have no domain knowledge
- Are small and isolated

---

## 6. Deterministic Core Rule

Domain logic must be:

- Pure where possible
- Deterministic given the same inputs
- Testable without database access

If a function requires randomness or time:
- Inject it as a dependency.

---

## 7. Architectural Stability Principle

Architecture must remain understandable in one diagram.

If a feature introduces:
- Cross-module coupling
- Bidirectional dependencies
- Background worker complexity

It requires architectural justification before implementation.
