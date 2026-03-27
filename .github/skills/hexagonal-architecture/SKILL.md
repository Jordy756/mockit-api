---
name: hexagonal-architecture
description: >
  Hexagonal Architecture (Ports & Adapters) for Node.js backends.
  Trigger: When building API services, use-cases, repositories, or domain entities in mockit-api.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- Creating a new domain entity or business rule
- Building a use-case or application service
- Implementing a repository or data access layer
- Structuring controllers and routes
- Anything backend-related in mockit-api (see mockit-api/AGENTS.md)

## Critical Patterns

### Layer Separation

```
Domain (Business Logic - Framework Agnostic)
  ↓
Application (Orchestration - Use Cases, DTOs)
  ↓
Infrastructure (Framework-Specific - Express, DB, HTTP)
```

**Rule**: Domain ≠ Express ≠ Database

- Domain: interfaces, entities (no imports from infrastructure)
- Application: use-cases, mappers (orchestrates domain + infrastructure)
- Infrastructure: controllers, repositories, Express routes

### Use-Case Organization by Entity (Project Convention)

In this project, use-cases are grouped by entity, not split by HTTP method.

- ✅ Preferred: one class per entity (example: MockUseCase) with multiple operations
- ✅ Example methods in one class: register, list, create, update, remove
- ❌ Avoid creating one use-case class per HTTP verb when all methods belong to the same aggregate

This keeps business logic for one entity together and matches current code in mockit-api.

### Domain: Pure Interfaces & Entities

```typescript
// ✅ src/domain/entities/Mock.ts
export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | { [key: string]: JsonValue } | JsonValue[];

export class Mock {
  public readonly id: string;
  public readonly payload: JsonValue;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ src/domain/interfaces/use-cases/IMockUseCase.ts (PORT)
export interface IMockUseCase {
  register(payload: JsonValue): Promise<Mock>;
  list(): Promise<Mock[]>;
}

// ✅ src/domain/interfaces/repositories/IMockRepository.ts (PORT)
export interface IMockRepository {
  register(mock: Mock): Promise<Mock>;
  list(): Promise<Mock[]>;
}

// ❌ NEVER: Import Express, Zod, or concrete classes
// ❌ NEVER: Framework decorators (@Controller, @Injectable)
```

### Application: Pure Use Case Logic

```typescript
// ✅ src/application/use-cases/MockUseCase.ts (INTERACTOR)
import { Mock } from "../../domain/entities/Mock.js";
import type { JsonValue } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockUseCase implements IMockUseCase {
  constructor(private readonly mockRepository: IMockRepository) {}

  public async register(payload: JsonValue): Promise<Mock> {
    const newMock = new Mock(payload);
    return this.mockRepository.register(newMock);
  }

  public async list(): Promise<Mock[]> {
    return this.mockRepository.list();
  }
}

// ❌ NEVER: Import Express, controllers, or concrete DB classes
// ❌ NEVER: Return DTO directly (map in infrastructure layer)
```

### Infrastructure: Express Controller (ADAPTER)

```typescript
// ✅ src/infrastructure/controllers/MockController.ts
import type { Request, Response } from "express";
import { ZodError } from "zod";
import { MockMapper } from "../../application/mappers/MockMapper.js";
import { registerMockInputSchema } from "../../application/dtos/MockDTO.js";
import type { IMockUseCase } from "../../domain/interfaces/use-cases/IMockUseCase.js";

export class MockController {
  constructor(private readonly mockUseCase: IMockUseCase) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const input = registerMockInputSchema.parse(req.body);
      const payload = MockMapper.toPayload(input);
      const mock = await this.mockUseCase.register(payload);
      res.status(201).json(MockMapper.toMockDTO(mock));
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid payload", errors: error.issues });
        return;
      }

      res.status(500).json({ message: "Unexpected error while registering mock" });
    }
  };
}

// ✅ src/infrastructure/repositories/MockRepository.ts (ADAPTER)
import { Mock } from "../../domain/entities/Mock.js";
import type { IMockRepository } from "../../domain/interfaces/repositories/IMockRepository.js";
import type { SqliteClient } from "./sqlite/sqlite.client.js";

export class MockRepository implements IMockRepository {
  constructor(private readonly sqliteClient: SqliteClient) {}

  public async register(mock: Mock): Promise<Mock> {
    // Persist with sqlite client and map row -> domain
    return mock;
  }

  public async list(): Promise<Mock[]> {
    return [];
  }
}
```

### Dependency Injection (Wire at Root)

```typescript
// ✅ src/infrastructure/api/server.ts
const sqliteClient = new SqliteClient();
const mockRepository = new MockRepository(sqliteClient);
const mockUseCase = new MockUseCase(mockRepository);
const mockController = new MockController(mockUseCase);

this.app.use("/api/mocks", createMockRoutes(mockController));
```

### DTO & Mapper (Data Transformation)

```typescript
// ✅ src/application/dtos/MockDTO.ts
import { z } from "zod";
import type { JsonValue } from "../../domain/entities/Mock.js";

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const registerMockInputSchema = jsonValueSchema;

// ✅ src/application/mappers/MockMapper.ts
import type { Mock } from "../../domain/entities/Mock.js";

export class MockMapper {
  public static toMockDTO({ id, payload, createdAt, updatedAt }: Mock) {
    return {
      id,
      payload,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    };
  }
}
```

---

## Benefits

| Benefit         | How                                         | Example                                         |
| --------------- | ------------------------------------------- | ----------------------------------------------- |
| **Testability** | Domain logic doesn't need Express/DB mocks  | `new MockUseCase(mockRepository).list()`        |
| **Flexibility** | Swap DB adapter without changing use-case   | Implement `IMockRepository` for another DB      |
| **Reusability** | One use-case per entity for many operations | Same `MockUseCase` handles register/list/update |
| **Clarity**     | Each layer has one responsibility           | Domain = rules, Infrastructure = Express        |

---

## Commands

```bash
# Scaffold new entity
mkdir -p src/domain/entities src/domain/interfaces/repositories src/domain/interfaces/use-cases
# Then: {Entity}.ts + I{Entity}Repository.ts + I{Entity}UseCase.ts

# Scaffold new use-case
mkdir -p src/application/use-cases
# Then: {Entity}UseCase.ts (group methods by entity: create/list/update/delete)

# Scaffold controller & repository
mkdir -p src/infrastructure/controllers src/infrastructure/repositories
# Then: {Entity}Controller.ts + {Entity}Repository.ts + routes/{Entity}Routes.ts
```

---

## Anti-Patterns (NEVER)

```typescript
// ❌ Importing infrastructure into domain
import express from "express";  // NO!
import { database } from "./db"; // NO!

// ❌ One use-case class per HTTP method (project convention)
class CreateMockUseCase {} // NO: prefer one MockUseCase per entity

// ❌ Mixing HTTP concerns in use-cases
function execute(req: express.Request, res: express.Response) { }  // NO!

// ❌ No interfaces (tight coupling)
constructor(mockRepository: MockRepository) { }  // NO! Use IMockRepository

// ❌ Validation in domain
if (typeof payload !== "object") throw new Error();  // Put in DTO + Zod instead
```

---

## Resources

- **Project**: [mockit-api/AGENTS.md](../../../mockit-api/AGENTS.md) - Full backend rules
- **Reference**: Ports & Adapters by Alastair Cockburn
- **Validation**: See skill: `zod-4` for input validation
