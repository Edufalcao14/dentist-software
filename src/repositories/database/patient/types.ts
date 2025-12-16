export type CreatePatientData = {
  user_id?: number | null;
  cpf: string | null;
  birthdate: Date;
  civil_state?: string | null;
};

export type UpdatePatientData = {
  cpf?: string | null;
  birthdate?: Date;
  civil_state?: string | null;
};
