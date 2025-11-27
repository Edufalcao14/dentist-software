# GraphQL Guide

This guide explains how to create and structure GraphQL resolvers, schema, and types in the project.

## Overview

The GraphQL layer is the entry point for all API requests. It handles GraphQL queries, mutations, and type resolution, transforming between GraphQL types and domain entities.

## Location

GraphQL files are located in `src/graphql/`:
- Schema: `src/graphql/schema.graphql`
- Resolvers: `src/graphql/resolvers/[domain]/`
- Generated types: `src/graphql/__generated__/resolvers-types.ts`

## Structure

For each domain, create the following structure:

```
src/graphql/resolvers/[domain]/
├── [domain].ts              # Type resolvers (field resolvers)
├── [domain]-query.ts       # Query resolvers
├── [domain]-mutation.ts    # Mutation resolvers
└── index.ts                # Module initialization
```

## Example: Dentist GraphQL Module

### 1. GraphQL Schema (`schema.graphql`)

```graphql
scalar Email
scalar DateTime

enum DentistRole {
  Owner
  Admin
  hired
}

type Dentist {
  id: String!
  firstname: String!
  lastname: String!
  phone_number: String!
  email: Email!
  cro_number: String!
  specialization: String!
  role: String!
  is_active: Boolean!
  clinic_id: String
  external_id: String
}

input CreateDentistInput {
  firstname: String!
  lastname: String!
  phone_number: String!
  email: Email!
  password: String!
  cro_number: String!
  specialization: String
  role: String
  is_active: Boolean!
  clinic_id: String
}

input UpdateDentistInput {
  firstname: String
  lastname: String
  phone_number: String
  email: Email
  cro_number: String
  specialization: String
  role: String
  is_active: Boolean
  clinic_id: String
}

type Query {
  _empty: String
  getDentistById(id: String!): Dentist!
  getDentistByEmail(email: Email!): Dentist!
}

type Mutation {
  _empty: String
  createDentist(input: CreateDentistInput!): Dentist!
  updateDentist(id: String!, input: UpdateDentistInput!): Dentist!
  deleteDentist(id: String!): Dentist!
}
```

**Guidelines:**
- Use `!` for required fields
- Use custom scalars (Email, DateTime) when appropriate
- Match enum values with TypeScript enums
- Use descriptive input type names
- Include `_empty` placeholder in Query/Mutation if needed

### 2. Type Resolvers (`dentist.ts`)

```typescript
import { Usecases } from '../../../usecases';
import { DentistResolvers } from '../../__generated__/resolvers-types';

export const initDentistResolvers = (usecases: Usecases): DentistResolvers => ({
  id: (parent) => {
    return parent.id;
  },
  firstname: (parent) => {
    return parent.firstname;
  },
  lastname: (parent) => {
    return parent.lastname;
  },
  phone_number: (parent) => {
    return parent.phone_number;
  },
  email: (parent) => {
    return parent.email;
  },
  cro_number: (parent) => {
    return parent.cro_number;
  },
  specialization: (parent) => {
    return parent.specialization;
  },
  role: (parent) => {
    return parent.role;
  },
  is_active: (parent) => {
    return parent.is_active;
  },
  clinic_id: (parent) => {
    return parent.clinic_id;
  },
  external_id: (parent) => {
    return parent.external_id;
  },
});
```

**Guidelines:**
- Create resolvers for all fields in the type
- Use simple pass-through for entity fields
- The `parent` parameter is the entity returned from use cases
- Use generated types from `__generated__/resolvers-types.ts`

### 3. Query Resolvers (`dentist-query.ts`)

```typescript
import { DentistEntity } from '../../../entities/dentist/dentist';
import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  QueryGetDentistByIdArgs,
  QueryGetDentistByEmailArgs,
  QueryResolvers,
} from '../../__generated__/resolvers-types';

export const initDentistQueryResolvers = (
  usecases: Usecases,
): Pick<QueryResolvers, 'getDentistById' | 'getDentistByEmail'> => {
  return {
    getDentistById: async (
      _,
      args: QueryGetDentistByIdArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return usecases.dentist.getById(context, args.id);
    },
    getDentistByEmail: async (
      _,
      args: QueryGetDentistByEmailArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return usecases.dentist.getByEmail(context, args.email);
    },
  };
};
```

**Guidelines:**
- Use generated argument types
- Pass `AppContext` to use cases
- Return domain entities (they match GraphQL types)
- Use `Pick` to type the return value

### 4. Mutation Resolvers (`dentist-mutation.ts`)

