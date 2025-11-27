# Repositories Guide

This guide explains how to create and structure repositories in the project.

## Overview

Repositories abstract data access operations, providing a clean interface between business logic and the database. They handle mapping between database models (Prisma) and domain entities.

## Location

Repositories are located in `src/repositories/database/[domain]/` where `[domain]` is the domain name.

## Structure

For each domain, create the following structure:

```
src/repositories/database/[domain]/
├── create-[domain].ts           # Create operation
├── get-[domain]-by-id.ts        # Get by ID operation
├── get-[domain]-by-email.ts     # Get by email (if applicable)
├── get-all-[domain]s.ts         # List operation
├── update-[domain].ts           # Update operation
├── soft-delete-[domain].ts      # Soft delete operation
├── types.ts                     # Repository-specific types
├── mapper/
│   ├── map-to-entity.ts         # Prisma -> Entity mapper
│   └── map-to-prisma-data.ts    # Entity -> Prisma mapper
└── index.ts                     # Exports and initialization
```

## Example: Dentist Repository

### 1. Create Operation (`create-dentist.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { CreateDentistData } from './types';
import { mapToEntity } from './mapper/map-to-entity';
import { mapToPrismaCreateData } from './mapper/map-to-prisma-data';

export const initCreateDentistRepository = (db: PrismaClient) => {
  return async (data: CreateDentistData): Promise<DentistEntity> => {
    const prismaData = mapToPrismaCreateData(data);

    const dentist = await db.dentist.create({
      data: prismaData,
    });

    return mapToEntity(dentist);
  };
};
```

**Guidelines:**
- Use factory pattern: `init[Operation][Domain]Repository`
- Accept `PrismaClient` as parameter
- Return a function that accepts domain data
- Always map to entity before returning
- Use mappers for data transformation

### 2. Types (`types.ts`)

```typescript
import { Prisma } from '@prisma/client';

export type CreateDentistData = Omit<
  Prisma.DentistUncheckedCreateInput,
  'clinic_id' | 'specialization' | 'role'
> & {
  clinic_id?: number | null;
  specialization?: string | null;
  role?: string | null;
};

export type UpdateDentistData = Omit<
  Prisma.DentistUncheckedUpdateInput,
  'specialization' | 'role' | 'clinic_id'
> & {
  specialization?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;
  role?: string | Prisma.NullableStringFieldUpdateOperationsInput | null;
  clinic_id?: number | Prisma.NullableIntFieldUpdateOperationsInput | null;
};
```

**Guidelines:**
- Extend Prisma types when possible
- Override fields that need custom handling (enums, IDs)
- Use Prisma's update operation types for updates
- Keep types repository-specific (not shared with entities)

### 3. Entity Mapper (`mapper/map-to-entity.ts`)

```typescript
import { Dentist } from '@prisma/client';
import { DentistEntity } from '../../../../entities/dentist/dentist';
import { DentistRole } from '../../../../entities/dentist/dentist-role';
import { DentistSpecialization } from '../../../../entities/dentist/dentist-specialization';

export const mapToEntity = (dentist: Dentist): DentistEntity => {
  return {
    id: dentist.id.toString(),
    firstname: dentist.firstname,
    lastname: dentist.lastname,
    phone_number: dentist.phone_number,
    email: dentist.email,
    cro_number: dentist.cro_number,
    specialization:
      (dentist.specialization as DentistSpecialization) ||
      DentistSpecialization.GENERALIST,
    role: (dentist.role as DentistRole) || DentistRole.ADMIN,
    is_active: dentist.is_active,
    clinic_id: dentist.clinic_id?.toString() ?? null,
    external_id: dentist.external_id ?? null,
  };
};
```

**Guidelines:**
- Convert database types to entity types
- Convert integer IDs to strings
- Handle null/undefined conversions
- Provide defaults for enum fields if needed
- Keep mapping logic pure (no side effects)

### 4. Prisma Data Mapper (`mapper/map-to-prisma-data.ts`)

```typescript
import { Prisma } from '@prisma/client';
import { CreateDentistData } from '../types';

