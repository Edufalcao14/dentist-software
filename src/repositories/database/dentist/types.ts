import { Prisma } from '@prisma/client';

export type CreateDentistData = Omit<
  Prisma.DentistUncheckedCreateInput,
  'clinic_id' | 'specialization' | 'role'
> & {
  clinic_id?: number | null;
  specialization?: string | null;
  role?: string | null;
};

export type UpdateDentistData = Omit<
  Prisma.DentistUncheckedUpdateInput,
  'specialization' | 'role' | 'clinic_id'
> & {
  specialization?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;
  role?: string | Prisma.NullableStringFieldUpdateOperationsInput | null;
  clinic_id?: number | Prisma.NullableIntFieldUpdateOperationsInput | null;
};
