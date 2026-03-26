---
name: mockit-orchestrator
description: >
  Root orchestrator for the full-stack Mockit project.
  Delegates to backend (mockit-api) and frontend (mockit-app) agents.
version: "1.0"
---

## Agents

| Agent | Purpose | File |
|-------|---------|------|
| Backend | Node.js + Express + Hexagonal | [mockit-api/AGENTS.md](mockit-api/AGENTS.md) |
| Frontend | React 19 + Vite + Tailwind | [mockit-app/AGENTS.md](mockit-app/AGENTS.md) |

---

## Global Rules

**Language & Format**

- Always English in code, comments, variable names
- Max 250 lines per AGENTS.md or skill file
- Never modify existing skills or production code without explicit request

**TypeScript Standards

### Language & Format

- **Primary Language**: Always English in code, comments, variable names
- **Line Limit**: Max 250 lines per file (unless inherently complex)
- **No Edits**: Never modify existing skills or production code without explicit request

### TypeScript Standards

- Always use `strict: true` in tsconfig
- Prefer `const` types pattern over string unions
- Use type guards for runtime validation (see typescript skill)
- Export interfaces, not implementations (DI)

### Quality Gates

- All commits must pass type checking (`tsc --noEmit`)
- Use ESM (import/export) consistently
- No `any` types; use `unknown` or generics

---

## When to Delegate

| Scenario | Agent | Decision |
|----------|-------|----------|
| Building API endpoint, service, use-case | **Backend** (mockit-api/AGENTS.md) | Backend layer logic |
| React component, state, styling | **Frontend** (mockit-app/AGENTS.md) | Frontend layer logic |
| Cross-project decision (architecture, structure) | **Orchestrator** (this file) | General rules |
| New domain entity or business rule | **Backend** | Hexagonal architecture |
| UI/UX, accessibility, interactions | **Frontend** | React 19 + Tailwind |

---

## Backend Skills

Backend uses **Hexagonal Architecture** (Ports & Adapters):

- **Domain Layer**: Business logic, entities, interfaces (no framework coupling)
- **Application Layer**: Use cases, DTOs, mappers (orchestration)
- **Infrastructure Layer**: Express controllers, repositories, API server (framework-specific)

See [mockit-api/AGENTS.md](mockit-api/AGENTS.md) and skill: `hexagonal-architecture`

---

## Frontend Skills

Frontend uses **React 19** with **Compiler** optimization:

- No useMemo/useCallback (Compiler handles it)
- Atomic component design (small, reusable)
- TailwindCSS 4 for styling (no var() in className)
- Client-side state with React hooks

See [mockit-app/AGENTS.md](mockit-app/AGENTS.md) and skill: `react-19`

---

## Shared Skills

All agents can use:

- **typescript** - Strict patterns, generics, type guards
- **zod-4** - Schema validation (breaking changes from v3)

---

## Implementation Order

```
1. Define domain entities and interfaces (Backend)
   └─ No framework code yet
2. Create use cases (Backend)
   └─ Pure business logic
3. Build infrastructure layer (Backend)
   └─ Controllers, repositories
4. Expose API endpoints (Backend)
5. Build React components (Frontend)
   └─ Fetch from API
6. Connect state management (Frontend)
```

---

## Output Guidelines

- **Backend**: Always validate with Zod; export types for frontend consumption
- **Frontend**: Always type props; use Tailwind for styling
- **Shared**: Generated types at runtime must match TypeScript compile-time types

---

## New Skill Checklist

Before creating a skill:

- Is it repeated across contexts? ✓ Create skill
- Is it project-specific? ✓ Document in AGENTS.md
- Does it conflict with existing? ✗ Update existing skill instead
