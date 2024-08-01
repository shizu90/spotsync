import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/common.repository';
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
	): Promise<Pagination<GetLikeDto>> {
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
					first_name: i.user().firstName(),
					last_name: i.user().lastName(),
					banner_picture: i.user().bannerPicture(),
					credentials: { name: i.user().credentials().name() },
					profile_picture: i.user().profilePicture(),
					profile_theme_color: i.user().profileThemeColor(),
				},
				i.createdAt(),
			);
		});

		return new Pagination(items, pagination.total, pagination.current_page);
	}
}