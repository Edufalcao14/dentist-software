import { createDentist } from './create-dentist.logic';

import { getDentistById } from './get-dentist-by-id.logic';

import { getDentistByEmail } from './get-dentist-by-email.logic';

import { getAllDentists } from './get-all-dentists.logic';

import { updateDentist } from './update-dentist.logic';

import { deleteDentist } from './delete-dentist.logic';

export const initDentistUsecases = () => {
  return {
    create: createDentist,
    getById: getDentistById,
    getByEmail: getDentistByEmail,
    getAll: getAllDentists,
    update: updateDentist,
    delete: deleteDentist,
  };
};

export type DentistUsecases = ReturnType<typeof initDentistUsecases>;
