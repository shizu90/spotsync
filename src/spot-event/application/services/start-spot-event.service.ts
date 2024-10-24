import { Inject, Injectable } from "@nestjs/common";
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from "src/auth/application/ports/in/use-cases/get-authenticated-user.use-case";
import { UnauthorizedAccessError } from "src/auth/application/services/errors/unauthorized-access.error";
import { CreateNotificationCommand } from "src/notification/application/ports/in/commands/create-notification.command";
import { CreateNotificationUseCase, CreateNotificationUseCaseProvider } from "src/notification/application/ports/in/use-cases/create-notification.use-case";
import { NotificationType } from "src/notification/domain/notification-type.enum";
import { NotificationPayload, NotificationPayloadSubject } from "src/notification/domain/notification.model";
import { StartSpotEventCommand } from "../ports/in/commands/start-spot-event.command";
import { StartSpotEventUseCase } from "../ports/in/use-cases/start-spot-event.use-case";
import { SpotEventRepository, SpotEventRepositoryProvider } from "../ports/out/spot-event.repository";
import { SpotEventNotFoundError } from "./errors/spot-event-not-found.error";
import { SpotEventHasStartedError } from "./errors/spot-event-started.error";

@Injectable()
export class StartSpotEventService implements StartSpotEventUseCase {
    constructor(
        @Inject(SpotEventRepositoryProvider)
        protected spotEventRepository: SpotEventRepository,
        @Inject(GetAuthenticatedUserUseCaseProvider)
        protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
        @Inject(CreateNotificationUseCaseProvider)
        protected createNotificationUseCase: CreateNotificationUseCase,
    ) {}

    public async execute(command: StartSpotEventCommand): Promise<void> {
        const authenticatedUser = await this.getAuthenticatedUser.execute(null);

        const spotEvent = await this.spotEventRepository.findById(command.id);

        if (!spotEvent) {
            throw new SpotEventNotFoundError();
        }

        if (spotEvent.creator().id() != authenticatedUser.id()) {
            throw new UnauthorizedAccessError();
        }

        if (!spotEvent.isScheduled()) {
            throw new SpotEventHasStartedError();
        }

        spotEvent.start();

        const participants = spotEvent.participants().filter(participant => participant.user().id() != authenticatedUser.id());

        for (const participant of participants) {
            await this.createNotificationUseCase.execute(new CreateNotificationCommand(
                `Spot event started`,
                `Spot event ${spotEvent.name()} has started.`,
                NotificationType.SPOT_EVENT_STARTED,
                participant.user().id(),
                new NotificationPayload(
                    NotificationPayloadSubject.SPOT_EVENT,
                    spotEvent.id(),
                )
            ))
        }

        await this.spotEventRepository.update(spotEvent);
    }
}