export const mapToPrismaCreateData = (
  data: CreateDentistData,
): Prisma.DentistUncheckedCreateInput => {
  return {
    firstname: data.firstname,
    lastname: data.lastname,
    phone_number: data.phone_number,
    email: data.email,
    cro_number: data.cro_number,
    specialization: data.specialization ?? null,
    role: data.role ?? null,
    is_active: data.is_active,
    external_id: data.external_id,
    ...(data.clinic_id && { clinic_id: data.clinic_id }),
  };
};
```

**Guidelines:**
- Convert entity types to Prisma types
- Handle optional fields with conditional spread
- Convert string IDs to integers if needed
- Keep mapping logic pure

### 5. Get Operations

```typescript
// get-dentist-by-id.ts
import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { NotFoundError } from '../../../entities/errors/not-found-error';
import { mapToEntity } from './mapper/map-to-entity';

export const initGetDentistByIdRepository = (db: PrismaClient) => {
  return async (id: string): Promise<DentistEntity> => {
    const dentist = await db.dentist.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!dentist) {
      throw new NotFoundError('Dentist not found', { id });
    }

    return mapToEntity(dentist);
  };
};
```

**Guidelines:**
- Convert string IDs to integers for database queries
- Throw `NotFoundError` when entity doesn't exist
- Always map to entity before returning

### 6. Update Operation (`update-dentist.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { UpdateDentistData } from './types';
import { mapToEntity } from './mapper/map-to-entity';
import { mapToPrismaUpdateData } from './mapper/map-to-prisma-data';
import { NotFoundError } from '../../../entities/errors/not-found-error';

export const initUpdateDentistRepository = (db: PrismaClient) => {
  return async (
    id: string,
    data: UpdateDentistData,
  ): Promise<DentistEntity> => {
    const prismaData = mapToPrismaUpdateData(data);

    const dentist = await db.dentist.update({
      where: { id: parseInt(id, 10) },
      data: prismaData,
    });

    return mapToEntity(dentist);
  };
};
```

**Guidelines:**
- Handle partial updates (only update provided fields)
- Throw `NotFoundError` if entity doesn't exist
- Use Prisma's update operation types

### 7. Soft Delete (`soft-delete-dentist.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { DentistEntity } from '../../../entities/dentist/dentist';
import { NotFoundError } from '../../../entities/errors/not-found-error';
import { mapToEntity } from './mapper/map-to-entity';

export const initSoftDeleteDentistRepository = (db: PrismaClient) => {
  return async (id: string): Promise<DentistEntity> => {
    const dentist = await db.dentist.update({
      where: { id: parseInt(id, 10) },
      data: { deleted_at: new Date() },
    });

    return mapToEntity(dentist);
  };
};
```

**Guidelines:**
- Use soft delete pattern (set `deleted_at` timestamp)
- Consider adding `deleted_at` filter to get operations
- Return the updated entity

### 8. Index File (`index.ts`)

```typescript
import { PrismaClient } from '@prisma/client';
import { initCreateDentistRepository } from './create-dentist';
import { initGetDentistByIdRepository } from './get-dentist-by-id';
import { initGetDentistByEmailRepository } from './get-dentist-by-email';
import { initGetAllDentistsRepository } from './get-all-dentists';
import { initUpdateDentistRepository } from './update-dentist';
import { initSoftDeleteDentistRepository } from './soft-delete-dentist';

export type { CreateDentistData, UpdateDentistData } from './types';

export const initDentistRepositories = (db: PrismaClient) => {
  return {
    create: initCreateDentistRepository(db),
    getById: initGetDentistByIdRepository(db),
    getByEmail: initGetDentistByEmailRepository(db),
    getAll: initGetAllDentistsRepository(db),
    update: initUpdateDentistRepository(db),
    softDelete: initSoftDeleteDentistRepository(db),
  };
};

