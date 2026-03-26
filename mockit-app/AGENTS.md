---
name: mockit-app-frontend
description: >
  Frontend agent for mockit-app.
  Rules for React 19 + Vite + Tailwind + TypeScript.
version: "1.0"
---

## Required Skills

| Skill | Details | File |
|-------|---------|------|
| React 19 | Compiler patterns, no manual memoization | [.github/skills/react-19/SKILL.md](../../.github/skills/react-19/SKILL.md) |
| Tailwind 4 | Theme variables, responsive, cn() utility | [.github/skills/tailwind-4/SKILL.md](../../.github/skills/tailwind-4/SKILL.md) |
| TypeScript | Props typing, interfaces, generics | [.github/skills/typescript/SKILL.md](../../.github/skills/typescript/SKILL.md) |

---

## Architecture

**Components**: Atomic, small, reusable. Always type props.

- `components/Button.tsx` → Primitives
- `components/Form.tsx` → Composed from primitives

**Hooks**: Custom React hooks for state & side effects

- `hooks/useUserForm.ts`
- `hooks/useFetch.ts`

**Pages**: Route-level components that fetch data

- `pages/UserCreate.tsx`
- `pages/UserList.tsx`

**API**: Typed fetch wrapper at module level

- `api/user.ts` → `fetchUser(id)`, `createUser(input)`

**Types & Utils**: Shared types, helpers

- `types/user.d.ts`
- `utils/cn.ts` → conditional className utility

---

## Core Rules

**React 19**

- No useMemo/useCallback (React Compiler handles it)
- Simple components with clear responsibilities
- Always type props with interface

**Tailwind**

- Use CSS variables in `index.css`, reference in Tailwind
- Mobile-first (sm/md/lg/xl prefixes)
- Never use `var()` in className
- Use `cn()` for conditional classes

**State**

- `useState` for local state
- `useEffect` for side effects (fetch at top level)
- Context for deeply nested state (auth, theme)

**API**

- Fetch at page/hook level; pass data to components
- Always type response: `async function fetchUser(id: string): Promise<User>`
- Never fetch inside component render

---

## Build & Run

- **Dev**: `pnpm dev` (HMR enabled)
- **Build**: `pnpm build` (type-checks via tsconfig)
- **Preview**: `pnpm preview`
- **ESM**: import/export only