```typescript
import { AppContext } from '../../../libs/context';
import { Usecases } from '../../../usecases';
import {
  MutationCreateDentistArgs,
  MutationUpdateDentistArgs,
  MutationDeleteDentistArgs,
  MutationResolvers,
} from '../../__generated__/resolvers-types';
import { DentistEntity } from '../../../entities/dentist/dentist';

export const initDentistMutationResolvers = (
  usecases: Usecases,
): Pick<
  MutationResolvers,
  'createDentist' | 'updateDentist' | 'deleteDentist'
> => {
  return {
    createDentist: async (
      _,
      args: MutationCreateDentistArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return await usecases.dentist.create(context, {
        firstname: args.input.firstname,
        lastname: args.input.lastname,
        phone_number: args.input.phone_number,
        email: args.input.email,
        password: args.input.password,
        cro_number: args.input.cro_number,
        specialization: args.input.specialization ?? null,
        role: args.input.role ?? null,
        is_active: args.input.is_active,
        clinic_id: args.input.clinic_id ?? null,
      });
    },
    updateDentist: async (
      _,
      args: MutationUpdateDentistArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return await usecases.dentist.update(context, args.id, {
        firstname: args.input.firstname ?? undefined,
        lastname: args.input.lastname ?? undefined,
        phone_number: args.input.phone_number ?? undefined,
        email: args.input.email ?? undefined,
        cro_number: args.input.cro_number ?? undefined,
        ...(args.input.specialization !== undefined && {
          specialization: args.input.specialization,
        }),
        ...(args.input.role !== undefined && { role: args.input.role }),
        is_active: args.input.is_active ?? undefined,
        ...(args.input.clinic_id !== undefined && {
          clinic_id: args.input.clinic_id,
        }),
      });
    },
    deleteDentist: async (
      _,
      args: MutationDeleteDentistArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return await usecases.dentist.delete(context, args.id);
    },
  };
};
```

**Guidelines:**
- Transform GraphQL input to entity input
- Handle null/undefined conversions
- Use conditional spread for optional fields
- Pass context to use cases

### 5. Module Index (`index.ts`)

```typescript
import { Usecases } from '../../../usecases';
import { Resolvers } from '../../__generated__/resolvers-types';
import { initDentistResolvers } from './dentist';
import { initDentistMutationResolvers } from './dentist-mutation';
import { initDentistQueryResolvers } from './dentist-query';

export const initDentistModuleResolvers = (usecases: Usecases): Resolvers => {
  return {
    Query: {
      ...initDentistQueryResolvers(usecases),
    },
    Mutation: {
      ...initDentistMutationResolvers(usecases),
    },
    Dentist: initDentistResolvers(usecases),
  };
};
```

**Guidelines:**
- Combine all resolvers for the domain
- Return partial `Resolvers` type
- Export for use in main resolvers index

### 6. Main Resolvers Index (`resolvers/index.ts`)

```typescript
import { initScalars } from './scalars';
import { initDentistModuleResolvers } from './dentist';
import { Resolvers } from '../__generated__/resolvers-types';
import { Usecases } from '../../usecases';

export const initResolvers = (usecases: Usecases): Resolvers => {
  const {
    Query: dentistQueries,
    Mutation: dentistMutations,
    ...dentistResolvers
  } = initDentistModuleResolvers(usecases);

  return {
    ...initScalars(),
    Query: {
      ...dentistQueries,
    },
    Mutation: {
      ...dentistMutations,
    },
    ...dentistResolvers,
  };
};
```

**Guidelines:**
- Combine all domain resolvers
- Include scalar resolvers
- Merge Query and Mutation from all domains

## Custom Scalars

### Email Scalar (`scalars/email.ts`)

```typescript
import { GraphQLError, GraphQLScalarType } from 'graphql';

export const EmailScalar = new GraphQLScalarType({
  name: 'Email',
  description: 'Email custom scalar type',
  serialize(value: unknown): string {
    if (typeof value !== 'string') {
      throw new GraphQLError('Value must be a string');
    }
    return value;
  },
  parseValue(value: unknown): string {
    if (typeof value !== 'string') {
      throw new GraphQLError('Value must be a string');
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind !== 'StringValue') {
      throw new GraphQLError('Value must be a string');
    }
    return ast.value;
  },
});
```

### DateTime Scalar (`scalars/date-time.ts`)

```typescript
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString();
    }
    throw new GraphQLError('Value must be a Date');
  },
  parseValue(value: unknown): Date {
    if (typeof value === 'string') {
      return new Date(value);
    }
    throw new GraphQLError('Value must be a string');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    throw new GraphQLError('Value must be a string');
  },
});
```

### Scalars Index (`scalars/index.ts`)

```typescript
import { Resolvers } from '../__generated__/resolvers-types';
import { EmailScalar } from './email';
import { DateTimeScalar } from './date-time';

export const initScalars = (): Pick<Resolvers, 'Email' | 'DateTime'> => {
  return {
    Email: EmailScalar,
    DateTime: DateTimeScalar,
  };
};
```

## Best Practices

### 1. **Type Safety**
- Use generated types from GraphQL Code Generator
- Use `Pick` to type partial resolvers
- Match GraphQL types with entity types

### 2. **Input Transformation**
- Transform GraphQL inputs to entity inputs
- Handle null/undefined conversions
- Map enum values correctly

