import { UseCase } from 'src/common/core/common.use-case';
import { GetUserProfileDto } from '../../out/dto/get-user-profile.dto';
import { GetUserProfileCommand } from '../commands/get-user-profile.command';

export const GetUserProfileUseCaseProvider = 'GetUserProfileUseCase';

export interface GetUserProfileUseCase
	extends UseCase<GetUserProfileCommand, Promise<GetUserProfileDto>> {}
