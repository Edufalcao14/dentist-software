import { Prisma } from '@prisma/client';

export type CreateDentistData = Omit<
  Prisma.DentistUncheckedCreateInput,
  'clinic_id'
> & {
  clinic_id?: number;
};

export type UpdateDentistData = Prisma.DentistUncheckedUpdateInput;

