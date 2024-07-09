/*
  Warnings:

  - You are about to drop the `UserVisibilityConfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVisibilityConfig" DROP CONSTRAINT "UserVisibilityConfig_user_id_fkey";

-- DropTable
DROP TABLE "UserVisibilityConfig";

-- CreateTable
CREATE TABLE "user_visibility_config" (
    "user_id" TEXT NOT NULL,
    "profile_visibility" TEXT NOT NULL,
    "address_visibility" TEXT NOT NULL,
    "poi_folder_visibility" TEXT NOT NULL,
    "visited_poi_visibility" TEXT NOT NULL,
    "post_visibility" TEXT NOT NULL,

    CONSTRAINT "user_visibility_config_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "user_visibility_config" ADD CONSTRAINT "user_visibility_config_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
