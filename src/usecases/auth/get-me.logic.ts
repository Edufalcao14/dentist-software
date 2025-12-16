import { AppContext } from '../../libs/context';
import { MeEntity } from '../../entities/auth/me';
import { UnauthorizedError } from '../../entities/errors/unauthorized-error';
import { NotFoundError } from '../../entities/errors/not-found-error';
import { UserRole } from '../../entities/user/user-role';

export const getMe = async (ctx: AppContext): Promise<MeEntity> => {
  if (!ctx.auth.isAuthenticated) {
    throw new UnauthorizedError("L'utilisateur n'est pas authentifié");
  }

  const user = await ctx.repositories.user.getByExternalId(ctx.auth.externalId);

  if (!user)
    throw new NotFoundError(
      "Aucun utilisateur trouvé avec l'ID externe fourni.",
    );

  if (user.deleted_at !== null) {
    throw new UnauthorizedError('Le compte utilisateur a été désactivé');
  }

  const meEntity: MeEntity = {
    id: user.id,
    displayName: `${user.firstname} ${user.lastname}`,
    email: user.email,
    externalId: ctx.auth.externalId,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
    deletedAt: user.deleted_at,
    teamId: null, // Assuming no team field in current UserEntity
  };

  // Check if user is a dentist or patient and include the respective entity
  if (user.role === UserRole.DENTIST) {
    const dentist = await ctx.repositories.dentist.getByUserId(user.id);
    if (dentist) {
      meEntity.dentist = dentist;
    }
  } else if (user.role === UserRole.PATIENT) {
    const patient = await ctx.repositories.patient.getByUserId(user.id);
    if (patient) {
      meEntity.patient = patient;
    }
  }

  return meEntity;
};
