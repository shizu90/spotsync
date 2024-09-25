import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { Likable } from 'src/like/domain/likable.interface';
import { PostRepository, PostRepositoryProvider } from 'src/post/application/ports/out/post.repository';
import { LikeCommand } from '../ports/in/commands/like.command';
import { LikeUseCase } from '../ports/in/use-cases/like.use-case';
import { LikeDto } from '../ports/out/dto/like.dto';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../ports/out/like.repository';
import { LikableNotFoundError } from './errors/likable-not-found.error';

@Injectable()
export class LikeService implements LikeUseCase {
	constructor(
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
		@Inject(PostRepositoryProvider)
		protected postRepository: PostRepository,
	) {}

	public async execute(command: LikeCommand): Promise<LikeDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		let likable: Likable = null;

		switch(command.subject) {
			case LikableSubject.POST:
				likable = await this.postRepository.findById(command.subjectId);
				break;
			default: break;
		}

		if (likable === null || likable === undefined) {
			throw new LikableNotFoundError();
		}

		const like = likable.like(authenticatedUser);

		await this.likeRepository.store(like);

		return new LikeDto(
			like.id(),
			like.likableSubject(),
			like.likable().id(),
		);
	}
}
