# Use Cases Guide

This guide explains how to create and structure use cases in the project.

## Overview

Use cases contain the business logic of the application. They orchestrate operations across repositories and gateways, validate inputs, and enforce business rules. Use cases are pure functions that receive `AppContext` for dependencies.

## Location

Use cases are located in `src/usecases/[domain]/` where `[domain]` is the domain name.

## Structure

For each domain, create the following structure:

```
src/usecases/[domain]/
├── create-[domain].logic.ts    # Create use case
├── get-[domain]-by-id.logic.ts # Get by ID use case
├── get-[domain]-by-email.logic.ts # Get by email use case
├── get-all-[domain]s.logic.ts  # List use case
├── update-[domain].logic.ts    # Update use case
├── delete-[domain].logic.ts    # Delete use case
└── index.ts                    # Exports and initialization
```

## Example: Dentist Use Cases

### 1. Create Use Case (`create-dentist.logic.ts`)

```typescript
import { AppContext } from '../../libs/context';
import { CreateDentistInput } from '../../entities/dentist/create-dentist-input';
import { DentistEntity } from '../../entities/dentist/dentist';
import { DentistRole } from '../../entities/dentist/dentist-role';
import { DentistSpecialization } from '../../entities/dentist/dentist-specialization';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import * as yup from 'yup';

export const createDentist = async (
  context: AppContext,
  input: CreateDentistInput,
): Promise<DentistEntity> => {
  validateInput(input);

  // First, create user in Firebase (IAM Gateway)
  const displayName = `${input.firstname} ${input.lastname}`;
  const externalId = await context.gateways.iam.createUser(
    input.email,
    input.password,
    displayName,
  );

  // Then, create dentist with the external_id from Firebase
  const dentistData = {
    firstname: input.firstname,
    lastname: input.lastname,
    phone_number: input.phone_number,
    email: input.email,
    cro_number: input.cro_number,
    specialization: input.specialization ?? null,
    role: input.role ?? null,
    is_active: input.is_active,
    external_id: externalId,
    ...(input.clinic_id && { clinic_id: parseInt(input.clinic_id, 10) }),
  };

  return await context.repositories.dentist.create(dentistData);
};

function validateInput(input: CreateDentistInput) {
  const schema = yup.object<CreateDentistInput>({
    firstname: yup
      .string()
      .required('nome é obrigatório')
      .notOneOf([''], 'nome não pode estar vazio')
      .max(100, 'nome deve ter no máximo 100 caracteres'),
    lastname: yup
      .string()
      .required('sobrenome é obrigatório')
      .notOneOf([''], 'sobrenome não pode estar vazio')
      .max(100, 'sobrenome deve ter no máximo 100 caracteres'),
    // ... more validations
  });

  try {
    schema.validateSync(input, { abortEarly: false });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      const errorMessage = (error as yup.ValidationError).errors.join(', ');
      throw new BadUserInputError(errorMessage);
    }
    throw error;
  }
}
```

**Guidelines:**

- Always validate input first
- Use validation library (Yup, Zod, etc.)
- Throw domain errors (BadUserInputError, etc.)
- Orchestrate operations (gateways, repositories)
- Return domain entities
- Keep business logic pure (no side effects beyond orchestration)

### 2. Get by ID Use Case (`get-dentist-by-id.logic.ts`)

```typescript
import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';

export const getDentistById = async (
  context: AppContext,
  id: string,
): Promise<DentistEntity> => {
  return await context.repositories.dentist.getById(id);
};
```

**Guidelines:**

- Simple pass-through for read operations
- Add authorization checks if needed
- Let repository handle NotFoundError

### 3. Update Use Case (`update-dentist.logic.ts`)

