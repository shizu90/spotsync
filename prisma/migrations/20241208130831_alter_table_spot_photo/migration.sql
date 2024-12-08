/*
  Warnings:

  - You are about to drop the `spot_photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "spot_photos" DROP CONSTRAINT "spot_photos_spot_id_fkey";

-- DropTable
DROP TABLE "spot_photos";

-- CreateTable
CREATE TABLE "spot_attachments" (
    "id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_type" VARCHAR(20) NOT NULL,

    CONSTRAINT "spot_attachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "spot_attachments" ADD CONSTRAINT "spot_attachments_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
