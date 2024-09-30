import { Inject, Injectable } from '@nestjs/common';
import { GetAuthenticatedUserUseCase, GetAuthenticatedUserUseCaseProvider } from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import { LikeRepository, LikeRepositoryProvider } from 'src/like/application/ports/out/like.repository';
import { LikableSubject } from 'src/like/domain/likable-subject.enum';
import { ListCommentsCommand } from '../ports/in/commands/list-comments.command';
import { ListCommentsUseCase } from '../ports/in/use-cases/list-comments.use-case';
import {
	CommentRepository,
	CommentRepositoryProvider,
} from '../ports/out/comment.repository';
import { CommentDto } from '../ports/out/dto/comment.dto';

@Injectable()
export class ListCommentsService implements ListCommentsUseCase {
	constructor(
		@Inject(CommentRepositoryProvider)
		protected commentRepository: CommentRepository,
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListCommentsCommand,
	): Promise<Pagination<CommentDto> | Array<CommentDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const comments = await this.commentRepository.paginate({
			filters: {
				subject: command.subject,
				subjectId: command.subjectId,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			page: command.page,
			limit: command.limit,
			paginate: command.paginate,
		});

		const items = await Promise.all(comments.items.map(async (comment) => {
			const liked = (await this.likeRepository.findBy({
				subject: LikableSubject.COMMENT,
				subjectId: comment.id(),
				userId: authenticatedUser.id(),
			})).length > 0;

			return CommentDto.fromModel(comment)
				.setLiked(liked);
		}));

		if (command.paginate) {
			return new Pagination(
				items,
				comments.total,
				comments.current_page,
				comments.limit,
			);
		} else {
			return items;
		}
	}
}
