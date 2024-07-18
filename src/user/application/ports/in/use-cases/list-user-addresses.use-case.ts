import { UseCase } from 'src/common/common.use-case';
import { ListUserAddressesCommand } from '../commands/list-user-addresses.command';
import { GetUserAddressDto } from '../../out/dto/get-user-address.dto';
import { Pagination } from 'src/common/common.repository';

export const ListUserAddressesUseCaseProvider = 'ListUserAddressesUseCase';

export interface ListUserAddressesUseCase
	extends UseCase<
		ListUserAddressesCommand,
		Promise<Pagination<GetUserAddressDto>>
	> {}
