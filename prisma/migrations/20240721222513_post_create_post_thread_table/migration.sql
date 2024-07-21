/*
  Warnings:

  - You are about to drop the column `path` on the `post_attachments` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `post_attachments` table. All the data in the column will be lost.
  - Added the required column `file_path` to the `post_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_type` to the `post_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thread_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "post_attachments" DROP COLUMN "path",
DROP COLUMN "type",
ADD COLUMN     "file_path" TEXT NOT NULL,
ADD COLUMN     "file_type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "depth_level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "thread_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PostThread" (
    "id" TEXT NOT NULL,
    "max_depth_level" INTEGER NOT NULL DEFAULT 0,
    "post_root_id" TEXT NOT NULL,

    CONSTRAINT "PostThread_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostThread_post_root_id_key" ON "PostThread"("post_root_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "PostThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostThread" ADD CONSTRAINT "PostThread_post_root_id_fkey" FOREIGN KEY ("post_root_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
