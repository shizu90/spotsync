import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/common.repository';
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
	): Promise<Pagination<GetFollowDto>> {
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
				user.visibilityConfiguration().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}

			if (
				user.visibilityConfiguration().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowingUser
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}
		}

		if (command.tro_user_id !== undefined && command.tro_user_id !== null) {
			const user = await this.userRepository.findById(
				command.tro_user_id,
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
				user.visibilityConfiguration().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError(`Unauthorized access`);
			}

			if (
				user.visibilityConfiguration().profile() ===
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
				toUserId: command.tro_user_id,
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
				i.followedAt(),
			);
		});

		return new Pagination(items, pagination.total, pagination.current_page);
	}
}
