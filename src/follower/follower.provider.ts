import { Provider } from '@nestjs/common';
import { AcceptFollowRequestUseCaseProvider } from './application/ports/in/use-cases/accept-follow-request.use-case';
import { FollowUseCaseProvider } from './application/ports/in/use-cases/follow.use-case';
import { ListFollowsUseCaseProvider } from './application/ports/in/use-cases/list-follows.use-case';
import { RefuseFollowRequestUseCaseProvider } from './application/ports/in/use-cases/refuse-follow-request.use-case';
import { UnfollowUseCaseProvider } from './application/ports/in/use-cases/unfollow.use-case';
import { FollowRepositoryProvider } from './application/ports/out/follow.repository';
import { AcceptFollowRequestService } from './application/services/accept-follow-request.service';
import { FollowService } from './application/services/follow.service';
import { ListFollowsService } from './application/services/list-follows.service';
import { RefuseFollowRequestService } from './application/services/refuse-follow-request.service';
import { UnfollowService } from './application/services/unfollow.service';
import { FollowRepositoryImpl } from './infrastructure/adapters/out/follow.db';

export const Providers: Provider[] = [
	{
		provide: FollowUseCaseProvider,
		useClass: FollowService,
	},
	{
		provide: UnfollowUseCaseProvider,
		useClass: UnfollowService,
	},
	{
		provide: AcceptFollowRequestUseCaseProvider,
		useClass: AcceptFollowRequestService,
	},
	{
		provide: RefuseFollowRequestUseCaseProvider,
		useClass: RefuseFollowRequestService,
	},
	{
		provide: ListFollowsUseCaseProvider,
		useClass: ListFollowsService,
	},
	{
		provide: FollowRepositoryProvider,
		useClass: FollowRepositoryImpl,
	},
];
