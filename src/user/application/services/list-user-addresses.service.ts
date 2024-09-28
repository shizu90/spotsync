import { Inject, Injectable } from '@nestjs/common';
import {
	GetAuthenticatedUserUseCase,
	GetAuthenticatedUserUseCaseProvider,
} from 'src/auth/application/ports/in/use-cases/get-authenticated-user.use-case';
import { UnauthorizedAccessError } from 'src/auth/application/services/errors/unauthorized-access.error';
import { Pagination } from 'src/common/core/common.repository';
import { ListUserAddressesCommand } from '../ports/in/commands/list-user-addresses.command';
import { ListUserAddressesUseCase } from '../ports/in/use-cases/list-user-addresses.use-case';
import { UserAddressDto } from '../ports/out/dto/user-address.dto';
import {
	UserAddressRepository,
	UserAddressRepositoryProvider,
} from '../ports/out/user-address.repository';

@Injectable()
export class ListUserAddressesService implements ListUserAddressesUseCase {
	constructor(
		@Inject(UserAddressRepositoryProvider)
		protected userAddressRepository: UserAddressRepository,
		@Inject(GetAuthenticatedUserUseCaseProvider)
		protected getAuthenticatedUser: GetAuthenticatedUserUseCase,
	) {}

	public async execute(
		command: ListUserAddressesCommand,
	): Promise<Pagination<UserAddressDto> | Array<UserAddressDto>> {
		const user = await this.getAuthenticatedUser.execute(null);

		if (command.userId !== user.id()) {
			throw new UnauthorizedAccessError();
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
				return UserAddressDto.fromModel(ua);
			}),
		);

		if (!command.paginate) {
			return items;
		}

		return new Pagination(items, pagination.total, pagination.current_page, pagination.limit);
	}
}
