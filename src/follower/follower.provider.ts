import { Provider } from "@nestjs/common";
import { FollowUseCaseProvider } from "./application/ports/in/use-cases/follow.use-case";
import { FollowService } from "./application/services/follow.service";
import { UnfollowUseCaseProvider } from "./application/ports/in/use-cases/unfollow.use-case";
import { UnfollowService } from "./application/services/unfollow.service";
import { FollowRepositoryProvider } from "./application/ports/out/follow.repository";
import { FollowRepositoryImpl } from "./infrastructure/adapters/out/follow.db";
import { AcceptFollowRequestUseCaseProvider } from "./application/ports/in/use-cases/accept-follow-request.use-case";
import { AcceptFollowRequestService } from "./application/services/accept-follow-request.service";
import { RefuseFollowRequestUseCaseProvider } from "./application/ports/in/use-cases/refuse-follow-request.use-case";
import { RefuseFollowRequestService } from "./application/services/refuse-follow-request.service";

export const Providers: Provider[] = [
    {
        provide: FollowUseCaseProvider,
        useClass: FollowService
    },
    {
        provide: UnfollowUseCaseProvider,
        useClass: UnfollowService
    },
    {
        provide: AcceptFollowRequestUseCaseProvider,
        useClass: AcceptFollowRequestService
    },
    {
        provide: RefuseFollowRequestUseCaseProvider,
        useClass: RefuseFollowRequestService
    },
    {
        provide: FollowRepositoryProvider,
        useClass: FollowRepositoryImpl
    }
];