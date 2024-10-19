/*
  Warnings:

  - Added the required column `subject` to the `ratings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ratings" ADD COLUMN     "subject" VARCHAR(120) NOT NULL;
