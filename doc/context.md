# Context Guide

This guide explains the `AppContext` system used for dependency injection throughout the application.

## Overview

`AppContext` is the dependency injection container that provides all application dependencies to use cases and resolvers. It ensures that business logic remains decoupled from infrastructure and makes the codebase more testable.

## Location

Context is defined in `src/libs/context.ts`.

## Structure

### AppContext

```typescript
export type AppContext = {
  config: Config;
  logger: Logger;
  repositories: Repositories;
  gateways: Gateways;
  auth: AuthContext;
};
```

**Components:**
- `config`: Application configuration
- `logger`: Bunyan logger instance
- `repositories`: All database repositories
- `gateways`: All external service gateways
- `auth`: Authentication context

### AuthContext

```typescript
type AuthContextUnauthenticated = {
  isAuthenticated: false;
};

type AuthContextAuthenticated = {
  isAuthenticated: true;
  externalId: string;
} & (AuthContextImpersonating | AuthContextNotImpersonating);

type AuthContextImpersonating = {
  isImpersonating: true;
  impersonatorExternalId: string;
};

type AuthContextNotImpersonating = {
  isImpersonating: false;
};

export type AuthContext = AuthContextAuthenticated | AuthContextUnauthenticated;
```

**Usage:**
- Check authentication: `if (context.auth.isAuthenticated) { ... }`
- Access user ID: `context.auth.externalId`
- Check impersonation: `if (context.auth.isImpersonating) { ... }`

## Initialization

Context is created in the GraphQL middleware:

```typescript
// src/graphql/index.ts
expressMiddleware(server, {
  context: async ({ req, res }): Promise<AppContext> => {
    // Extract auth token
    let auth: AuthContext = { isAuthenticated: false };
    let authHeader = req.headers.authorization;
    
    if (authHeader && operationName !== 'IntrospectionQuery') {
      authHeader = authHeader.replace(/^bearer /gim, '');
      try {
        auth = await iamGateway.getAuthAndValidateToken(authHeader);
      } catch (error) {
        auth = { isAuthenticated: false };
      }
    }

    return {
      config,
      logger,
      repositories,
      gateways: {
        iam: iamGateway,
      },
      auth,
    };
  },
});
```

## Usage in Use Cases

Use cases receive `AppContext` as the first parameter:

```typescript
export const createDentist = async (
  context: AppContext,
  input: CreateDentistInput,
): Promise<DentistEntity> => {
  // Access repositories
  const dentist = await context.repositories.dentist.create(data);

  // Access gateways
  const externalId = await context.gateways.iam.createUser(...);

  // Access logger
  context.logger.info('Dentist created', { dentistId: dentist.id });

  // Access auth
  if (context.auth.isAuthenticated) {
    // User is authenticated
    const userId = context.auth.externalId;
  }

  return dentist;
};
```

## Usage in Resolvers

Resolvers receive `AppContext` as the third parameter:

```typescript
export const initDentistQueryResolvers = (usecases: Usecases) => {
  return {
    getDentistById: async (
      _,
      args: QueryGetDentistByIdArgs,
      context: AppContext,
    ): Promise<DentistEntity> => {
      return usecases.dentist.getById(context, args.id);
    },
  };
};
```

## Repositories in Context

Repositories are initialized and provided via context:

```typescript
// src/repositories/database/index.ts
export const initRepositories = (db: PrismaClient) => {
  return {
    dentist: initDentistRepositories(db),
    // ... other domains
  };
};

// In GraphQL initialization
const repositories = initRepositories(db);

// Provided in context
return {
  repositories,
  // ...
};
```

**Access Pattern:**
```typescript
// In use case
await context.repositories.dentist.create(data);
await context.repositories.dentist.getById(id);
```

## Gateways in Context

Gateways are initialized and provided via context:

```typescript
// src/gateways/iam-gateway.ts
export const initIAMGateway = (config: Config) => {
  // ... initialization
  return {
    createUser,
    signIn,
    getAuthAndValidateToken,
    // ...
  };
};

// In main initialization
const iamGateway = initIAMGateway(config);

// Provided in context
return {
  gateways: {
    iam: iamGateway,
  },
  // ...
};
```

**Access Pattern:**
```typescript
// In use case
await context.gateways.iam.createUser(email, password, displayName);
```

## Adding New Dependencies

### Adding a New Repository

1. **Create repository initialization:**
   ```typescript
   // src/repositories/database/patient/index.ts
   export const initPatientRepositories = (db: PrismaClient) => {
     return {
       create: initCreatePatientRepository(db),
       // ... other operations
     };
   };
   ```

