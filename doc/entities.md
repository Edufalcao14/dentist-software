# Entities Guide

This guide explains how to create and structure entities in the project.

## Overview

Entities represent the core domain models of the application. They are pure TypeScript types/interfaces that define the structure and constraints of domain objects. Entities have no dependencies on external libraries or infrastructure.

## Location

Entities are located in `src/entities/[domain]/` where `[domain]` is the domain name (e.g., `dentist`, `patient`, `appointment`).

## Structure

For each domain, create the following files:

```
src/entities/[domain]/
├── [domain].ts              # Main entity type
├── create-[domain]-input.ts # Input type for creation
├── [domain]-role.ts         # Enums (if applicable)
├── [domain]-specialization.ts # Enums (if applicable)
└── index.ts                 # Exports
```

## Example: Dentist Entity

### 1. Main Entity (`dentist.ts`)

```typescript
import { DentistRole } from './dentist-role';
import { DentistSpecialization } from './dentist-specialization';

export type DentistEntity = {
  id: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  cro_number: string;
  specialization: DentistSpecialization;
  role: DentistRole;
  is_active: boolean;
  clinic_id: string | null;
  external_id: string | null;
};
```

**Guidelines:**
- Use `type` for entity definitions
- Use descriptive property names (snake_case is acceptable if matching database)
- Use `null` for optional fields that can be explicitly null
- Reference enums from separate files
- Keep entities pure (no methods, no classes)

### 2. Input Types (`create-dentist-input.ts`)

```typescript
export type CreateDentistInput = {
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  password: string;
  cro_number: string;
  specialization: string | null;
  role: string | null;
  is_active: boolean;
  clinic_id?: string | null;
};
```

**Guidelines:**
- Create separate input types for different operations (create, update)
- Use `string | null` for optional enum fields (will be validated in use case)
- Include fields needed for the operation (e.g., `password` for creation)
- Use optional (`?`) for truly optional fields

### 3. Enums (`dentist-role.ts`, `dentist-specialization.ts`)

```typescript
// dentist-role.ts
export enum DentistRole {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  HIRED = 'hired',
}

// dentist-specialization.ts
export enum DentistSpecialization {
  GENERALIST = 'generalist',
  ORTHODONTIST = 'orthodontist',
  PERIODONTIST = 'periodontist',
  // ... more values
}
```

**Guidelines:**
- Use `enum` for fixed sets of values
- Use descriptive constant names (UPPER_SNAKE_CASE)
- Map to string values that match database/GraphQL schema
- Keep enums in separate files for reusability

### 4. Error Types (`src/entities/errors/`)

Create custom error types for domain-specific errors:

```typescript
// bad-user-input-error.ts
export class BadUserInputError extends Error {
  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
    public readonly stack?: string,
  ) {
    super(message);
    this.name = 'BadUserInputError';
  }
}
```

**Available Error Types:**
- `BadRequestError`: General bad request
- `BadUserInputError`: Invalid user input
- `NotFoundError`: Resource not found
- `UnauthorizedError`: Authentication/authorization failure
- `BusinessError`: Business rule violation
- `UnknownError`: Unexpected errors

### 5. Index File (`index.ts`)

```typescript
export * from './dentist';
export * from './create-dentist-input';
export * from './dentist-role';
export * from './dentist-specialization';
```

## Best Practices

### 1. **Keep Entities Pure**
- No dependencies on external libraries
- No database-specific types (use Prisma types only in repositories)
- No business logic (validation happens in use cases)

### 2. **Use Descriptive Types**
- Prefer explicit types over `any`
- Use union types for constrained values
- Use `null` vs `undefined` consistently

### 3. **Naming Conventions**
- Entity types: `[Domain]Entity` (e.g., `DentistEntity`)
- Input types: `Create[Domain]Input`, `Update[Domain]Input`
- Enums: `[Domain][Property]` (e.g., `DentistRole`)

### 4. **ID Fields**
- Use `string` for IDs (even if database uses integers)
- Conversion happens in repository mappers

### 5. **Nullable Fields**
- Use `| null` for fields that can be explicitly null
- Use `?` for optional fields that may be undefined
- Be consistent within a domain

## Creating a New Entity

### Step-by-Step Example: Creating a `Patient` Entity

1. **Create directory structure:**
   ```bash
   mkdir -p src/entities/patient
   ```

2. **Create main entity (`patient.ts`):**
   ```typescript
   export type PatientEntity = {
     id: string;
     firstname: string;
     lastname: string;
     date_of_birth: string; // ISO date string
     phone_number: string;
     email: string | null;
     address: string | null;
     created_at: string; // ISO datetime
   };
   ```

3. **Create input types (`create-patient-input.ts`):**
   ```typescript
   export type CreatePatientInput = {
     firstname: string;
     lastname: string;
     date_of_birth: string;
     phone_number: string;
     email?: string | null;
     address?: string | null;
   };
   ```

4. **Create index file (`index.ts`):**
   ```typescript
   export * from './patient';
   export * from './create-patient-input';
   ```

5. **Update main entities index (if exists):**
   ```typescript
   // src/entities/index.ts
   export * from './patient';
   ```

## Common Patterns

### Date/Time Fields
- Use `string` for dates (ISO format)
- Conversion to/from Date objects happens in repositories

### Relationships
- Use `string | null` for foreign key IDs
- Avoid nested objects in entities (fetch separately if needed)

### Enums
- Always create TypeScript enums
- Map enum values to match GraphQL schema and database

## Validation

Entity types don't include validation logic. Validation happens in:
- **Use Cases**: Business rule validation (using Yup, Zod, etc.)
- **GraphQL Schema**: Type constraints
- **Database**: Schema constraints

Entities define the **shape** of data, not the **rules**.



