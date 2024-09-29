/*
  Warnings:

  - You are about to drop the column `subject_id` on the `comments` table. All the data in the column will be lost.
  - Added the required column `spot_event_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spot_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "subject_id",
ADD COLUMN     "spot_event_id" TEXT NOT NULL,
ADD COLUMN     "spot_id" TEXT NOT NULL;
