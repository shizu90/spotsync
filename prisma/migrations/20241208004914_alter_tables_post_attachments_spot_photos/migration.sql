/*
  Warnings:

  - You are about to drop the column `file_content` on the `post_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `file_content` on the `spot_photos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "post_attachments" DROP COLUMN "file_content";

-- AlterTable
ALTER TABLE "spot_photos" DROP COLUMN "file_content";
