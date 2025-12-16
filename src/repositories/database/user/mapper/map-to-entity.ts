import { User } from '@prisma/client';
import { UserEntity } from '../../../../entities/user/user';
import { UserRole } from '../../../../entities/user/user-role';

export const mapToEntity = (user: User): UserEntity => {
  return {
    id: user.id.toString(),
    external_id: user.external_id ?? null,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    phone_number: user.phone_number,
    role: user.role as UserRole,
    created_at: user.created_at,
    updated_at: user.updated_at,
    deleted_at: user.deleted_at ?? null,
  };
};
