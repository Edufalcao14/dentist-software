import { UserEntity } from './user';

export type AuthPayload = {
  refreshToken: string;
  accessToken: string;
  user: UserEntity;
};