```typescript
import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';
import { UpdateDentistInput } from '../../entities/dentist/update-dentist-input';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
import * as yup from 'yup';

export const updateDentist = async (
  context: AppContext,
  id: string,
  input: UpdateDentistInput,
): Promise<DentistEntity> => {
  validateInput(input);

  // Check if dentist exists
  await context.repositories.dentist.getById(id);

  // Update dentist
  const updateData = {
    ...(input.firstname && { firstname: input.firstname }),
    ...(input.lastname && { lastname: input.lastname }),
    // ... other fields
  };

  return await context.repositories.dentist.update(id, updateData);
};

function validateInput(input: UpdateDentistInput) {
  // Validation for update (fields are optional)
  const schema = yup.object<UpdateDentistInput>({
    firstname: yup.string().max(100, 'nome deve ter no máximo 100 caracteres'),
    // ... more validations
  });

  try {
    schema.validateSync(input, { abortEarly: false });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      const errorMessage = (error as yup.ValidationError).errors.join(', ');
      throw new BadUserInputError(errorMessage);
    }
    throw error;
  }
}
```

**Guidelines:**

- Validate only provided fields for updates
- Check existence before updating
- Handle partial updates
- Update related systems if needed (e.g., Firebase)

### 4. Delete Use Case (`delete-dentist.logic.ts`)

```typescript
import { AppContext } from '../../libs/context';
import { DentistEntity } from '../../entities/dentist/dentist';

export const deleteDentist = async (
  context: AppContext,
  id: string,
): Promise<DentistEntity> => {
  // Check if dentist exists
  await context.repositories.dentist.getById(id);

  // Soft delete
  return await context.repositories.dentist.softDelete(id);
};
```

**Guidelines:**

- Use soft delete pattern
- Check existence before deleting
- Consider cascading deletes for related entities
- May need to update external systems (e.g., disable Firebase user)

### 5. Index File (`index.ts`)

```typescript
import { createDentist } from './create-dentist.logic';
import { getDentistById } from './get-dentist-by-id.logic';
import { getDentistByEmail } from './get-dentist-by-email.logic';
import { getAllDentists } from './get-all-dentists.logic';
import { updateDentist } from './update-dentist.logic';
import { deleteDentist } from './delete-dentist.logic';

export const initDentistUsecases = () => {
  return {
    create: createDentist,
    getById: getDentistById,
    getByEmail: getDentistByEmail,
    getAll: getAllDentists,
    update: updateDentist,
    delete: deleteDentist,
  };
};

export type DentistUsecases = ReturnType<typeof initDentistUsecases>;
```

**Guidelines:**

- Export all use case functions
- Use factory pattern: `init[Domain]Usecases`
- Return an object with all operations
- Export type for use in resolvers

## Best Practices

### 1. **Input Validation**

- Always validate inputs using schemas
- Use validation libraries (Yup, Zod)
- Provide clear error messages
- Validate early (fail fast)

### 2. **Error Handling**

