import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { ListFollowRequestsCommand } from '../ports/in/commands/list-follow-requests.command';
import { ListFollowRequestsUseCase } from '../ports/in/use-cases/list-follow-requests.use-case';
import { GetFollowRequestDto } from '../ports/out/dto/get-follow-request.dto';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';

@Injectable()
export class ListFollowRequestsService implements ListFollowRequestsUseCase {
	constructor(
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListFollowRequestsCommand,
	): Promise<Pagination<GetFollowRequestDto> | Array<GetFollowRequestDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if (
			command.from_user_id !== null &&
			command.from_user_id !== undefined
		) {
			const user = await this.userRepository.findById(
				command.from_user_id,
			);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError(`User not found`);
			}

			const isFollowing =
				(
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: user.id(),
					})
				).at(0) !== undefined;

			if (
				user.visibilityConfiguration().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowing
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}

			if (
				user.visibilityConfiguration().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}
		}

		if (command.to_user_id !== null && command.to_user_id !== undefined) {
			const user = await this.userRepository.findById(command.to_user_id);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError(`User not found`);
			}

			const isFollowing =
				(
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: user.id(),
					})
				).at(0) !== undefined;

			if (
				user.visibilityConfiguration().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowing
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}

			if (
				user.visibilityConfiguration().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}
		}

		const pagination = await this.followRepository.paginateRequest({
			filters: {
				fromUserId: command.from_user_id,
				toUserId: command.to_user_id,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			page: command.page,
			paginate: command.paginate,
			limit: command.limit,
		});

		const items = pagination.items.map((i) => {
			return new GetFollowRequestDto(
				i.id(),
				{
					id: i.from().id(),
					first_name: i.from().firstName(),
					last_name: i.from().lastName(),
					profile_theme_color: i.from().profileThemeColor(),
					profile_picture: i.from().profilePicture(),
					banner_picture: i.from().bannerPicture(),
					birth_date: i.from().birthDate(),
					credentials: { name: i.from().credentials().name() },
				},
				{
					id: i.to().id(),
					first_name: i.from().firstName(),
					last_name: i.from().lastName(),
					profile_theme_color: i.from().profileThemeColor(),
					profile_picture: i.to().profilePicture(),
					banner_picture: i.to().bannerPicture(),
					birth_date: i.to().birthDate(),
					credentials: { name: i.to().credentials().name() },
				},
				i.requestedOn(),
			);
		});

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}
