import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/core/common.repository';
import { ListLikesCommand } from '../ports/in/commands/list-likes.command';
import { ListLikesUseCase } from '../ports/in/use-cases/list-likes.use-case';
import { GetLikeDto } from '../ports/out/dto/get-like.dto';
import {
	LikeRepository,
	LikeRepositoryProvider,
} from '../ports/out/like.repository';

@Injectable()
export class ListLikesService implements ListLikesUseCase {
	constructor(
		@Inject(LikeRepositoryProvider)
		protected likeRepository: LikeRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListLikesCommand,
	): Promise<Pagination<GetLikeDto> | Array<GetLikeDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		const pagination = await this.likeRepository.paginate({
			filters: {
				subject: command.subject,
				subjectId: command.subjectId,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			page: command.page,
			paginate: command.paginate,
			limit: command.limit,
		});

		const items = pagination.items.map((i) => {
			return new GetLikeDto(
				i.id(),
				i.likableSubject(),
				i.likableSubjectId(),
				{
					id: i.user().id(),
					display_name: i.user().profile().displayName(),
					banner_picture: i.user().profile().bannerPicture(),
					credentials: { name: i.user().credentials().name() },
					profile_picture: i.user().profile().profilePicture(),
					theme_color: i.user().profile().themeColor(),
				},
				i.createdAt(),
			);
		});

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}