- Throw domain errors (BadUserInputError, NotFoundError, etc.)
- Don't expose internal errors
- Provide context in error messages
- Let errors bubble up (don't catch unless transforming)

### 3. **Orchestration**

- Coordinate between repositories and gateways
- Handle transactions if needed
- Maintain consistency across systems

### 4. **Business Rules**

- Enforce business rules in use cases
- Don't put business logic in repositories
- Keep rules explicit and testable

### 5. **Dependencies**

- Receive `AppContext` as first parameter
- Access repositories via `context.repositories`
- Access gateways via `context.gateways`
- Access logger via `context.logger`

### 6. **Return Types**

- Always return domain entities
- Don't return database models
- Keep return types consistent

## Validation Patterns

### Using Yup

```typescript
import * as yup from 'yup';
import { BadUserInputError } from '../../entities/errors/bad-user-input-error';

function validateInput(input: CreateDentistInput) {
  const schema = yup.object({
    email: yup
      .string()
      .email('email deve ser um endereço de email válido')
      .required('email é obrigatório'),
    // ... more fields
  });

  try {
    schema.validateSync(input, { abortEarly: false });
  } catch (error: unknown) {
    if (error instanceof yup.ValidationError) {
      const errorMessage = error.errors.join(', ');
      throw new BadUserInputError(errorMessage);
    }
    throw error;
  }
}
```

### Enum Validation

```typescript
specialization: yup
  .string()
  .nullable()
  .oneOf(
    Object.values(DentistSpecialization),
    `especialização deve ser uma das seguintes: ${Object.values(DentistSpecialization).join(', ')}`,
  ),
```

### Custom Validation

```typescript
clinic_id: yup
  .string()
  .nullable()
  .optional()
  .test(
    'clinic_id-valid',
    'clinic_id deve ser uma string numérica válida maior que zero',
    (value: string | null | undefined) => {
      if (value === null || value === undefined) return true;
      const num = parseInt(value, 10);
      return !isNaN(num) && num > 0;
    },
  ),
```

## Creating a New Use Case

### Step-by-Step Example: Creating a `Patient` Use Case

1. **Create directory structure:**

   ```bash
   mkdir -p src/usecases/patient
   ```

2. **Create use case (`create-patient.logic.ts`):**

   ```typescript
   import { AppContext } from '../../libs/context';
   import { CreatePatientInput } from '../../entities/patient/create-patient-input';
   import { PatientEntity } from '../../entities/patient/patient';
   import { BadUserInputError } from '../../entities/errors/bad-user-input-error';
   import * as yup from 'yup';

   export const createPatient = async (
     context: AppContext,
     input: CreatePatientInput,
   ): Promise<PatientEntity> => {
     validateInput(input);

     const patientData = {
       firstname: input.firstname,
       lastname: input.lastname,
       date_of_birth: input.date_of_birth,
       phone_number: input.phone_number,
       email: input.email ?? null,
       address: input.address ?? null,
     };

     return await context.repositories.patient.create(patientData);
   };

   function validateInput(input: CreatePatientInput) {
     const schema = yup.object({
       firstname: yup.string().required('nome é obrigatório'),
       // ... more validations
     });

     try {
       schema.validateSync(input, { abortEarly: false });
     } catch (error: unknown) {
       if (error instanceof yup.ValidationError) {
         throw new BadUserInputError(error.errors.join(', '));
       }
       throw error;
     }
   }
   ```

3. **Create index file (`index.ts`):**

   ```typescript
   import { createPatient } from './create-patient.logic';
   // ... import other use cases

   export const initPatientUsecases = () => {
     return {
       create: createPatient,
       // ... other operations
     };
   };

   export type PatientUsecases = ReturnType<typeof initPatientUsecases>;
   ```

4. **Register in main use cases index:**

   ```typescript
   // src/usecases/index.ts
   import { initPatientUsecases } from './patient';
   // ... other domains

   export const initUsecases = () => {
     return {
       dentist: initDentistUsecases(),
       patient: initPatientUsecases(),
       // ... other domains
     };
   };
   ```

## Common Patterns

### Authorization Checks

```typescript
export const updateDentist = async (
  context: AppContext,
  id: string,
  input: UpdateDentistInput,
): Promise<DentistEntity> => {
  // Check authentication
  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('User must be authenticated');
  }

  // Check authorization (e.g., only owner can update)
  const dentist = await context.repositories.dentist.getById(id);
  if (dentist.external_id !== context.auth.externalId) {
    throw new UnauthorizedError('User not authorized to update this dentist');
  }

  // Proceed with update
  // ...
};
```

### Complex Orchestration

```typescript
export const createDentist = async (
  context: AppContext,
  input: CreateDentistInput,
): Promise<DentistEntity> => {
  validateInput(input);

  // Step 1: Create user in external system
  const externalId = await context.gateways.iam.createUser(
    input.email,
    input.password,
    `${input.firstname} ${input.lastname}`,
  );

  // Step 2: Create dentist in database
  const dentist = await context.repositories.dentist.create({
    ...input,
    external_id: externalId,
  });

  // Step 3: Send welcome email (if needed)
  // await context.gateways.email.sendWelcome(dentist.email);

  return dentist;
};
```

### Transaction Handling

```typescript
// If using Prisma transactions
export const createDentistWithClinic = async (
  context: AppContext,
  input: CreateDentistInput,
  clinicData: CreateClinicInput,
): Promise<DentistEntity> => {
  return await context.repositories.db.$transaction(async (tx) => {
    const clinic = await tx.clinic.create({ data: clinicData });
    const dentist = await tx.dentist.create({
      data: { ...input, clinic_id: clinic.id },
    });
    return mapToEntity(dentist);
  });
};
```

## Testing Considerations

- Mock `AppContext` in tests
- Test validation logic separately
- Test business rules
- Test error cases
- Test orchestration flows
