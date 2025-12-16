-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "external_id" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "firstname" VARCHAR(100) NOT NULL,
    "lastname" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_external_id_key" ON "User"("external_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Add user_id column to Dentist
ALTER TABLE "Dentist" ADD COLUMN "user_id" INTEGER NOT NULL;
CREATE UNIQUE INDEX "Dentist_user_id_key" ON "Dentist"("user_id");

-- AddForeignKey for Dentist
ALTER TABLE "Dentist" ADD CONSTRAINT "Dentist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Remove old columns from Dentist
ALTER TABLE "Dentist" DROP COLUMN "external_id";
ALTER TABLE "Dentist" DROP COLUMN "email";
ALTER TABLE "Dentist" DROP COLUMN "firstname";
ALTER TABLE "Dentist" DROP COLUMN "lastname";
ALTER TABLE "Dentist" DROP COLUMN "phone_number";

-- Add user_id column to Patient (nullable)
ALTER TABLE "Patient" ADD COLUMN "user_id" INTEGER;

-- AddForeignKey for Patient
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Remove old columns from Patient
ALTER TABLE "Patient" DROP COLUMN "national_id";
ALTER TABLE "Patient" DROP COLUMN "email_contact";
ALTER TABLE "Patient" DROP COLUMN "number_contact";
ALTER TABLE "Patient" DROP COLUMN "firstname";
ALTER TABLE "Patient" DROP COLUMN "lastname";

