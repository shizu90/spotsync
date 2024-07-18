-- CreateTable
CREATE TABLE "GroupLog" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GroupLog" ADD CONSTRAINT "GroupLog_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
