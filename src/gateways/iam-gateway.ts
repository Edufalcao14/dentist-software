import admin from 'firebase-admin';
import * as client from 'firebase/app';
import * as clientAuth from 'firebase/auth';
import { Config } from '../libs/config';
import { UnknownError } from '../entities/errors/unknown-error';
import { BadRequestError } from '../entities/errors/bad-request-error';
import { AuthTokensEntity } from '../entities/auth/auth-tokens';
import { NotFoundError } from '../entities/errors/not-found-error';
import { BusinessError } from '../entities/errors/business-error';
import { UnauthorizedError } from '../entities/errors/unauthorized-error';
import { AuthContext } from '../libs/context';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

type ImpersonateClaims =
  | {
      is_impersonating: true;
      target_user_id: string;
    }
  | {
      is_impersonating: false;
      target_user_id: null;
    };

export const initIAMGateway = (config: Config) => {
  // Init firebase admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.firebase.projectId,
        clientEmail: config.firebase.credentials.clientEmail,
        privateKey: config.firebase.credentials.privateKey,
      }),
    });
  }

  // Init firebase client
  const clientApp = client.initializeApp({
    apiKey: config.firebase.client.apiKey,
    authDomain: config.firebase.client.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.client.storageBucket,
    messagingSenderId: config.firebase.client.messagingSenderId,
    appId: config.firebase.client.appId,
  });

  const createUser = async (
    email: string,
    password: string,
    displayName?: string,
  ): Promise<string> => {
    try {
      const user = await admin.auth().createUser({
        email: email,
        password: password,
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

  const signIn = async (
    email: string,
    password: string,
  ): Promise<AuthTokensEntity> => {
    try {
      const auth = clientAuth.getAuth(clientApp);
      const { user } = await clientAuth.signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      if (!user.emailVerified) {
        throw new BadRequestError('Email not verified', { email });
      }

      const { token, expirationTime } = await user.getIdTokenResult();
      return {
        accessToken: token,
        refreshToken: user.refreshToken,
        expiredAt: new Date(expirationTime),
      };
    } catch (err: any) {
      if (err instanceof BusinessError) {
        throw err;
      }
      switch (err.code) {
        case 'auth/user-not-found':
          throw new NotFoundError(err.message, { email }, err.stack);
        case 'auth/invalid-credential':
          throw new BadRequestError(err.message, { email }, err.stack);
        case 'auth/invalid-email':
        case 'auth/wrong-password':
          throw new BadRequestError(err.message, { email }, err.stack);
        default:
          throw new UnknownError(err.message, { email }, err.stack);
      }
    }
  };

  const getAuthAndValidateToken = async (
    accessToken: string,
  ): Promise<AuthContext> => {
    try {
      const decodedToken = (await admin
        .auth()
        .verifyIdToken(accessToken)) as DecodedIdToken & ImpersonateClaims;
      if (decodedToken.is_impersonating) {
        return {
          isAuthenticated: true,
          isImpersonating: true,
          externalId: decodedToken.target_user_id,
          impersonatorExternalId: decodedToken.uid,
        };
      }

      return {
        isAuthenticated: true,
        isImpersonating: false,
        externalId: decodedToken.uid,
      };
    } catch (err: any) {
      switch (err.code) {
        case 'auth/argument-error':
          throw new BadRequestError(err.message, undefined, err.stack);
        case 'auth/id-token-expired':
          throw new UnauthorizedError(
            'Access token expired',
            undefined,
            err.stack,
          );
        case 'auth/id-token-revoked':
          throw new UnauthorizedError(
            'Access token revoked',
            undefined,
            err.stack,
          );
        default:
          throw new UnknownError(err.message, undefined, err.stack);
      }
    }
  };

  const _refreshToken = async (
    refreshToken: string,
  ): Promise<AuthTokensEntity> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${config.firebase.client.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      },
    );
    if (!response.ok) {
      const { error } = (await response.json()) as any;
      switch (error.message) {
        case 'MISSING_REFRESH_TOKEN':
          throw new BadRequestError(error.message);
        case 'USER_DISABLED':
        case 'TOKEN_EXPIRED':
        case 'INVALID_REFRESH_TOKEN':
          throw new UnauthorizedError(error.message);
        case 'USER_NOT_FOUND':
        case 'INVALID_GRANT':
        case 'INVALID_GRANT_TYPE':
        default:
          throw new UnknownError(error.message);
      }
    }

    const data = (await response.json()) as any;
    const { id_token, refresh_token, expires_in } = data;

    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + Number(expires_in));

    return {
      accessToken: id_token,
      refreshToken: refresh_token,
      expiredAt,
    };
  };

  const impersonateUser = async (
    auth: AuthContext,
    refreshToken: string,
    userId: string,
  ): Promise<AuthTokensEntity> => {
    if (!auth.isAuthenticated) {
      throw new UnauthorizedError('User not authenticated');
    }

    try {
      const claims: ImpersonateClaims = {
        is_impersonating: true,
        target_user_id: userId,
      };
      await admin.auth().setCustomUserClaims(auth.externalId, claims);
      return _refreshToken(refreshToken);
    } catch (err: any) {
      if (err instanceof BusinessError) {
        throw err;
      }
      switch (err.code) {
        default:
          throw new UnknownError(err.message, undefined, err.stack);
      }
    }
  };

  const stopImpersonatingUser = async (
    auth: AuthContext,
    refreshToken: string,
  ): Promise<AuthTokensEntity> => {
    if (!auth.isAuthenticated) {
      throw new UnauthorizedError('User not authenticated');
    }
    if (!auth.isImpersonating) {
      throw new UnauthorizedError('User not impersonating');
    }

    try {
      const claims: ImpersonateClaims = {
        is_impersonating: false,
        target_user_id: null,
      };
      await admin
        .auth()
        .setCustomUserClaims(auth.impersonatorExternalId, claims);
      return _refreshToken(refreshToken);
    } catch (err: any) {
      if (err instanceof BusinessError) {
        throw err;
      }
      switch (err.code) {
        default:
          throw new UnknownError(err.message, undefined, err.stack);
      }
    }
  };

  const updateUser = async (
    uid: string,
    updates: {
      email?: string;
      displayName?: string;
    },
  ): Promise<void> => {
    try {
      await admin.auth().updateUser(uid, {
        ...(updates.email && { email: updates.email }),
        ...(updates.displayName && { displayName: updates.displayName }),
      });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        throw new NotFoundError('Firebase user not found', { uid }, err.stack);
      }
      if (err.code === 'auth/email-already-exists') {
        throw new BadRequestError(
          err.message,
          { email: updates.email },
          err.stack,
        );
      }
      throw new UnknownError(err.message, { uid }, err.stack);
    }
  };

  return {
    createUser,
    signIn,
    getAuthAndValidateToken,
    refreshToken: _refreshToken,
    impersonateUser,
    stopImpersonatingUser,
    updateUser,
  };
};

export type IAMGateway = ReturnType<typeof initIAMGateway>;
