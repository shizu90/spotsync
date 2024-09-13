/*
  Warnings:

  - You are about to alter the column `status` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `VarChar(3)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "status" SET DATA TYPE VARCHAR(3);

-- CreateTable
CREATE TABLE "activation_request" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" VARCHAR(8),
    "status" VARCHAR(3) NOT NULL,
    "subject" VARCHAR(20) NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activation_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activation_request" ADD CONSTRAINT "activation_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
