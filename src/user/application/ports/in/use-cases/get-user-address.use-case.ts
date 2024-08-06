import { UseCase } from 'src/common/core/common.use-case';
import { GetUserAddressDto } from '../../out/dto/get-user-address.dto';
import { GetUserAddressCommand } from '../commands/get-user-address.command';

export const GetUserAddressUseCaseProvider = 'GetUserAddressUseCase';

export interface GetUserAddressUseCase
	extends UseCase<GetUserAddressCommand, Promise<GetUserAddressDto>> {}
