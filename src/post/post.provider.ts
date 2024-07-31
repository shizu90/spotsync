import { Provider } from '@nestjs/common';
import { CreatePostUseCaseProvider } from './application/ports/in/use-cases/create-post.use-case';
import { DeletePostUseCaseProvider } from './application/ports/in/use-cases/delete-post.use-case';
import { GetPostUseCaseProvider } from './application/ports/in/use-cases/get-post.use-case';
import { ListThreadsUseCaseProvider } from './application/ports/in/use-cases/list-threads.use-case';
import { UpdatePostUseCaseProvider } from './application/ports/in/use-cases/update-post.use-case';
import { PostThreadRepositoryProvider } from './application/ports/out/post-thread.repository';
import { PostRepositoryProvider } from './application/ports/out/post.repository';
import { CreatePostService } from './application/services/create-post.service';
import { DeletePostService } from './application/services/delete-post.service';
import { GetPostService } from './application/services/get-post.service';
import { ListThreadsService } from './application/services/list-threads.service';
import { UpdatePostService } from './application/services/update-post.service';
import { PostThreadRepositoryImpl } from './infrastructure/adapters/out/post-thread.db';
import { PostRepositoryImpl } from './infrastructure/adapters/out/post.db';

export const Providers: Provider[] = [
	{
		provide: CreatePostUseCaseProvider,
		useClass: CreatePostService,
	},
	{
		provide: UpdatePostUseCaseProvider,
		useClass: UpdatePostService,
	},
	{
		provide: DeletePostUseCaseProvider,
		useClass: DeletePostService,
	},
	{
		provide: ListThreadsUseCaseProvider,
		useClass: ListThreadsService,
	},
	{
		provide: GetPostUseCaseProvider,
		useClass: GetPostService,
	},
	{
		provide: PostRepositoryProvider,
		useClass: PostRepositoryImpl,
	},
	{
		provide: PostThreadRepositoryProvider,
		useClass: PostThreadRepositoryImpl,
	},
];
