/*
  Warnings:

  - Added the required column `notify_minutes` to the `spot_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "spot_events" ADD COLUMN     "notify_minutes" INTEGER NOT NULL;
