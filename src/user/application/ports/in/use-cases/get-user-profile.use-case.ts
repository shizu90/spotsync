import { UseCase } from 'src/common/common.use-case';
import { GetUserProfileCommand } from '../commands/get-user-profile.command';
import { GetUserProfileDto } from '../../out/dto/get-user-profile.dto';

export const GetUserProfileUseCaseProvider = 'GetUserProfileUseCase';

export interface GetUserProfileUseCase
  extends UseCase<GetUserProfileCommand, Promise<GetUserProfileDto>> {}
