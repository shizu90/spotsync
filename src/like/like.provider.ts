import { Provider } from '@nestjs/common';
import { LikeUseCaseProvider } from './application/ports/in/use-cases/like.use-case';
import { UnlikeUseCaseProvider } from './application/ports/in/use-cases/unlike.use-case';
import { LikeRepositoryProvider } from './application/ports/out/like.repository';
import { LikeService } from './application/services/like.service';
import { UnlikeService } from './application/services/unlike.service';
import { LikeRepositoryImpl } from './infrastructure/adapters/out/like.db';

export const Providers: Provider[] = [
	{
		provide: LikeUseCaseProvider,
		useClass: LikeService,
	},
	{
		provide: UnlikeUseCaseProvider,
		useClass: UnlikeService,
	},
	{
		provide: LikeRepositoryProvider,
		useClass: LikeRepositoryImpl,
	},
];
