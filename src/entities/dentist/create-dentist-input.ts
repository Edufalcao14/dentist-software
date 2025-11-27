export type CreateDentistInput = {
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  password: string;
  cro_number: string;
  specialization: string | null;
  role: string | null;
  is_active: boolean;
  clinic_id?: string | null;
};
