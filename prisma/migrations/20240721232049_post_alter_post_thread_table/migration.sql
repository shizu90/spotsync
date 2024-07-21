/*
  Warnings:

  - You are about to drop the column `post_root_id` on the `post_threads` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_threads" DROP CONSTRAINT "post_threads_post_root_id_fkey";

-- DropIndex
DROP INDEX "post_threads_post_root_id_key";

-- AlterTable
ALTER TABLE "post_threads" DROP COLUMN "post_root_id";
