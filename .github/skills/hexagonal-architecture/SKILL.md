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
- Anything backend-related (see mockit-api/AGENTS.md)

---

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

### Domain: Pure Interfaces & Entities

```typescript
// ✅ domain/entities/user.entity.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

// ✅ domain/interfaces/use-cases/create-user.ts (PORT)
export interface ICreateUserUseCase {
  execute(input: { email: string; name: string }): Promise<User>;
}

// ✅ domain/interfaces/repositories/user.repository.ts (PORT)
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
}

// ❌ NEVER: Import Express, Zod, or concrete classes
// ❌ NEVER: Framework decorators (@Controller, @Injectable)
```

### Application: Pure Use Case Logic

```typescript
// ✅ application/use-cases/create-user.use-case.ts (INTERACTOR)
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/repositories/user.repository";

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: { email: string; name: string }): Promise<User> {
    // 1. Validate business rules
    const existingUser = await this.userRepository.findById(input.email);
    if (existingUser) throw new Error("User already exists");

    // 2. Create domain entity
    const user: User = {
      id: generateId(),
      email: input.email,
      name: input.name,
      createdAt: new Date(),
    };

    // 3. Persist via repository interface (abstracted)
    await this.userRepository.save(user);

    return user;
  }
}

// ❌ NEVER: Import Express, controllers, or concrete DB classes
// ❌ NEVER: Return DTO directly (map in infrastructure layer)
```

### Infrastructure: Express Controller (ADAPTER)

```typescript
// ✅ infrastructure/controllers/user.controller.ts
import express from "express";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { CreateUserInputSchema } from "../../application/dtos/create-user.input";
import { UserMapper } from "../../application/mappers/user.mapper";

export class UserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async create(req: express.Request, res: express.Response) {
    try {
      // 1. Validate input at HTTP boundary (Zod)
      const input = CreateUserInputSchema.parse(req.body);

      // 2. Call pure use-case
      const user = await this.createUserUseCase.execute(input);

      // 3. Map to DTO for response
      const dto = UserMapper.toDTO(user);

      res.status(201).json(dto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// ✅ infrastructure/repositories/user.repository.ts (ADAPTER)
import { User } from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/interfaces/repositories/user.repository";

export class UserRepository implements IUserRepository {
  // Connect to real database (PostgreSQL, MongoDB, etc.)
  async findById(id: string): Promise<User | null> {
    // SELECT * FROM users WHERE id = id
    return database.query("SELECT * FROM users WHERE id = ?", [id]);
  }

  async save(user: User): Promise<void> {
    // INSERT INTO users (...)
    await database.query("INSERT INTO users (...) VALUES (...)", [user]);
  }
}
```

### Dependency Injection (Wire at Root)

```typescript
// ✅ infrastructure/api/server.ts
import express from "express";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserUseCase } from "../../application/use-cases/create-user.use-case";
import { UserController } from "../controllers/user.controller";

const app = express();

// 1. Create repository (implements IUserRepository)
const userRepository = new UserRepository();

// 2. Inject into use-case
const createUserUseCase = new CreateUserUseCase(userRepository);

// 3. Inject use-case into controller
const userController = new UserController(createUserUseCase);

// 4. Wire to route
app.post("/users", (req, res) => userController.create(req, res));

export function startServer(port: number) {
  app.listen(port, () => console.log(`Server on port ${port}`));
}
```

### DTO & Mapper (Data Transformation)

```typescript
// ✅ application/dtos/create-user.input.ts
import { z } from "zod";

export const CreateUserInputSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name required"),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

// ✅ application/mappers/user.mapper.ts
import { User } from "../../domain/entities/user.entity";

export class UserMapper {
  // Domain → DTO (for HTTP response)
  static toDTO(user: User) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.name,
    };
  }

  // Raw DB row → Domain (for persistence)
  static toDomain(raw: any): User {
    return {
      id: raw.id,
      email: raw.email,
      name: raw.name,
      createdAt: raw.created_at,
    };
  }
}
```

---

## Benefits

| Benefit         | How                                                         | Example                                              |
| --------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| **Testability** | Domain logic doesn't need Express/DB mocks                  | `new CreateUserUseCase(mockRepository).execute(...)` |
| **Flexibility** | Swap DB from PostgreSQL → MongoDB without changing use-case | Implement `IUserRepository` for MongoDB              |
| **Reusability** | One use-case for HTTP + CLI + GraphQL                       | Same `CreateUserUseCase`, different adapters         |
| **Clarity**     | Each layer has one responsibility                           | Domain = rules, Infrastructure = Express             |

---

## Commands

```bash
# Scaffold new entity
mkdir -p src/domain/entities
# Then: domain/entities/{entity}.entity.ts + interfaces/repositories/{entity}.repository.ts

# Scaffold new use-case
mkdir -p src/application/use-cases
# Then: application/use-cases/{action}-{entity}.use-case.ts

# Scaffold controller & repository
mkdir -p src/infrastructure/controllers src/infrastructure/repositories
# Then: infrastructure/controllers/{entity}.controller.ts + repositories/{entity}.repository.ts
```

---

## Anti-Patterns (NEVER)

```typescript
// ❌ Importing infrastructure into domain
import express from "express";  // NO!
import { database } from "./db"; // NO!

// ❌ Database entities = domain entities
interface User extends TypeORM.Entity { }  // NO! Use your own interface

// ❌ Mixing HTTP concerns in use-cases
function execute(req: express.Request, res: express.Response) { }  // NO!

// ❌ No interfaces (tight coupling)
constructor(userRepository: UserRepository) { }  // NO! Use IUserRepository

// ❌ Validation in domain
if (!email.includes("@")) throw new Error();  // Put in DTO + Zod instead
```

---

## Resources

- **Project**: [mockit-api/AGENTS.md](../../../mockit-api/AGENTS.md) - Full backend rules
- **Reference**: Ports & Adapters by Alastair Cockburn
- **Validation**: See skill: `zod-4` for input validation
