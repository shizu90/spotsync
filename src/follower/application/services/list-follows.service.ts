import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import { FollowStatus } from 'src/follower/domain/follow-status.enum';
import {
	UserRepository,
	UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { ListFollowsCommand } from '../ports/in/commands/list-follows.command';
import { ListFollowsUseCase } from '../ports/in/use-cases/list-follows.use-case';
import { FollowDto } from '../ports/out/dto/follow.dto';
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
	): Promise<Pagination<FollowDto> | Array<FollowDto>> {
		const authenticatedUser = await this.getAuthenticatedUser.execute(null);

		if (
			command.from_user_id !== undefined &&
			command.from_user_id !== null
		) {
			const user = await this.userRepository.findById(
				command.from_user_id,
			);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError();
			}

			const isFollowingUser =
				(
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: user.id(),
						status: FollowStatus.ACTIVE,
					})
				).length > 0;

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError();
			}

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowingUser
			) {
				throw new UnauthorizedAccessError();
			}
		}

		if (command.to_user_id !== undefined && command.to_user_id !== null) {
			const user = await this.userRepository.findById(command.to_user_id);

			if (user === null || user === undefined || user.isDeleted()) {
				throw new UserNotFoundError();
			}

			const isFollowingUser =
				(
					await this.followRepository.findBy({
						fromUserId: authenticatedUser.id(),
						toUserId: user.id(),
						status: FollowStatus.ACTIVE,
					})
				).length > 0;

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.PRIVATE &&
				authenticatedUser.id() !== user.id()
			) {
				throw new UnauthorizedAccessError();
			}

			if (
				user.visibilitySettings().profile() ===
					UserVisibility.FOLLOWERS &&
				authenticatedUser.id() !== user.id() &&
				!isFollowingUser
			) {
				throw new UnauthorizedAccessError();
			}
		}

		const pagination = await this.followRepository.paginate({
			filters: {
				fromUserId: command.from_user_id,
				toUserId: command.to_user_id,
				status: command.status,
			},
			sort: command.sort,
			sortDirection: command.sortDirection,
			paginate: command.paginate,
			page: command.page,
			limit: command.limit,
		});

		const items = pagination.items.map((i) => {
			return FollowDto.fromModel(i);
		});

		if (!command.paginate) {
			return items;
		}

		return new Pagination(
			items,
			pagination.total,
			pagination.current_page,
			pagination.limit,
		);
	}
}
