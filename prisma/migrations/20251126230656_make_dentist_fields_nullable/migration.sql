-- DropForeignKey
ALTER TABLE "Dentist" DROP CONSTRAINT "Dentist_clinic_id_fkey";

-- AlterTable
ALTER TABLE "Dentist" ALTER COLUMN "specialization" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "clinic_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Dentist" ADD CONSTRAINT "Dentist_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
