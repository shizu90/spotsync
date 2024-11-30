/*
  Warnings:

  - Added the required column `file_type` to the `spot_photos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_attachments" ALTER COLUMN "file_type" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "spot_photos" ADD COLUMN     "file_type" VARCHAR(20) NOT NULL;
