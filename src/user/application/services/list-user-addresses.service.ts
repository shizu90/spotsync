import { Inject, Injectable } from '@nestjs/common';
import { ListUserAddressesUseCase } from '../ports/in/use-cases/list-user-addresses.use-case';
import {
  UserAddressRepository,
  UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';
import {
  UserRepository,
  UserRepositoryProvider,
} from '../ports/out/user.repository';
import { ListUserAddressesCommand } from '../ports/in/commands/list-user-addresses.command';
import { User } from 'src/user/domain/user.model';
import { UserNotFoundError } from './errors/user-not-found.error';
import { GetUserAddressDto } from '../ports/out/dto/get-user-address.dto';
import {
  GetAuthenticatedUserUseCase,
  GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/common.repository';

@Injectable()
export class ListUserAddressesService implements ListUserAddressesUseCase {
  constructor(
    @Inject(UserAddressRepositoryProvider)
    protected userAddressRepository: UserAddressRepository,
    @Inject(UserRepositoryProvider)
    protected userRepository: UserRepository,
    @Inject(GetAuthenticatedUserUseCaseProvider)
    protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
  ) {}

  public async execute(
    command: ListUserAddressesCommand,
  ): Promise<Pagination<GetUserAddressDto>> {
    const user: User = await this.userRepository.findById(command.userId);

    if (user === null || user === undefined || user.isDeleted()) {
      throw new UserNotFoundError(`User not found`);
    }

    if (user.id() !== this.getAuthenticatedUser.execute(null)) {
      throw new UnauthorizedAccessError(`Unauthorized access`);
    }

    const pagination = await this.userAddressRepository.paginate({
      filters: {
        userId: user.id(),
        name: command.name,
        main: command.main,
        isDeleted: false,
      },
      sort: command.sort,
      sortDirection: command.sortDirection,
      paginate: command.paginate,
      page: command.page,
      limit: command.limit,
    });

    const items = await Promise.all(
      pagination.items.map((ua) => {
        return new GetUserAddressDto(
          ua.id(),
          ua.name(),
          ua.area(),
          ua.subArea(),
          ua.locality(),
          ua.countryCode(),
          ua.latitude(),
          ua.longitude(),
          ua.main(),
          ua.createdAt(),
          ua.updatedAt(),
        );
      }),
    );

    return new Pagination(items, pagination.total, pagination.current_page);
  }
}
