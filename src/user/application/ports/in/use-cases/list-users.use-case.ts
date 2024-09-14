import { Pagination } from 'src/common/core/common.repository';
import { UseCase } from 'src/common/core/common.use-case';
import { GetUserProfileDto } from '../../out/dto/get-user-profile.dto';
import { ListUsersCommand } from '../commands/list-users.command';

export const ListUsersUseCaseProvider = 'ListUsersUseCase';

export interface ListUsersUseCase
	extends UseCase<ListUsersCommand, Promise<Pagination<GetUserProfileDto> | Array<GetUserProfileDto>>> {}
