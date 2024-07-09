/*
  Warnings:

  - You are about to drop the column `profile_visibility` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "profile_visibility";

-- CreateTable
CREATE TABLE "UserVisibilityConfig" (
    "user_id" TEXT NOT NULL,
    "profile_visibility" TEXT NOT NULL,
    "address_visibility" TEXT NOT NULL,
    "poi_folder_visibility" TEXT NOT NULL,
    "visited_poi_visibility" TEXT NOT NULL,
    "post_visibility" TEXT NOT NULL,

    CONSTRAINT "UserVisibilityConfig_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "UserVisibilityConfig" ADD CONSTRAINT "UserVisibilityConfig_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