2. **Register in main repositories:**
   ```typescript
   // src/repositories/database/index.ts
   import { initPatientRepositories } from './patient';

   export const initRepositories = (db: PrismaClient) => {
     return {
       dentist: initDentistRepositories(db),
       patient: initPatientRepositories(db),
     };
   };
   ```

3. **Use in use cases:**
   ```typescript
   await context.repositories.patient.create(data);
   ```

### Adding a New Gateway

1. **Create gateway initialization:**
   ```typescript
   // src/gateways/email-gateway.ts
   export const initEmailGateway = (config: Config) => {
     return {
       sendEmail: async (to: string, subject: string, body: string) => {
         // ... implementation
       },
     };
   };
   ```

2. **Update Gateways type:**
   ```typescript
   // src/libs/context.ts
   export type Gateways = {
     iam: IAMGateway;
     email: EmailGateway;
   };
   ```

3. **Initialize and provide in context:**
   ```typescript
   // In GraphQL initialization
   const emailGateway = initEmailGateway(config);

   return {
     gateways: {
       iam: iamGateway,
       email: emailGateway,
     },
     // ...
   };
   ```

4. **Use in use cases:**
   ```typescript
   await context.gateways.email.sendEmail(to, subject, body);
   ```

## Best Practices

### 1. **Always Pass Context**
- Use cases always receive `AppContext` as first parameter
- Resolvers receive `AppContext` as third parameter
- Don't access dependencies directly (always via context)

### 2. **Type Safety**
- Use exported types (`Repositories`, `Gateways`, etc.)
- Type context in function signatures
- Use type inference where possible

### 3. **Authentication Checks**
- Check `context.auth.isAuthenticated` before accessing user data
- Use type guards for safe access:
  ```typescript
  if (context.auth.isAuthenticated) {
    const userId = context.auth.externalId; // TypeScript knows this is safe
  }
  ```

### 4. **Logging**
- Use `context.logger` for all logging
- Include relevant context in log messages
- Use appropriate log levels (info, error, warn, debug)

### 5. **Configuration**
- Access config via `context.config`
- Don't import config directly in use cases
- Keep config structure consistent

## Testing with Context

### Mocking Context

```typescript
import { AppContext } from '../libs/context';

const mockContext: AppContext = {
  config: mockConfig,
  logger: mockLogger,
  repositories: {
    dentist: {
      create: jest.fn(),
      getById: jest.fn(),
      // ... mock other methods
    },
  },
  gateways: {
    iam: {
      createUser: jest.fn(),
      // ... mock other methods
    },
  },
  auth: {
    isAuthenticated: true,
    isImpersonating: false,
    externalId: 'user-123',
  },
};
```

### Testing Use Cases

```typescript
describe('createDentist', () => {
  it('should create a dentist', async () => {
    const mockContext = createMockContext();
    const input = { /* ... */ };

    const result = await createDentist(mockContext, input);

    expect(mockContext.repositories.dentist.create).toHaveBeenCalled();
    expect(result).toMatchObject({ /* ... */ });
  });
});
```

## Common Patterns

### Authorization Check

```typescript
export const updateDentist = async (
  context: AppContext,
  id: string,
  input: UpdateDentistInput,
): Promise<DentistEntity> => {
  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('User must be authenticated');
  }

  const dentist = await context.repositories.dentist.getById(id);
  
  // Check if user owns the resource
  if (dentist.external_id !== context.auth.externalId) {
    throw new UnauthorizedError('Not authorized');
  }

  return await context.repositories.dentist.update(id, input);
};
```

### Impersonation Check

```typescript
if (context.auth.isAuthenticated && context.auth.isImpersonating) {
  // User is impersonating another user
  const targetUserId = context.auth.externalId;
  const impersonatorId = context.auth.impersonatorExternalId;
  
  // Log impersonation actions
  context.logger.info('Impersonation action', {
    targetUserId,
    impersonatorId,
  });
}
```

### Logging with Context

```typescript
context.logger.info('Dentist created', {
  dentistId: dentist.id,
  email: dentist.email,
  userId: context.auth.isAuthenticated ? context.auth.externalId : undefined,
});
```

## Summary

- `AppContext` provides all dependencies to use cases and resolvers
- Dependencies are initialized once and provided via context
- Context includes repositories, gateways, config, logger, and auth
- Always pass context as first parameter to use cases
- Use context for all dependency access (don't import directly)
- Mock context in tests for isolated unit testing

