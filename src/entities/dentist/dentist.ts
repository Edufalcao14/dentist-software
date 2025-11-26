export type DentistEntity = {
  id: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  email: string;
  cro_number: string;
  specialization: string;
  role: string;
  is_active: boolean;
  clinic_id: string | null;
  external_id: string | null;
};
