-- CreateTable
CREATE TABLE "password_recoveries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" VARCHAR(3) NOT NULL,
    "token" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_recoveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "password_recoveries" ADD CONSTRAINT "password_recoveries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
