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
import { ListFollowsCommand } from '../ports/in/commands/list-follows.command';
import { ListFollowsUseCase } from '../ports/in/use-cases/list-follows.use-case';
import { GetFollowDto } from '../ports/out/dto/get-follow.dto';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';

@Injectable()
export class ListFollowsService implements ListFollowsUseCase {
	constructor(
		@Inject(FollowRepositoryProvider)
		protected followRepository: FollowRepository,
		@Inject(UserRepositoryProvider)
		protected userRepository: UserRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListFollowsCommand,
	): Promise<Pagination<GetFollowDto> | Array<GetFollowDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if (
			command.from_user_id !== undefined &&
			command.from_user_id !== null
		) {
			const user = await this.userRepository.findById(
				command.from_user_id,
			);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError(`User not found`);
			}

			const isFollowingUser =
				(
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: user.id(),
					})
				).at(0) !== undefined;

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowingUser
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}
		}

		if (command.to_user_id !== undefined && command.to_user_id !== null) {
			const user = await this.userRepository.findById(
				command.to_user_id,
			);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError(`User not found`);
			}

			const isFollowingUser =
				(
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: user.id(),
					})
				).at(0) !== undefined;

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowingUser
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}
		}

		const pagination = await this.followRepository.paginate({
			filters: {
				fromUserId: command.from_user_id,
				toUserId: command.to_user_id,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			paginate: command.paginate,
			page: command.page,
			limit: command.limit,
		});

		const items = pagination.items.map((i) => {
			return new GetFollowDto(
				i.id(),
				{
					id: i.from().id(),
					display_name: i.from().profile().displayName(),
					theme_color: i.from().profile().themeColor(),
					profile_picture: i.from().profile().profilePicture(),
					banner_picture: i.from().profile().bannerPicture(),
					birth_date: i.from().profile().birthDate(),
					credentials: { name: i.from().credentials().name() },
				},
				{
					id: i.to().id(),
					display_name: i.to().profile().displayName(),
					theme_color: i.to().profile().themeColor(),
					profile_picture: i.to().profile().profilePicture(),
					banner_picture: i.to().profile().bannerPicture(),
					birth_date: i.to().profile().birthDate(),
					credentials: { name: i.to().credentials().name() },
				},
				i.followedAt(),
			);
		});

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}
