import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { UserDto } from '../../out/dto/user.dto';
import { ListUsersCommand } from '../commands/list-users.command';

export const ListUsersUseCaseProvider = 'ListUsersUseCase';

export interface ListUsersUseCase
	extends UseCase<
		ListUsersCommand,
		Promise<Pagination<UserDto> | Array<UserDto>>
	> {}
