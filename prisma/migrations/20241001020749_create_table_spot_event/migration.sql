-- CreateTable
CREATE TABLE "spot_events" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(400),
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(12) NOT NULL,
    "visibility" VARCHAR(12) NOT NULL,
    "spot_id" TEXT NOT NULL,
    "group_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spot_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spot_event_participants" (
    "spot_event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "spot_event_participants_pkey" PRIMARY KEY ("spot_event_id","user_id")
);

-- AddForeignKey
ALTER TABLE "spot_events" ADD CONSTRAINT "spot_events_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "spots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_events" ADD CONSTRAINT "spot_events_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_events" ADD CONSTRAINT "spot_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_event_participants" ADD CONSTRAINT "spot_event_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spot_event_participants" ADD CONSTRAINT "spot_event_participants_spot_event_id_fkey" FOREIGN KEY ("spot_event_id") REFERENCES "spot_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
