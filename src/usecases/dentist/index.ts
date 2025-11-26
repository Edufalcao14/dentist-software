import { createDentist } from './create-dentist';

import { getDentistById } from './get-dentist-by-id';

import { getAllDentists } from './get-all-dentists';

import { updateDentist } from './update-dentist';

import { deleteDentist } from './delete-dentist';

export const initDentistUsecases = () => {
  return {
    create: createDentist,
    getById: getDentistById,
    getAll: getAllDentists,
    update: updateDentist,
    delete: deleteDentist,
  };
};

export type DentistUsecases = ReturnType<typeof initDentistUsecases>;
