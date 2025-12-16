# Gateways Guide

This guide explains how to create and structure gateways for external service integrations.

## Overview

Gateways abstract interactions with external services (APIs, third-party services, etc.), providing a clean interface that translates external service responses to domain errors and types.

## Location

Gateways are located in `src/gateways/` directory.

## Structure

Each gateway is a single file that exports an initialization function:

```
src/gateways/
├── iam-gateway.ts      # Identity and Access Management (Firebase)
├── email-gateway.ts    # Email service (if needed)
└── payment-gateway.ts  # Payment service (if needed)
```

## Example: IAM Gateway

### Structure

```typescript
import { Config } from '../libs/config';
import { UnknownError } from '../entities/errors/unknown-error';
import { BadRequestError } from '../entities/errors/bad-request-error';
import { NotFoundError } from '../entities/errors/not-found-error';
import { UnauthorizedError } from '../entities/errors/unauthorized-error';
import { AuthTokensEntity } from '../entities/auth/auth-tokens';
import { AuthContext } from '../libs/context';

export const initIAMGateway = (config: Config) => {
  // Initialize external service client
  // ...

  const createUser = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<string> => {
    try {
      // Call external service
      const user = await externalService.createUser({
        email,
        password,
        displayName,
      });

      return user.uid;
    } catch (err: any) {
      // Translate external errors to domain errors
      if (err.code === 'auth/email-already-exists') {
        throw new BadRequestError(err.message, { email }, err.stack);
      }
      throw new UnknownError(err.message, { email }, err.stack);
    }
  };

  // ... other methods

  return {
    createUser,
    signIn,
    getAuthAndValidateToken,
    // ... other methods
  };
};

export type IAMGateway = ReturnType<typeof initIAMGateway>;
```

## Guidelines

### 1. **Error Translation**

- Always translate external service errors to domain errors
- Map error codes to appropriate domain error types
- Provide context in error messages
- Preserve stack traces when useful

```typescript
try {
  await externalService.operation();
} catch (err: any) {
  switch (err.code) {
    case 'SERVICE_NOT_FOUND':
      throw new NotFoundError(err.message, { id }, err.stack);
    case 'SERVICE_UNAUTHORIZED':
      throw new UnauthorizedError(err.message, undefined, err.stack);
    case 'SERVICE_BAD_REQUEST':
      throw new BadRequestError(err.message, { data }, err.stack);
    default:
      throw new UnknownError(err.message, undefined, err.stack);
  }
}
```

### 2. **Type Safety**

- Return domain types, not external service types
- Use entity types when appropriate
- Export gateway type for use in context

```typescript
// Return domain entity, not external service type
const createUser = async (...): Promise<string> => {
  // Return user ID (string), not external service user object
};

// Export type for context
export type IAMGateway = ReturnType<typeof initIAMGateway>;
```

### 3. **Initialization**

- Accept `Config` as parameter
- Initialize external service clients
- Return object with all gateway methods
- Use factory pattern

```typescript
export const initIAMGateway = (config: Config) => {
  // Initialize client
  const client = initializeClient(config);

  // Return methods
  return {
    createUser,
    signIn,
    // ...
  };
};
```

### 4. **Configuration**

- Access configuration via parameter
- Don't import config directly
- Keep configuration structure consistent

## Common Patterns

### Authentication Gateway

```typescript
export const initIAMGateway = (config: Config) => {
  // Initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.credentials.clientEmail,
        privateKey: config.firebase.credentials.privateKey,
      }),
    });
  }

  const createUser = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<string> => {
    try {
      const user = await admin.auth().createUser({
        email,
        password,
        emailVerified: true,
        displayName,
      });
      return user.uid;
    } catch (err: any) {
      if (err.code === 'auth/email-already-exists') {
        throw new BadRequestError(err.message, { email }, err.stack);
      }
      throw new UnknownError(err.message, { email }, err.stack);
    }
  };

  const getAuthAndValidateToken = async (
    accessToken: string,
  ): Promise<AuthContext> => {
    try {
      const decodedToken = await admin.auth().verifyIdToken(accessToken);
      return {
        isAuthenticated: true,
        isImpersonating: false,
        externalId: decodedToken.uid,
      };
    } catch (err: any) {
      switch (err.code) {
        case 'auth/id-token-expired':
          throw new UnauthorizedError(
            'Access token expired',
            undefined,
            err.stack,
          );
        default:
          throw new UnknownError(err.message, undefined, err.stack);
      }
    }
  };

  return {
    createUser,
    getAuthAndValidateToken,
    // ... other methods
  };
};
```

### Email Gateway

```typescript
import { Config } from '../libs/config';
import { UnknownError } from '../entities/errors/unknown-error';
import { BadRequestError } from '../entities/errors/bad-request-error';

export const initEmailGateway = (config: Config) => {
  // Initialize email service client
  const emailClient = initializeEmailClient(config.email);

  const sendEmail = async (
    to: string,
    subject: string,
    body: string,
  ): Promise<void> => {
    try {
      await emailClient.send({
        to,
        subject,
        body,
      });
    } catch (err: any) {
      if (err.code === 'INVALID_EMAIL') {
        throw new BadRequestError(
          'Invalid email address',
          { email: to },
          err.stack,
        );
      }
      throw new UnknownError(err.message, { email: to }, err.stack);
    }
  };

  return {
    sendEmail,
  };
};

export type EmailGateway = ReturnType<typeof initEmailGateway>;
```

