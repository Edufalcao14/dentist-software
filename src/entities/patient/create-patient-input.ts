export type CreatePatientInput = {
  email?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  phone_number?: string | null;
  cpf: string | null;
  birthdate: Date;
  civil_state?: string | null;
};
