import { UserRole } from '../../../entities/user/user-role';

export type CreateUserData = {
  external_id?: string | null;
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  role: UserRole;
};

export type UpdateUserData = Partial<
  Omit<CreateUserData, 'role'> & {
    role?: UserRole;
  }
>;
