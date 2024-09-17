/*
  Warnings:

  - You are about to drop the column `spot_id` on the `comments` table. All the data in the column will be lost.
  - Added the required column `subject_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_spot_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "spot_id",
ADD COLUMN     "subject_id" TEXT NOT NULL;
