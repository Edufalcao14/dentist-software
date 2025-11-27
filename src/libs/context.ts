import Logger from 'bunyan';
import { Config } from './config';
import { Repositories } from '../repositories';
import { IAMGateway } from '../gateways/iam-gateway';

export type Gateways = {
  iam: IAMGateway;
};

export type AppContext = {
  config: Config;
  logger: Logger;
  repositories: Repositories;
  gateways: Gateways;
  auth: AuthContext;
};

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
