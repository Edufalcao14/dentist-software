import { PrismaClient } from '@prisma/client';

export const initDeleteMedicalRecordRowRepository = (db: PrismaClient) => {
  return async (id: number): Promise<void> => {
    await db.medicalRecordRow.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  };
};
