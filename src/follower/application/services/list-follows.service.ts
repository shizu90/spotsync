import { Inject, Injectable } from '@nestjs/common';
import {
  FollowRepository,
  FollowRepositoryProvider,
} from '../ports/out/follow.repository';
import {
  GetAuthenticatedUserUseCase,
  GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { Pagination } from 'src/common/common.repository';
import {
  UserRepository,
  UserRepositoryProvider,
} from 'src/user/application/ports/out/user.repository';
import { UserNotFoundError } from 'src/user/application/services/errors/user-not-found.error';
import { UserVisibility } from 'src/user/domain/user-visibility.enum';
import { GetFollowDto } from '../ports/out/dto/get-follow.dto';
import { ListFollowsCommand } from '../ports/in/commands/list-follows.command';
import { ListFollowsUseCase } from '../ports/in/use-cases/list-follows.use-case';

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
    const authenticatedUserId = this.getAuthenticatedUser.execute(null);

    if (command.from_user_id !== undefined && command.from_user_id !== null) {
      const user = await this.userRepository.findById(command.from_user_id);

      if (user === null || user === undefined || user.isDeleted()) {
        throw new UserNotFoundError(`User not found`);
      }

      const isFollowingUser =
        (
          await this.followRepository.findBy({
            fromUserId: authenticatedUserId,
            toUserId: user.id(),
          })
        ).at(0) !== undefined;

      if (
        user.visibilityConfiguration().profileVisibility() ===
          UserVisibility.PRIVATE &&
        authenticatedUserId !== user.id()
      ) {
        return new Pagination([], 0, 0);
      }

      if (
        user.visibilityConfiguration().profileVisibility() ===
          UserVisibility.FOLLOWERS &&
        authenticatedUserId !== user.id() &&
        !isFollowingUser
      ) {
        return new Pagination([], 0, 0);
      }
    }

    if (command.tro_user_id !== undefined && command.tro_user_id !== null) {
      const user = await this.userRepository.findById(command.tro_user_id);

      if (user === null || user === undefined || user.isDeleted()) {
        throw new UserNotFoundError(`User not found`);
      }

      const isFollowingUser =
        (
          await this.followRepository.findBy({
            fromUserId: authenticatedUserId,
            toUserId: user.id(),
          })
        ).at(0) !== undefined;

      if (
        user.visibilityConfiguration().profileVisibility() ===
          UserVisibility.PRIVATE &&
        authenticatedUserId !== user.id()
      ) {
        return new Pagination([], 0, 0);
      }

      if (
        user.visibilityConfiguration().profileVisibility() ===
          UserVisibility.FOLLOWERS &&
        authenticatedUserId !== user.id() &&
        !isFollowingUser
      ) {
        return new Pagination([], 0, 0);
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
          profile_picture: i.from().profilePicture(),
          banner_picture: i.from().bannerPicture(),
          birth_date: i.from().birthDate(),
          credentials: { name: i.from().credentials().name() },
          visibility_config: {
            profile_visibility: i
              .from()
              .visibilityConfiguration()
              .profileVisibility(),
            poi_folder_visibility: i
              .from()
              .visibilityConfiguration()
              .poiFolderVisibility(),
            visited_poi_visibility: i
              .from()
              .visibilityConfiguration()
              .visitedPoiVisibility(),
            address_visibility: i
              .from()
              .visibilityConfiguration()
              .addressVisibility(),
            post_visibility: i
              .from()
              .visibilityConfiguration()
              .postVisibility(),
          },
        },
        {
          id: i.to().id(),
          profile_picture: i.to().profilePicture(),
          banner_picture: i.to().bannerPicture(),
          birth_date: i.to().birthDate(),
          credentials: { name: i.to().credentials().name() },
          visibility_config: {
            profile_visibility: i
              .to()
              .visibilityConfiguration()
              .profileVisibility(),
            poi_folder_visibility: i
              .to()
              .visibilityConfiguration()
              .poiFolderVisibility(),
            visited_poi_visibility: i
              .to()
              .visibilityConfiguration()
              .visitedPoiVisibility(),
            address_visibility: i
              .to()
              .visibilityConfiguration()
              .addressVisibility(),
            post_visibility: i.to().visibilityConfiguration().postVisibility(),
          },
        },
        i.followedAt(),
      );
    });

    return new Pagination(items, pagination.total, pagination.current_page);
  }
}
