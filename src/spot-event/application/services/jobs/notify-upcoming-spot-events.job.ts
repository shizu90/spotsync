import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import * as moment from "moment";
import { CreateNotificationCommand } from "src/notification/application/ports/in/commands/create-notification.command";
import { CreateNotificationUseCase, CreateNotificationUseCaseProvider } from "src/notification/application/ports/in/use-cases/create-notification.use-case";
import { NotificationType } from "src/notification/domain/notification-type.enum";
import { NotificationPayload, NotificationPayloadSubject } from "src/notification/domain/notification.model";
import { SpotEventRepository, SpotEventRepositoryProvider } from "src/spot-event/application/ports/out/spot-event.repository";
import { SpotEventStatus } from "src/spot-event/domain/spot-event-status.enum";

@Injectable()
export class NotifyUpcomingSpotEventsJob {
    private logger = new Logger(NotifyUpcomingSpotEventsJob.name);

    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(CreateNotificationUseCaseProvider)
        protected createNotificationUseCase: CreateNotificationUseCase,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    public async handle() {
        this.logger.log('Checking for upcoming spot events');

        try {
            const upcomingSpotEvents = await this.spotEventRepository.findBy({
                status: SpotEventStatus.SCHEDULED,
            });

            const now = moment();

            for (const spotEvent of upcomingSpotEvents) {
                const startDate = moment(spotEvent.startDate());
                const diff = startDate.diff(now, 'minutes');

                if (diff <= spotEvent.notifyMinutes()) {
                    if (diff <= 0) {
                        spotEvent.start();
                        await this.spotEventRepository.update(spotEvent);
                    }
                    
                    const participants = spotEvent.participants();

                    for (const participant of participants) {
                        await this.createNotificationUseCase.execute(new CreateNotificationCommand(
                            `Upcoming spot event`,
                            `Spot event ${spotEvent.name()} is about to start.`,
                            NotificationType.UPCOMING_SPOT_EVENT,
                            participant.user().id(),
                            new NotificationPayload(
                                NotificationPayloadSubject.SPOT_EVENT,
                                spotEvent.id(),
                            )
                        ));
                    }
                }
            }

            this.logger.log('Upcoming spot events checked');
        } catch (error) {
            this.logger.error(error);
        }
    }
}