### 3. **Error Handling**
- Let errors bubble up from use cases
- GraphQL error formatter handles presentation
- Don't catch errors unless transforming

### 4. **Context Usage**
- Always pass `AppContext` to use cases
- Access auth, logger, config via context
- Don't access repositories/gateways directly

### 5. **Field Resolvers**
- Use simple pass-through for entity fields
- Add computed fields if needed
- Keep resolvers thin (delegate to use cases)

## Creating a New GraphQL Module

### Step-by-Step Example: Creating a `Patient` GraphQL Module

1. **Update schema (`schema.graphql`):**
   ```graphql
   type Patient {
     id: String!
     firstname: String!
     lastname: String!
     date_of_birth: String!
     phone_number: String!
     email: String
     address: String
   }

   input CreatePatientInput {
     firstname: String!
     lastname: String!
     date_of_birth: String!
     phone_number: String!
     email: String
     address: String
   }

   type Query {
     getPatientById(id: String!): Patient!
   }

   type Mutation {
     createPatient(input: CreatePatientInput!): Patient!
   }
   ```

2. **Generate types:**
   ```bash
   npm run codegen
   ```

3. **Create resolvers directory:**
   ```bash
   mkdir -p src/graphql/resolvers/patient
   ```

4. **Create type resolvers (`patient.ts`):**
   ```typescript
   import { Usecases } from '../../../usecases';
   import { PatientResolvers } from '../../__generated__/resolvers-types';

   export const initPatientResolvers = (usecases: Usecases): PatientResolvers => ({
     id: (parent) => parent.id,
     firstname: (parent) => parent.firstname,
     // ... other fields
   });
   ```

5. **Create query resolvers (`patient-query.ts`):**
   ```typescript
   import { AppContext } from '../../../libs/context';
   import { Usecases } from '../../../usecases';
   import { QueryResolvers } from '../../__generated__/resolvers-types';

   export const initPatientQueryResolvers = (
     usecases: Usecases,
   ): Pick<QueryResolvers, 'getPatientById'> => {
     return {
       getPatientById: async (_, args, context: AppContext) => {
         return usecases.patient.getById(context, args.id);
       },
     };
   };
   ```

6. **Create mutation resolvers (`patient-mutation.ts`):**
   ```typescript
   import { AppContext } from '../../../libs/context';
   import { Usecases } from '../../../usecases';
   import { MutationResolvers } from '../../__generated__/resolvers-types';

   export const initPatientMutationResolvers = (
     usecases: Usecases,
   ): Pick<MutationResolvers, 'createPatient'> => {
     return {
       createPatient: async (_, args, context: AppContext) => {
         return usecases.patient.create(context, {
           firstname: args.input.firstname,
           // ... map other fields
         });
       },
     };
   };
   ```

7. **Create module index (`index.ts`):**
   ```typescript
   import { Usecases } from '../../../usecases';
   import { Resolvers } from '../../__generated__/resolvers-types';
   import { initPatientResolvers } from './patient';
   import { initPatientQueryResolvers } from './patient-query';
   import { initPatientMutationResolvers } from './patient-mutation';

   export const initPatientModuleResolvers = (usecases: Usecases): Resolvers => {
     return {
       Query: {
         ...initPatientQueryResolvers(usecases),
       },
       Mutation: {
         ...initPatientMutationResolvers(usecases),
       },
       Patient: initPatientResolvers(usecases),
     };
   };
   ```

8. **Update main resolvers index:**
   ```typescript
   import { initPatientModuleResolvers } from './patient';
   // ... other domains

   export const initResolvers = (usecases: Usecases): Resolvers => {
     const {
       Query: patientQueries,
       Mutation: patientMutations,
       ...patientResolvers
     } = initPatientModuleResolvers(usecases);

     return {
       ...initScalars(),
       Query: {
         ...dentistQueries,
         ...patientQueries,
       },
       Mutation: {
         ...dentistMutations,
         ...patientMutations,
       },
       ...dentistResolvers,
       ...patientResolvers,
     };
   };
   ```

## GraphQL Code Generation

The project uses GraphQL Code Generator to generate TypeScript types from the schema.

### Configuration (`codegen.yaml`)

```yaml
schema: src/graphql/schema.graphql
generates:
  src/graphql/__generated__/resolvers-types.ts:
    plugins:
      - typescript
      - typescript-resolvers
    config:
      useIndexSignature: true
```

### Generate Types

```bash
npm run codegen
```

Run this after updating the schema to regenerate types.

## Error Handling

Errors from use cases are automatically formatted by the error formatter:

```typescript
// src/graphql/errors/error-formatter.ts
export const errorFormatter = (error: GraphQLError) => {
  // Format domain errors
  if (error.originalError instanceof BusinessError) {
    return {
      message: error.message,
      extensions: {
        code: error.originalError.name,
        // ... additional context
      },
    };
  }
  // ... handle other errors
};
```

## Testing Considerations

- Mock `AppContext` in resolver tests
- Test input transformation
- Test error cases
- Use GraphQL test utilities if available

