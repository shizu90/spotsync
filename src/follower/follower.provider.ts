import { Provider } from "@nestjs/common";
import { FollowUseCaseProvider } from "./application/ports/in/use-cases/follow.use-case";
import { FollowService } from "./application/services/follow.service";
import { UnfollowUseCaseProvider } from "./application/ports/in/use-cases/unfollow.use-case";
import { UnfollowService } from "./application/services/unfollow.service";
import { FollowRepositoryProvider } from "./application/ports/out/follow.repository";
import { FollowRepositoryImpl } from "./infrastructure/adapters/out/follow.db";

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
        provide: FollowRepositoryProvider,
        useClass: FollowRepositoryImpl
    }
];