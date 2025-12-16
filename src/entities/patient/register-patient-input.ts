export type RegisterPatientInput = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  phone_number: string;
  cpf: string;
  birthdate: Date;
  civil_state: string | null;
};