export type DentistRepositories = ReturnType<typeof initDentistRepositories>;
```

**Guidelines:**
- Export all repository functions
- Export types for use in use cases
- Use factory pattern: `init[Domain]Repositories`
- Return an object with all operations

## Best Practices

### 1. **Always Use Mappers**
- Never return Prisma models directly
- Always convert to domain entities
- Keep mapping logic in separate files

### 2. **Error Handling**
- Throw domain errors (NotFoundError, etc.)
- Don't expose database-specific errors
- Provide context in error messages

### 3. **ID Conversion**
- Convert string IDs (from entities) to integers (for Prisma)
- Convert integer IDs (from Prisma) to strings (for entities)
- Handle conversion in mappers

### 4. **Type Safety**
- Use Prisma types for database operations
- Use entity types for return values
- Create repository-specific types for inputs

### 5. **Factory Pattern**
- All repositories use factory functions
- Accept `PrismaClient` as parameter
- Return configured functions

## Creating a New Repository

### Step-by-Step Example: Creating a `Patient` Repository

1. **Create directory structure:**
   ```bash
   mkdir -p src/repositories/database/patient/mapper
   ```

2. **Create types (`types.ts`):**
   ```typescript
   import { Prisma } from '@prisma/client';

   export type CreatePatientData = Prisma.PatientUncheckedCreateInput;
   export type UpdatePatientData = Prisma.PatientUncheckedUpdateInput;
   ```

3. **Create mappers:**
   ```typescript
   // mapper/map-to-entity.ts
   import { Patient } from '@prisma/client';
   import { PatientEntity } from '../../../../entities/patient/patient';

   export const mapToEntity = (patient: Patient): PatientEntity => {
     return {
       id: patient.id.toString(),
       firstname: patient.firstname,
       // ... map all fields
     };
   };
   ```

4. **Create operations (e.g., `create-patient.ts`):**
   ```typescript
   import { PrismaClient } from '@prisma/client';
   import { PatientEntity } from '../../../entities/patient/patient';
   import { CreatePatientData } from './types';
   import { mapToEntity } from './mapper/map-to-entity';
   import { mapToPrismaCreateData } from './mapper/map-to-prisma-data';

   export const initCreatePatientRepository = (db: PrismaClient) => {
     return async (data: CreatePatientData): Promise<PatientEntity> => {
       const prismaData = mapToPrismaCreateData(data);
       const patient = await db.patient.create({ data: prismaData });
       return mapToEntity(patient);
     };
   };
   ```

5. **Create index file (`index.ts`):**
   ```typescript
   import { PrismaClient } from '@prisma/client';
   import { initCreatePatientRepository } from './create-patient';
   // ... import other operations

   export const initPatientRepositories = (db: PrismaClient) => {
     return {
       create: initCreatePatientRepository(db),
       // ... other operations
     };
   };
   ```

6. **Register in main repositories index:**
   ```typescript
   // src/repositories/database/index.ts
   import { initPatientRepositories } from './patient';
   // ... other domains

   export const initRepositories = (db: PrismaClient) => {
     return {
       dentist: initDentistRepositories(db),
       patient: initPatientRepositories(db),
       // ... other domains
     };
   };
   ```

## Common Patterns

### Filtering and Pagination
```typescript
export const initGetAllDentistsRepository = (db: PrismaClient) => {
  return async (filters?: {
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<DentistEntity[]> => {
    const dentists = await db.dentist.findMany({
      where: {
        ...(filters?.is_active !== undefined && {
          is_active: filters.is_active,
        }),
        deleted_at: null, // Exclude soft-deleted
      },
      take: filters?.limit,
      skip: filters?.offset,
    });

    return dentists.map(mapToEntity);
  };
};
```

### Relationships
```typescript
// Include related data when needed
const dentist = await db.dentist.findUnique({
  where: { id },
  include: {
    clinic: true, // Include related clinic
  },
});
```

## Testing Considerations

- Mock `PrismaClient` in tests
- Test mappers separately
- Test error cases (not found, etc.)
- Verify ID conversions

