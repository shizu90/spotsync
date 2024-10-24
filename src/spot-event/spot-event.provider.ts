import { Provider } from "@nestjs/common";
import { CancelSpotEventUseCaseProvider } from "./application/ports/in/use-cases/cancel-spot-event.use-case";
import { CreateSpotEventUseCaseProvider } from "./application/ports/in/use-cases/create-spot-event.use-case";
import { DeleteSpotEventUseCaseProvider } from "./application/ports/in/use-cases/delete-spot-event.use-case";
import { EndSpotEventUseCaseProvider } from "./application/ports/in/use-cases/end-spot-event.use-case";
import { GetSpotEventUseCaseProvider } from "./application/ports/in/use-cases/get-spot-event.use-case";
import { ListSpotEventsUseCaseProvider } from "./application/ports/in/use-cases/list-spot-events.use-case";
import { ParticipateUseCaseProvider } from "./application/ports/in/use-cases/participate.command";
import { RemoveParticipationUseCaseProvider } from "./application/ports/in/use-cases/remove-participation.use-case";
import { StartSpotEventUseCaseProvider } from "./application/ports/in/use-cases/start-spot-event.use-case";
import { UpdateSpotEventUseCaseProvider } from "./application/ports/in/use-cases/update-spot-event.use-case";
import { SpotEventRepositoryProvider } from "./application/ports/out/spot-event.repository";
import { CancelSpotEventService } from "./application/services/cancel-spot-event.service";
import { CreateSpotEventService } from "./application/services/create-spot-event.service";
import { DeleteSpotEventService } from "./application/services/delete-spot-event.service";
import { EndSpotEventService } from "./application/services/end-spot-event.service";
import { GetSpotEventService } from "./application/services/get-spot-event.service";
import { NotifyUpcomingSpotEventsJob } from "./application/services/jobs/notify-upcoming-spot-events.job";
import { ListSpotEventsService } from "./application/services/list-spot-events.service";
import { ParticipateService } from "./application/services/participate.service";
import { RemoveParticipationService } from "./application/services/remove-participation.service";
import { StartSpotEventService } from "./application/services/start-spot-event.service";
import { UpdateSpotEventService } from "./application/services/update-spot-event.service";
import { SpotEventRepositoryImpl } from "./infrastructure/adapters/out/spot-event.db";

export const Providers: Provider[] = [
    {
        provide: ListSpotEventsUseCaseProvider,
        useClass: ListSpotEventsService,
    },
    {
        provide: GetSpotEventUseCaseProvider,
        useClass: GetSpotEventService,
    },
    {
        provide: CreateSpotEventUseCaseProvider,
        useClass: CreateSpotEventService,
    },
    {
        provide: UpdateSpotEventUseCaseProvider,
        useClass: UpdateSpotEventService,
    },
    {
        provide: StartSpotEventUseCaseProvider,
        useClass: StartSpotEventService
    },
    {
        provide: EndSpotEventUseCaseProvider,
        useClass: EndSpotEventService
    },
    {
        provide: ParticipateUseCaseProvider,
        useClass: ParticipateService,
    },
    {
        provide: RemoveParticipationUseCaseProvider,
        useClass: RemoveParticipationService,
    },
    {
        provide: CancelSpotEventUseCaseProvider,
        useClass: CancelSpotEventService
    },
    {
        provide: DeleteSpotEventUseCaseProvider,
        useClass: DeleteSpotEventService,
    },
    {
        provide: SpotEventRepositoryProvider,
        useClass: SpotEventRepositoryImpl
    },
    {
        provide: NotifyUpcomingSpotEventsJob,
        useClass: NotifyUpcomingSpotEventsJob,
    }
];