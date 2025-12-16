import { UserEntity } from '../user/user';

export type PatientEntity = {
  id: string;
  user_id: string | null;
  user: UserEntity | null;
  cpf: string | null;
  birthdate: Date;
  civil_state: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
