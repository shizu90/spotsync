-- AlterTable
ALTER TABLE "follow" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "user_group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "group_picture" TEXT NOT NULL,
    "banner_picture" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group_visibility_config" (
    "user_group_id" TEXT NOT NULL,
    "post_visibility" TEXT NOT NULL,
    "event_visibility" TEXT NOT NULL,
    "group_visibility" TEXT NOT NULL,

    CONSTRAINT "user_group_visibility_config_pkey" PRIMARY KEY ("user_group_id")
);

-- CreateTable
CREATE TABLE "user_group_member" (
    "id" TEXT NOT NULL,
    "is_creator" BOOLEAN NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_group_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_group_role_id" TEXT NOT NULL,

    CONSTRAINT "user_group_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group_role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hex_color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "can_update" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_group_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_group_role_permission" (
    "user_group_role_id" TEXT NOT NULL,
    "user_group_permission_id" TEXT NOT NULL,

    CONSTRAINT "user_group_role_permission_pkey" PRIMARY KEY ("user_group_permission_id","user_group_role_id")
);

-- CreateTable
CREATE TABLE "user_group_permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_group_permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_group_visibility_config" ADD CONSTRAINT "user_group_visibility_config_user_group_id_fkey" FOREIGN KEY ("user_group_id") REFERENCES "user_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_member" ADD CONSTRAINT "user_group_member_user_group_id_fkey" FOREIGN KEY ("user_group_id") REFERENCES "user_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_member" ADD CONSTRAINT "user_group_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_member" ADD CONSTRAINT "user_group_member_user_group_role_id_fkey" FOREIGN KEY ("user_group_role_id") REFERENCES "user_group_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_role_permission" ADD CONSTRAINT "user_group_role_permission_user_group_role_id_fkey" FOREIGN KEY ("user_group_role_id") REFERENCES "user_group_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_group_role_permission" ADD CONSTRAINT "user_group_role_permission_user_group_permission_id_fkey" FOREIGN KEY ("user_group_permission_id") REFERENCES "user_group_permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
