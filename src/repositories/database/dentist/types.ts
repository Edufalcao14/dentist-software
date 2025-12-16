import { Prisma } from '@prisma/client';

export type CreateDentistData = {
  user_id: number;
  cro_number: string;
  specialization?: string | null;
  role?: string | null;
  is_active?: boolean;
  clinic_id?: number | null;
};

export type UpdateDentistData = {
  specialization?:
    | string
    | Prisma.NullableStringFieldUpdateOperationsInput
    | null;
  role?: string | Prisma.NullableStringFieldUpdateOperationsInput | null;
  is_active?: boolean;
  clinic_id?: number | Prisma.NullableIntFieldUpdateOperationsInput | null;
};