### Payment Gateway

```typescript
import { Config } from '../libs/config';
import { UnknownError } from '../entities/errors/unknown-error';
import { BadRequestError } from '../entities/errors/bad-request-error';
import { BusinessError } from '../entities/errors/business-error';

export const initPaymentGateway = (config: Config) => {
  const paymentClient = initializePaymentClient(config.payment);

  const processPayment = async (
    amount: number,
    currency: string,
    paymentMethodId: string,
  ): Promise<{ transactionId: string; status: string }> => {
    try {
      const result = await paymentClient.charge({
        amount,
        currency,
        paymentMethodId,
      });

      return {
        transactionId: result.id,
        status: result.status,
      };
    } catch (err: any) {
      if (err.code === 'INSUFFICIENT_FUNDS') {
        throw new BusinessError(
          'Insufficient funds',
          { amount, currency },
          err.stack,
        );
      }
      if (err.code === 'INVALID_PAYMENT_METHOD') {
        throw new BadRequestError(
          'Invalid payment method',
          { paymentMethodId },
          err.stack,
        );
      }
      throw new UnknownError(err.message, undefined, err.stack);
    }
  };

  return {
    processPayment,
  };
};

export type PaymentGateway = ReturnType<typeof initPaymentGateway>;
```

## Best Practices

### 1. **Error Handling**

- Always translate external errors to domain errors
- Provide context in error messages
- Preserve stack traces for debugging
- Use appropriate error types (NotFoundError, BadRequestError, etc.)

### 2. **Type Safety**

- Return domain types, not external service types
- Export gateway type for use in context
- Use TypeScript types consistently

### 3. **Initialization**

- Use factory pattern
- Accept config as parameter
- Initialize external clients once
- Return object with all methods

### 4. **Testing**

- Mock external service clients
- Test error translation
- Test all error cases
- Verify correct error types are thrown

### 5. **Separation of Concerns**

- Keep gateway focused on external service integration
- Don't include business logic (that's in use cases)
- Don't access repositories directly (use context)

## Creating a New Gateway

### Step-by-Step Example: Creating an Email Gateway

1. **Create gateway file (`email-gateway.ts`):**

   ```typescript
   import { Config } from '../libs/config';
   import { UnknownError } from '../entities/errors/unknown-error';
   import { BadRequestError } from '../entities/errors/bad-request-error';

   export const initEmailGateway = (config: Config) => {
     // Initialize email service
     const emailService = initializeEmailService(config.email);

     const sendEmail = async (
       to: string,
       subject: string,
       body: string,
     ): Promise<void> => {
       try {
         await emailService.send({ to, subject, body });
       } catch (err: any) {
         if (err.code === 'INVALID_EMAIL') {
           throw new BadRequestError('Invalid email', { email: to }, err.stack);
         }
         throw new UnknownError(err.message, { email: to }, err.stack);
       }
     };

     return {
       sendEmail,
     };
   };

   export type EmailGateway = ReturnType<typeof initEmailGateway>;
   ```

2. **Update Gateways type:**

   ```typescript
   // src/libs/context.ts
   import { EmailGateway } from '../gateways/email-gateway';

   export type Gateways = {
     iam: IAMGateway;
     email: EmailGateway;
   };
   ```

3. **Initialize and provide in context:**

   ```typescript
   // src/graphql/index.ts
   import { initEmailGateway } from '../gateways/email-gateway';

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
   // In use case
   await context.gateways.email.sendEmail(
     dentist.email,
     'Welcome!',
     'Welcome to our platform',
   );
   ```

## Error Translation Patterns

### Firebase Auth Errors

```typescript
switch (err.code) {
  case 'auth/user-not-found':
    throw new NotFoundError(err.message, { email }, err.stack);
  case 'auth/invalid-credential':
  case 'auth/wrong-password':
    throw new BadRequestError(err.message, { email }, err.stack);
  case 'auth/id-token-expired':
    throw new UnauthorizedError('Token expired', undefined, err.stack);
  default:
    throw new UnknownError(err.message, { email }, err.stack);
}
```

### HTTP API Errors

```typescript
if (response.status === 404) {
  throw new NotFoundError('Resource not found', { id }, err.stack);
}
if (response.status === 401) {
  throw new UnauthorizedError('Unauthorized', undefined, err.stack);
}
if (response.status === 400) {
  throw new BadRequestError('Bad request', { data }, err.stack);
}
throw new UnknownError('Unknown error', undefined, err.stack);
```

## Summary

- Gateways abstract external service integrations
- Translate external errors to domain errors
- Return domain types, not external service types
- Use factory pattern for initialization
- Provide clean interface for use cases
- Keep business logic out of gateways
- Test error translation thoroughly
