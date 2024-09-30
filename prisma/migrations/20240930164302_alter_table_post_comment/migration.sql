-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "total_likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "total_likes" INTEGER NOT NULL DEFAULT 0;
