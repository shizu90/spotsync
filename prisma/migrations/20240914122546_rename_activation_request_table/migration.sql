/*
  Warnings:

  - You are about to drop the `activation_request` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activation_request" DROP CONSTRAINT "activation_request_user_id_fkey";

-- DropTable
DROP TABLE "activation_request";

-- CreateTable
CREATE TABLE "activation_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" VARCHAR(8),
    "status" VARCHAR(3) NOT NULL,
    "subject" VARCHAR(20) NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activation_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activation_requests" ADD CONSTRAINT "activation_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
