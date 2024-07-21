/*
  Warnings:

  - You are about to drop the `PostThread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostThread" DROP CONSTRAINT "PostThread_post_root_id_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_thread_id_fkey";

-- DropTable
DROP TABLE "PostThread";

-- CreateTable
CREATE TABLE "post_threads" (
    "id" TEXT NOT NULL,
    "max_depth_level" INTEGER NOT NULL DEFAULT 0,
    "post_root_id" TEXT NOT NULL,

    CONSTRAINT "post_threads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "post_threads_post_root_id_key" ON "post_threads"("post_root_id");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "post_threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_threads" ADD CONSTRAINT "post_threads_post_root_id_fkey" FOREIGN KEY ("post_root_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
