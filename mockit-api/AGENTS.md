---
name: mockit-api-backend
description: >
  Backend agent for mockit-api.
  Rules for Node.js + Express + Hexagonal Architecture.
version: "1.0"
---

## Required Skills

| Skill | Details | File |
|-------|---------|------|
| Hexagonal Architecture | Ports & Adapters, layer separation | [.github/skills/hexagonal-architecture/SKILL.md](../../.github/skills/hexagonal-architecture/SKILL.md) |
| TypeScript | Strict modes, interfaces, type guards | [.github/skills/typescript/SKILL.md](../../.github/skills/typescript/SKILL.md) |
| Zod 4 | Input validation, schema inference | [.github/skills/zod-4/SKILL.md](../../.github/skills/zod-4/SKILL.md) |

---

## Architecture Layers

**Domain** (business logic, framework-agnostic)

- Entities: Pure data structures, no framework imports
- Interfaces (Ports): `IUserRepository`, `ICreateUserUseCase`

**Application** (orchestration)

- Use-cases: Pure business logic, dependency injection
- DTOs: Input/output contracts with Zod validation
- Mappers: Domain ↔ DTO transformations

**Infrastructure** (framework-specific)

- Controllers: HTTP handlers, inject use-cases
- Repositories: Implement domain interfaces, real DB access
- Routes: Wire controllers to Express

---

## Core Rules

**DO:**

- Keep domain separate from Express code
- Inject via interfaces (not concrete classes in domain)
- Validate at boundary (DTOs with Zod)
- Map between DTOs ↔ domain entities
- Test domain in isolation (no mocks needed)

**DON'T:**

- Import Express in domain or application
- Return database models to clients
- Use `any` types; use generics and type guards
- Mix concerns (validation in controller, not domain)
- Leak database details into domain layer

---

## File Naming

- Entities: `{domain}.entity.ts` (user.entity.ts)
- Interfaces: `{domain}.{type}.ts` (user.repository.ts)
- Use-cases: `{action}-{domain}.use-case.ts` (create-user.use-case.ts)
- DTOs: `{action}-{domain}.input.ts` (create-user.input.ts)
- Mappers: `{domain}.mapper.ts` (user.mapper.ts)
- Controllers: `{domain}.controller.ts` (user.controller.ts)
- Routes: `{domain}.routes.ts` (user.routes.ts)

---

## Build & Run

- **Dev**: `tsx watch app.ts` (hot-reload)
- **Build**: `tsc` (outputs to dist/)
- **Prod**: `node dist/app.js`
- **Config**: ESM module + `rootDir: .` in tsconfig.json
