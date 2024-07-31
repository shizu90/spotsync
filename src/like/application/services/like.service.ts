import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Like } from 'src/like/domain/like.model';
import { LikeCommand } from '../ports/in/commands/like.command';
import { LikeUseCase } from '../ports/in/use-cases/like.use-case';
import { LikeDto } from '../ports/out/dto/like.dto';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../ports/out/like.repository';

@Injectable()
export class LikeService implements LikeUseCase {
	constructor(
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(command: LikeCommand): Promise<LikeDto> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const like = Like.create(
			randomUUID(),
			command.subject,
			command.subjectId,
			authenticatedUser,
		);

		await this.likeRepository.store(like);

		return new LikeDto(
			like.id(),
			like.likableSubject(),
			like.likableSubjectId(),
		);
	}
}
