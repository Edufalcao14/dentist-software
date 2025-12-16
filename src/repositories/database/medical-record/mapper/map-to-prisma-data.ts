import { Prisma } from '@prisma/client';
import { CreateMedicalRecordData, UpdateMedicalRecordData } from '../types';

export const mapToPrismaCreateData = (
  data: CreateMedicalRecordData,
): Prisma.MedicalRecordCreateInput => {
  return {
    patient: {
      connect: { id: data.patient_id },
    },
    rows: {
      create: data.rows.map((row) => ({
        question: row.question,
        answer: row.answer,
      })),
    },
  };
};

export const mapToPrismaUpdateData = (
  data: UpdateMedicalRecordData,
): Prisma.MedicalRecordUpdateInput => {
  const existingRows = data.rows.filter((row) => row.id !== undefined);
  const newRows = data.rows.filter((row) => row.id === undefined);

  return {
    rows: {
      ...(newRows.length > 0 && {
        create: newRows.map((row) => ({
          question: row.question,
          answer: row.answer,
        })),
      }),
      ...(existingRows.length > 0 && {
        update: existingRows.map((row) => ({
          where: { id: row.id },
          data: {
            question: row.question,
            answer: row.answer,
          },
        })),
      }),
    },
  };
};
