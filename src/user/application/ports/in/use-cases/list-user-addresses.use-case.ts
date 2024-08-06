import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetUserAddressDto } from '../../out/dto/get-user-address.dto';
import { ListUserAddressesCommand } from '../commands/list-user-addresses.command';

export const ListUserAddressesUseCaseProvider = 'ListUserAddressesUseCase';

export interface ListUserAddressesUseCase
	extends UseCase<
		ListUserAddressesCommand,
		Promise<Pagination<GetUserAddressDto>>
	> {}
