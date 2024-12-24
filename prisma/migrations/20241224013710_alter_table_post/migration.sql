/*
  Warnings:

  - You are about to drop the column `total_likes` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `total_likes` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "total_likes";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "total_likes";
