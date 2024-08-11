-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "creator_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotPhoto" (
    "id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "SpotPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotAddress" (
    "id" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "sub_area" TEXT NOT NULL,
    "locality" TEXT,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "country_code" TEXT NOT NULL,

    CONSTRAINT "SpotAddress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "SpotAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotPhoto" ADD CONSTRAINT "SpotPhoto_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "Spot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
