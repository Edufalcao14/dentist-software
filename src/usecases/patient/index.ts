import { createPatient } from './create-patient.logic';
import { registerPatient } from './register-patient.logic';
import { getPatientById } from './get-patient-by-id.logic';
import { getPatientByCpf } from './get-patient-by-cpf.logic';
import { getPatientByEmail } from './get-patient-by-email.logic';
import { getAllPatients } from './get-all-patients.logic';
import { updatePatient } from './update-patient.logic';
import { deletePatient } from './delete-patient.logic';

export const initPatientUsecases = () => {
  return {
    create: createPatient,
    register: registerPatient,
    getById: getPatientById,
    getByCpf: getPatientByCpf,
    getByEmail: getPatientByEmail,
    getAll: getAllPatients,
    update: updatePatient,
    delete: deletePatient,
  };
};

export type PatientUsecases = ReturnType<typeof initPatientUsecases>;
