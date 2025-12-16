import { AppContext } from '../../libs/context';
import { UserEntity } from '../../entities/user/user';
import { UserRole } from '../../entities/user/user-role';
import { UnauthorizedError } from '../../entities/errors/unauthorized-error';

export const ensureDentistAccess = async (
  context: AppContext,
): Promise<UserEntity> => {
  if (!context.auth.isAuthenticated) {
    throw new UnauthorizedError('User must be authenticated');
  }

  const user = await context.repositories.user.getByExternalId(
    context.auth.externalId,
  );

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (user.role !== UserRole.DENTIST) {
    throw new UnauthorizedError('User is not a dentist');
  }

  return user;
};
