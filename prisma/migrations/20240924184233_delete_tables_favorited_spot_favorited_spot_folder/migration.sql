/*
  Warnings:

  - You are about to drop the `favorited_spot_folders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorited_spots` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "favorited_spot_folders" DROP CONSTRAINT "favorited_spot_folders_spot_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "favorited_spot_folders" DROP CONSTRAINT "favorited_spot_folders_user_id_fkey";

-- DropForeignKey
ALTER TABLE "favorited_spots" DROP CONSTRAINT "favorited_spots_spot_id_fkey";

-- DropForeignKey
ALTER TABLE "favorited_spots" DROP CONSTRAINT "favorited_spots_user_id_fkey";

-- DropTable
DROP TABLE "favorited_spot_folders";

-- DropTable
DROP TABLE "favorited_spots";

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "subject" VARCHAR(120) NOT NULL,
    "subject_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
