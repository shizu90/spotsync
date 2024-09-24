-- CreateTable
CREATE TABLE "favorited_spot_folders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "spot_folder_id" TEXT NOT NULL,
    "favorited_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorited_spot_folders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorited_spot_folders" ADD CONSTRAINT "favorited_spot_folders_spot_folder_id_fkey" FOREIGN KEY ("spot_folder_id") REFERENCES "spot_folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorited_spot_folders" ADD CONSTRAINT "favorited_spot_folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
