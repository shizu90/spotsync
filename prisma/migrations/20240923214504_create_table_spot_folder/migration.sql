-- CreateTable
CREATE TABLE "spot_folders" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(400),
    "hex_color" VARCHAR(7) NOT NULL,
    "visibility" VARCHAR(12) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "spot_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_folder_items" (
    "spot_folder_id" TEXT NOT NULL,
    "spot_id" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order_number" INTEGER NOT NULL,

    CONSTRAINT "spot_folder_items_pkey" PRIMARY KEY ("spot_folder_id","spot_id")
);

-- AddForeignKey
ALTER TABLE "spot_folders" ADD CONSTRAINT "spot_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_folder_items" ADD CONSTRAINT "spot_folder_items_spot_folder_id_fkey" FOREIGN KEY ("spot_folder_id") REFERENCES "spot_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_folder_items" ADD CONSTRAINT "spot_folder_items_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
