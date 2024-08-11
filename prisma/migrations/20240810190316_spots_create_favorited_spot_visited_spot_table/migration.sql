/*
  Warnings:

  - You are about to drop the `Spot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpotAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SpotPhoto` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Spot" DROP CONSTRAINT "Spot_creator_id_fkey";

-- DropForeignKey
ALTER TABLE "SpotAddress" DROP CONSTRAINT "SpotAddress_spot_id_fkey";

-- DropForeignKey
ALTER TABLE "SpotPhoto" DROP CONSTRAINT "SpotPhoto_spot_id_fkey";

-- DropTable
DROP TABLE "Spot";

-- DropTable
DROP TABLE "SpotAddress";

-- DropTable
DROP TABLE "SpotPhoto";

-- CreateTable
CREATE TABLE "spots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_photos" (
    "id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "spot_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_addresses" (
    "spot_id" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "sub_area" TEXT NOT NULL,
    "locality" TEXT,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "country_code" TEXT NOT NULL,

    CONSTRAINT "spot_addresses_pkey" PRIMARY KEY ("spot_id")
);

-- CreateTable
CREATE TABLE "favorited_spots" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "favorited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorited_spots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visited_spots" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "visited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visited_spots_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_photos" ADD CONSTRAINT "spot_photos_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_addresses" ADD CONSTRAINT "spot_addresses_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorited_spots" ADD CONSTRAINT "favorited_spots_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorited_spots" ADD CONSTRAINT "favorited_spots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_spots" ADD CONSTRAINT "visited_spots_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visited_spots" ADD CONSTRAINT "visited_spots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
