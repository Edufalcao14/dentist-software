# Architecture Overview

This document provides a comprehensive overview of the project's architecture, explaining how different components interact and work together.

## Table of Contents

1. [Architecture Pattern](#architecture-pattern)
2. [Layered Architecture](#layered-architecture)
3. [Component Overview](#component-overview)
4. [Data Flow](#data-flow)
5. [Key Principles](#key-principles)

## Architecture Pattern

This project follows a **Clean Architecture** approach with clear separation of concerns and dependency inversion. The architecture is organized in layers, where each layer has a specific responsibility and dependencies flow inward.

## Layered Architecture

The application is structured in the following layers (from outer to inner):

```
┌─────────────────────────────────────────────────────────┐
│                    GraphQL Layer                         │
│  (Resolvers, Schema, Type Definitions)                  │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                   Use Cases Layer                       │
│  (Business Logic, Validation, Orchestration)            │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│                 Repository Layer                        │
│  (Data Access, Database Operations, Mapping)            │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Database / External Services               │
│  (Prisma, Firebase, etc.)                              │
└─────────────────────────────────────────────────────────┘
```

## Component Overview

### 1. **GraphQL Layer** (`src/graphql/`)
- **Purpose**: Entry point for all API requests
- **Responsibilities**:
  - Define GraphQL schema and types
  - Handle GraphQL queries and mutations
  - Transform GraphQL inputs to domain entities
  - Handle errors and format responses
- **Key Files**:
  - `schema.graphql`: GraphQL type definitions
  - `resolvers/`: Query, mutation, and type resolvers
  - `errors/`: Error formatting and logging

### 2. **Entities** (`src/entities/`)
- **Purpose**: Domain models and business rules
- **Responsibilities**:
  - Define domain entities (types/interfaces)
  - Define input types for operations
  - Define enums and value objects
  - Define custom error types
- **Key Characteristics**:
  - Pure TypeScript types/interfaces
  - No dependencies on external libraries
  - Business logic validation rules

### 3. **Use Cases** (`src/usecases/`)
- **Purpose**: Business logic and orchestration
- **Responsibilities**:
  - Implement business rules
  - Validate inputs using schemas (e.g., Yup)
  - Orchestrate operations across repositories and gateways
  - Handle business errors
- **Key Characteristics**:
  - Receive `AppContext` for dependencies
  - Return domain entities
  - Pure business logic, no infrastructure concerns

### 4. **Repositories** (`src/repositories/`)
- **Purpose**: Data access abstraction
- **Responsibilities**:
  - Abstract database operations
  - Map between database models and domain entities
  - Handle data persistence
  - Provide type-safe data access
- **Key Characteristics**:
  - Database-agnostic interface
  - Mappers for entity conversion
  - Initialized with database client (Prisma)

### 5. **Gateways** (`src/gateways/`)
- **Purpose**: External service integration
- **Responsibilities**:
  - Integrate with external APIs (e.g., Firebase IAM)
  - Abstract external service details
  - Handle external service errors
- **Key Characteristics**:
  - Service-agnostic interface
  - Error translation to domain errors

### 6. **Context** (`src/libs/context.ts`)
- **Purpose**: Dependency injection container
- **Responsibilities**:
  - Provide application-wide dependencies
  - Manage authentication context
  - Provide configuration and logger
- **Key Components**:
  - `AppContext`: Contains repositories, gateways, config, logger, auth
  - `AuthContext`: Authentication state and user information

## Data Flow

### Request Flow (Example: Create Dentist)

```
1. GraphQL Request
   └─> Mutation: createDentist(input: CreateDentistInput!)

2. GraphQL Resolver (dentist-mutation.ts)
   └─> Transforms GraphQL input to entity input
   └─> Calls usecase.dentist.create(context, input)

3. Use Case (create-dentist.logic.ts)
   └─> Validates input (Yup schema)
   └─> Calls gateway.iam.createUser() for authentication
   └─> Calls repository.dentist.create() for persistence
   └─> Returns DentistEntity

4. Repository (create-dentist.ts)
   └─> Maps entity data to Prisma format
   └─> Executes database operation
   └─> Maps Prisma result back to entity
   └─> Returns DentistEntity

5. Response
   └─> Entity flows back through layers
   └─> GraphQL resolver returns to client
```

### Response Flow

The response flows back through the same layers in reverse:
- Repository returns entity
- Use case returns entity
- GraphQL resolver returns entity (mapped to GraphQL type)

## Key Principles

### 1. **Dependency Inversion**
- Inner layers (entities, use cases) don't depend on outer layers
- Dependencies are injected via `AppContext`
- Interfaces are defined in inner layers

### 2. **Separation of Concerns**
- Each layer has a single, well-defined responsibility
- Business logic is isolated from infrastructure
- Data access is abstracted from business logic

### 3. **Type Safety**
- Full TypeScript type coverage
- GraphQL types generated from schema
- Type-safe entity mappings

### 4. **Error Handling**
- Custom error types in entities layer
- Errors flow up through layers
- GraphQL error formatter handles presentation

### 5. **Testability**
- Pure functions in use cases
- Mockable dependencies via context
- Isolated business logic

## Directory Structure

```
src/
├── entities/          # Domain models and types
│   └── [domain]/      # Domain-specific entities
├── usecases/          # Business logic
│   └── [domain]/      # Domain-specific use cases
├── repositories/      # Data access
│   └── database/      # Database repositories
│       └── [domain]/  # Domain-specific repositories
├── gateways/          # External service integrations
├── graphql/           # GraphQL layer
│   ├── resolvers/     # GraphQL resolvers
│   └── schema.graphql # GraphQL schema
├── libs/              # Shared utilities
│   ├── context.ts     # App context and DI
│   └── config.ts      # Configuration
└── controller/        # REST endpoints (if needed)
```

## Adding a New Domain

When adding a new domain (e.g., `Patient`, `Appointment`), follow this structure:

1. **Entities**: Define domain types in `src/entities/[domain]/`
2. **GraphQL Schema**: Add types to `src/graphql/schema.graphql`
3. **Repositories**: Implement data access in `src/repositories/database/[domain]/`
4. **Use Cases**: Implement business logic in `src/usecases/[domain]/`
5. **Resolvers**: Create GraphQL resolvers in `src/graphql/resolvers/[domain]/`

See individual component documentation for detailed guidelines:
- [Entities Guide](./entities.md)
- [Repositories Guide](./repositories.md)
- [Use Cases Guide](./usecases.md)
- [GraphQL Guide](./graphql.md)
- [Context Guide](./context.md)
- [Gateways Guide](./gateways.md)

