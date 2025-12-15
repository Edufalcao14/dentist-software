/*
  Warnings:

  - You are about to drop the `MedicalQuestionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PatientResponse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionnaireQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PatientResponse" DROP CONSTRAINT "PatientResponse_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "PatientResponse" DROP CONSTRAINT "PatientResponse_question_id_fkey";

-- DropForeignKey
ALTER TABLE "QuestionnaireQuestion" DROP CONSTRAINT "QuestionnaireQuestion_questionnaire_id_fkey";

-- DropTable
DROP TABLE "MedicalQuestionnaire";

-- DropTable
DROP TABLE "PatientResponse";

-- DropTable
DROP TABLE "QuestionnaireQuestion";

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalRecordRow" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MedicalRecordRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalRecord_patient_id_key" ON "MedicalRecord"("patient_id");

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecordRow" ADD CONSTRAINT "MedicalRecordRow_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
