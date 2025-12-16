import { UserRole } from './user-role';

export type UserEntity = {
  id: string;
  external_id: string | null;
  email: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
