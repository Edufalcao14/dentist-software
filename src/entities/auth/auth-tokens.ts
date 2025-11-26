export interface AuthTokensEntity {
  accessToken: string;
  refreshToken: string;
  expiredAt: Date;
}
