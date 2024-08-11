/*
  Warnings:

  - You are about to drop the column `address_id` on the `Spot` table. All the data in the column will be lost.
  - The primary key for the `SpotAddress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SpotAddress` table. All the data in the column will be lost.
  - Added the required column `spot_id` to the `SpotAddress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Spot" DROP CONSTRAINT "Spot_address_id_fkey";

-- AlterTable
ALTER TABLE "Spot" DROP COLUMN "address_id";

-- AlterTable
ALTER TABLE "SpotAddress" DROP CONSTRAINT "SpotAddress_pkey",
DROP COLUMN "id",
ADD COLUMN     "spot_id" TEXT NOT NULL,
ADD CONSTRAINT "SpotAddress_pkey" PRIMARY KEY ("spot_id");

-- AddForeignKey
ALTER TABLE "SpotAddress" ADD CONSTRAINT "SpotAddress_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
