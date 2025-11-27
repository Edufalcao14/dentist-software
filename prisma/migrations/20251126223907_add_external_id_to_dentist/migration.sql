/*
  Warnings:

  - A unique constraint covering the columns `[external_id]` on the table `Dentist` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Dentist" ADD COLUMN     "external_id" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "Dentist_external_id_key" ON "Dentist"("external_id");
