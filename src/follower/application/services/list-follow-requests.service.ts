import { Inject, Injectable } from '@nestjs/common';
import { ListFollowRequestsUseCase } from '../ports/in/use-cases/list-follow-requests.use-case';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import {
	FollowRepository,
	FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { ListFollowRequestsCommand } from '../ports/in/commands/list-follow-requests.command';
import { Pagination } from 'src/common/common.repository';
import { GetFollowRequestDto } from '../ports/out/dto/get-follow-request.dto';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';

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
	): Promise<Pagination<GetFollowRequestDto>> {
		const authenticatedUserId = this.getAuthenticatedUser.execute(null);

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
						fromUserId: authenticatedUserId,
						toUserId: user.id(),
					})
				).at(0) !== undefined;

			if (
				user.visibilityConfiguration().profileVisibility() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUserId !== user.id() &&
				!isFollowing
			) {
				return new Pagination([], 0, 0);
			}

			if (
				user.visibilityConfiguration().profileVisibility() ===
					UserVisibility.PRIVATE &&
				authenticatedUserId !== user.id()
			) {
				return new Pagination([], 0, 0);
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
						fromUserId: authenticatedUserId,
						toUserId: user.id(),
					})
				).at(0) !== undefined;

			if (
				user.visibilityConfiguration().profileVisibility() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUserId !== user.id() &&
				!isFollowing
			) {
				return new Pagination([], 0, 0);
			}

			if (
				user.visibilityConfiguration().profileVisibility() ===
					UserVisibility.PRIVATE &&
				authenticatedUserId !== user.id()
			) {
				return new Pagination([], 0, 0);
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
					visibility_config: {
						address_visibility: i
							.from()
							.visibilityConfiguration()
							.addressVisibility(),
						poi_folder_visibility: i
							.from()
							.visibilityConfiguration()
							.poiFolderVisibility(),
						post_visibility: i
							.from()
							.visibilityConfiguration()
							.postVisibility(),
						profile_visibility: i
							.from()
							.visibilityConfiguration()
							.profileVisibility(),
						visited_poi_visibility: i
							.from()
							.visibilityConfiguration()
							.visitedPoiVisibility(),
					},
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
					visibility_config: {
						address_visibility: i
							.to()
							.visibilityConfiguration()
							.addressVisibility(),
						poi_folder_visibility: i
							.to()
							.visibilityConfiguration()
							.poiFolderVisibility(),
						post_visibility: i
							.to()
							.visibilityConfiguration()
							.postVisibility(),
						profile_visibility: i
							.to()
							.visibilityConfiguration()
							.profileVisibility(),
						visited_poi_visibility: i
							.to()
							.visibilityConfiguration()
							.visitedPoiVisibility(),
					},
				},
				i.requestedOn(),
			);
		});

		return new Pagination(items, 0, 0);
	}
}
