/*
  Warnings:

  - You are about to drop the column `subject_id` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `likable_id` on the `likes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "subject_id",
ADD COLUMN     "spot_event_id" TEXT,
ADD COLUMN     "spot_folder_id" TEXT,
ADD COLUMN     "spot_id" TEXT;

-- AlterTable
ALTER TABLE "likes" DROP COLUMN "likable_id",
ADD COLUMN     "comment_id" TEXT,
ADD COLUMN     "post_id" TEXT;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_spot_folder_id_fkey" FOREIGN KEY ("spot_folder_id") REFERENCES "spot_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
